#!/usr/bin/env python3
"""
Zenv Package Manager - Client CLI
Version: 2.0.0
Format: .zv (archive) + .zcf (TOML manifest)
"""
import os
import sys
import json
import toml
import hashlib
import tarfile
import tempfile
import shutil
import zipfile
import argparse
from pathlib import Path
from datetime import datetime
import subprocess
import requests
import configparser
import uuid
import urllib.parse

class ZenvCLI:
    """Client CLI pour le gestionnaire de packages Zenv"""
    
    def __init__(self):
        self.config_dir = Path.home() / ".zenv"
        self.config_file = self.config_dir / "config.toml"
        self.cache_dir = self.config_dir / "cache"
        self.packages_dir = self.config_dir / "packages"
        self.bin_dir = self.config_dir / "bin"
        self.lib_dir = self.config_dir / "lib"
        self.site_dir = Path.home() / "usr" / "lib" / "zenv-site"
        
        # Créer les répertoires
        for dir_path in [self.config_dir, self.cache_dir, self.packages_dir, 
                        self.bin_dir, self.lib_dir, self.site_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        self.config = self.load_config()
        
        # Lire l'URL du hub et le token correctement
        if 'hub' in self.config and 'url' in self.config['hub']:
            self.hub_url = self.config['hub']['url']
        else:
            self.hub_url = "https://zenv-hub.onrender.com"
        
        if 'auth' in self.config and 'token' in self.config['auth']:
            self.token = self.config['auth']['token']
        else:
            self.token = None
        
    def encode_package_name(self, package_name: str) -> str:
        """Encoder le nom du package pour l'URL"""
        return urllib.parse.quote(package_name, safe='')
    
    def decode_package_name(self, encoded_name: str) -> str:
        """Décoder le nom du package depuis l'URL"""
        return urllib.parse.unquote(encoded_name)
    
    def load_config(self):
        """Charger la configuration TOML"""
        if self.config_file.exists():
            try:
                return toml.load(self.config_file)
            except:
                return self.create_default_config()
        return self.create_default_config()
    
    def create_default_config(self):
        """Créer une configuration par défaut"""
        default_config = {
            "hub": {
                "url": "https://zenv-hub.onrender.com",
                "api_version": "2.2.0"
            },
            "auth": {
                "token": None,
                "username": None
            },
            "paths": {
                "site_dir": str(self.site_dir),
                "bin_dir": str(self.bin_dir),
                "cache_dir": str(self.cache_dir)
            },
            "settings": {
                "auto_update": True,
                "check_updates": True,
                "default_namespace": "gopu-inc",
                "timeout": 30,
                "pip_path": "pip3"
            }
        }
        return default_config
    
    def save_config(self):
        """Sauvegarder la configuration TOML"""
        with open(self.config_file, 'w') as f:
            toml.dump(self.config, f)
    
    def parse_zcf(self, manifest_path: Path):
        """Parser un fichier manifeste .zcf (TOML format)"""
        try:
            with open(manifest_path, 'r') as f:
                content = f.read()
            
            # Essayer TOML d'abord
            try:
                return toml.loads(content)
            except:
                # Fallback: format INI (ancienne version)
                return self.parse_zcf_ini(content)
                
        except Exception as e:
            print(f"❌ Erreur parsing manifeste: {e}")
            return {}
    
    def parse_zcf_ini(self, content: str):
        """Parser l'ancien format INI"""
        config = configparser.ConfigParser()
        config.read_string(content)
        
        manifest = {}
        for section in config.sections():
            manifest[section] = dict(config[section])
        
        # Traitement spécial pour les listes
        if 'File-build' in manifest:
            for key in ['include', 'exclude']:
                if key in manifest['File-build']:
                    value = manifest['File-build'][key]
                    if isinstance(value, str):
                        # Convertir chaîne multiligne en liste
                        lines = [line.strip() for line in value.split('\n') 
                                if line.strip() and not line.startswith('#')]
                        manifest['File-build'][key] = lines
        
        return manifest
    
    def collect_files(self, manifest, base_dir: Path):
        """Collecter les fichiers à inclure dans l'archive"""
        if 'File-build' not in manifest:
            return list(base_dir.rglob('*'))
        
        fb = manifest['File-build']
        includes = fb.get('include', [])
        excludes = fb.get('exclude', [])
        
        if not includes:
            includes = ['*']
        
        # Convertir les patterns en chemins
        collected = set()
        
        for pattern in includes:
            pattern = pattern.strip()
            if not pattern:
                continue
            
            # Gérer les patterns glob
            if '*' in pattern or '?' in pattern or '[' in pattern:
                for path in base_dir.glob(pattern):
                    if path.is_file():
                        collected.add(path)
                    elif path.is_dir():
                        collected.update(path.rglob('*'))
            else:
                # Chemin simple
                path = base_dir / pattern
                if path.exists():
                    if path.is_file():
                        collected.add(path)
                    elif path.is_dir():
                        collected.update(path.rglob('*'))
        
        # Exclure les fichiers
        final_files = []
        for file_path in collected:
            if file_path.is_file():
                rel_path = file_path.relative_to(base_dir)
                exclude = False
                
                # Vérifier les exclusions
                for pattern in excludes:
                    pattern = pattern.strip()
                    if not pattern:
                        continue
                    
                    # Vérifier si le fichier correspond au pattern
                    if '*' in pattern or '?' in pattern or '[' in pattern:
                        if rel_path.match(pattern):
                            exclude = True
                            break
                    elif str(rel_path).startswith(pattern):
                        exclude = True
                        break
                
                if not exclude:
                    final_files.append(file_path)
        
        return final_files
    
    def create_archive(self, manifest, base_dir: Path, output_path: Path) -> Path:
        """Créer une archive .zv"""
        # Collecter les fichiers
        files = self.collect_files(manifest, base_dir)
        
        # Mettre à jour le manifeste avec les métadonnées
        if 'Metadata' not in manifest:
            manifest['Metadata'] = {}
        
        manifest['Metadata']['uuid'] = str(uuid.uuid4())
        manifest['Metadata']['created'] = datetime.now().isoformat()
        manifest['Metadata']['zenv_version'] = '2.0.0'
        
        # Calculer le hash des fichiers
        file_hashes = {}
        for file_path in files:
            rel_path = file_path.relative_to(base_dir)
            with open(file_path, 'rb') as f:
                file_hashes[str(rel_path)] = hashlib.sha256(f.read()).hexdigest()
        
        manifest['Metadata']['file_hashes'] = file_hashes
        manifest['Metadata']['total_hash'] = hashlib.sha256(
            json.dumps(file_hashes, sort_keys=True).encode()
        ).hexdigest()
        
        # Créer un répertoire temporaire
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            
            # Copier les fichiers
            for file_path in files:
                rel_path = file_path.relative_to(base_dir)
                dest_path = temp_path / rel_path
                dest_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(file_path, dest_path)
            
            # Sauvegarder le manifeste mis à jour (format TOML)
            manifest_path = temp_path / "package.zcf"
            with open(manifest_path, 'w') as f:
                toml.dump(manifest, f)
            
            # Créer l'archive
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Déterminer le type de compression
            compression = manifest.get('Build', {}).get('compression', 'gzip')
            
            if compression == 'gzip':
                # Archive tar.gz
                with tarfile.open(output_path, 'w:gz') as tar:
                    tar.add(temp_path, arcname='.')
                print(f"📦 Archive créée (gzip): {output_path}")
            else:
                # Archive zip par défaut
                with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for file_path in temp_path.rglob('*'):
                        if file_path.is_file():
                            rel_path = file_path.relative_to(temp_path)
                            zipf.write(file_path, rel_path)
                print(f"📦 Archive créée (zip): {output_path}")
        
        print(f"✅ Fichiers inclus: {len(files)}")
        print(f"🔐 Hash: {manifest['Metadata']['total_hash'][:16]}...")
        
        return output_path
    
    def install_package(self, package_name: str, version: str = None):
        """Installer un package"""
        print(f"📦 Installation de {package_name}...")
        
        # CAS SPÉCIAL: zenv[core] - installation via pip
        if package_name in ["zenv[core]", "zenv-core"]:
            self.install_zenv_core(version)
            return
        
        # Vérifier si déjà installé
        installed = self.get_installed_package(package_name)
        if installed:
            print(f"⚠️ Package déjà installé: version {installed['version']}")
            response = input("Voulez-vous mettre à jour? (o/N): ")
            if response.lower() != 'o':
                return
        
        # Récupérer les informations du package
        package_info = self.get_package_info(package_name, version)
        if not package_info:
            print(f"❌ Package non trouvé: {package_name}")
            return
        
        # Télécharger l'archive
        archive_path = self.download_package(package_name, package_info['version'])
        if not archive_path:
            print("❌ Échec du téléchargement")
            return
        
        # Extraire et installer
        success = self.extract_and_install(archive_path, package_info)
        if success:
            print(f"✅ Package installé: {package_name} v{package_info['version']}")
            
            # Mettre à jour la base de données des packages
            self.update_package_db(package_name, package_info)
            
            # Créer les entrypoints
            self.create_entrypoints(package_info)
            
            # Afficher les commandes disponibles
            self.show_available_commands(package_info)
        else:
            print("❌ Échec de l'installation")
    
    def install_zenv_core(self, version: str = None):
        """Installer zenv[core] via pip"""
        print("🚀 Installation de zenv[core]...")
        
        # Vérifier la version demandée
        if version:
            package_spec = f"zenv[core]=={version}"
        else:
            # Récupérer la dernière version depuis le hub
            latest_version = self.get_latest_zenv_core_version()
            if latest_version:
                package_spec = f"zenv[core]=={latest_version}"
                print(f"📦 Dernière version: {latest_version}")
            else:
                package_spec = "zenv[core]"
                print("⚠️ Version non spécifiée, installation de la dernière")
        
        # Installer via pip
        pip_path = self.config.get('settings', {}).get('pip_path', 'pip3')
        
        try:
            print(f"🔧 Installation avec {pip_path}...")
            result = subprocess.run(
                [pip_path, "install", package_spec],
                capture_output=True,
                text=True,
                check=True
            )
            
            if result.returncode == 0:
                print("✅ zenv[core] installé avec succès")
                
                # Vérifier l'installation
                self.verify_zenv_core_installation()
                
                # Mettre à jour la configuration
                self.update_zenv_core_config(version or latest_version or "latest")
            else:
                print(f"❌ Erreur d'installation: {result.stderr}")
                
        except subprocess.CalledProcessError as e:
            print(f"❌ Erreur pip: {e}")
        except FileNotFoundError:
            print(f"❌ {pip_path} non trouvé. Assurez-vous que Python/pip est installé")
    
    def get_latest_zenv_core_version(self):
        """Récupérer la dernière version de zenv[core] depuis le hub"""
        try:
            url = f"{self.hub_url}/api/zenv-core/version"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return data.get('version')
        except:
            pass
        
        # Fallback: essayer de récupérer depuis PyPI
        try:
            import xmlrpc.client
            client = xmlrpc.client.ServerProxy('https://pypi.org/pypi')
            versions = client.package_releases('zenv[core]')
            if versions:
                return versions[0]
        except:
            pass
        
        return None
    
    def verify_zenv_core_installation(self):
        """Vérifier que zenv[core] est bien installé"""
        try:
            result = subprocess.run(
                ["python3", "-c", "import zenv; print(f'Zenv version: {zenv.__version__}')"],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                print(f"🔍 {result.stdout.strip()}")
            else:
                # Essayer avec la commande zenv directement
                result = subprocess.run(
                    ["zenv", "--version"],
                    capture_output=True,
                    text=True
                )
                if result.returncode == 0:
                    print(f"🔍 {result.stdout.strip()}")
        except:
            print("⚠️ Impossible de vérifier la version de zenv")
    
    def update_zenv_core_config(self, version: str):
        """Mettre à jour la configuration pour zenv[core]"""
        db = self.get_installed_db()
        
        # Ajouter ou mettre à jour zenv[core]
        zenv_core_info = {
            'name': 'zenv[core]',
            'version': version,
            'installed_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'install_method': 'pip',
            'install_path': 'system'
        }
        
        # Mettre à jour la base de données
        updated = False
        for i, pkg in enumerate(db['packages']):
            if pkg['name'] == 'zenv[core]':
                db['packages'][i] = zenv_core_info
                updated = True
                break
        
        if not updated:
            db['packages'].append(zenv_core_info)
        
        db_path = self.config_dir / "installed.toml"
        with open(db_path, 'w') as f:
            toml.dump(db, f)
        
        print("📝 Configuration mise à jour")
    
    def get_package_info(self, package_name: str, version: str = None):
        """Récupérer les informations d'un package depuis le hub"""
        try:
            encoded_name = self.encode_package_name(package_name)
            
            if version:
                url = f"{self.hub_url}/api/packages/{encoded_name}/{version}"
            else:
                url = f"{self.hub_url}/api/packages/{encoded_name}/latest"
            
            headers = {}
            if self.token:
                headers['Authorization'] = f'Bearer {self.token}'
            
            timeout = self.config.get('settings', {}).get('timeout', 30)
            response = requests.get(url, headers=headers, timeout=timeout)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Erreur API: {response.status_code}")
                if response.status_code == 404:
                    print(f"⚠️ Package non trouvé: {package_name}")
        except requests.exceptions.Timeout:
            print("❌ Timeout: Le serveur ne répond pas")
        except Exception as e:
            print(f"❌ Erreur: {e}")
        
        return None
    
    def download_package(self, package_name: str, version: str):
        """Télécharger un package"""
        try:
            encoded_name = self.encode_package_name(package_name)
            url = f"{self.hub_url}/api/packages/download/{encoded_name}/{version}"
            
            headers = {}
            if self.token:
                headers['Authorization'] = f'Bearer {self.token}'
            
            response = requests.get(url, headers=headers, stream=True, timeout=60)
            if response.status_code == 200:
                # Créer le chemin de cache
                cache_file = self.cache_dir / f"{package_name}-{version}.zv"
                
                total_size = int(response.headers.get('content-length', 0))
                downloaded = 0
                
                with open(cache_file, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                            downloaded += len(chunk)
                            
                            # Afficher la progression
                            if total_size > 0:
                                percent = (downloaded / total_size) * 100
                                sys.stdout.write(f"\r⬇️  Téléchargement: {percent:.1f}%")
                                sys.stdout.flush()
                
                print()  # Nouvelle ligne
                print(f"✅ Téléchargé: {cache_file.name} ({downloaded / 1024:.1f} KB)")
                return cache_file
            else:
                print(f"❌ Erreur de téléchargement: {response.status_code}")
                if response.status_code == 404:
                    print(f"⚠️ Package non trouvé: {package_name} v{version}")
                
        except Exception as e:
            print(f"❌ Erreur de téléchargement: {e}")
        
        return None
    
    def extract_and_install(self, archive_path: Path, package_info):
        """Extraire et installer un package"""
        try:
            # Créer le répertoire d'installation
            package_name = package_info['name']
            version = package_info['version']
            
            # Générer un hash unique pour le chemin
            hash_id = hashlib.md5(f"{package_name}-{version}".encode()).hexdigest()[:8]
            install_path = self.site_dir / hash_id
            
            if install_path.exists():
                print(f"🗑️  Suppression de l'ancienne version...")
                shutil.rmtree(install_path)
            
            install_path.mkdir(parents=True, exist_ok=True)
            
            # Extraire l'archive
            print(f"📂 Extraction vers: {install_path}")
            
            try:
                # Essayer tar.gz d'abord
                with tarfile.open(archive_path, 'r:gz') as tar:
                    tar.extractall(install_path)
            except:
                try:
                    # Essayer tar simple
                    with tarfile.open(archive_path, 'r') as tar:
                        tar.extractall(install_path)
                except:
                    # Essayer zip
                    with zipfile.ZipFile(archive_path, 'r') as zipf:
                        zipf.extractall(install_path)
            
            # Sauvegarder les métadonnées
            meta_path = install_path / ".zenv-meta.toml"
            meta_data = {
                'package': {
                    'name': package_name,
                    'version': version,
                    'installed_at': datetime.now().isoformat(),
                    'install_path': str(install_path),
                    'hash_id': hash_id
                }
            }
            
            with open(meta_path, 'w') as f:
                toml.dump(meta_data, f)
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur d'extraction: {e}")
            return False
    
    def create_entrypoints(self, package_info):
        """Créer les entrypoints (liens symboliques ou wrappers)"""
        try:
            # Trouver le répertoire d'installation
            package_name = package_info['name']
            version = package_info['version']
            hash_id = hashlib.md5(f"{package_name}-{version}".encode()).hexdigest()[:8]
            install_path = self.site_dir / hash_id
            
            # Lire le manifeste si présent
            manifest_path = install_path / "package.zcf"
            if manifest_path.exists():
                manifest = self.parse_zcf(manifest_path)
                
                if 'entrypoint' in manifest:
                    entrypoints = manifest['entrypoint']
                    if isinstance(entrypoints, dict):
                        for cmd_name, script_path in entrypoints.items():
                            # Chemin complet du script
                            script_full_path = install_path / script_path
                            
                            if script_full_path.exists():
                                # Créer un wrapper dans ~/.zenv/bin
                                wrapper_path = self.bin_dir / cmd_name
                                
                                # Déterminer l'interpréteur
                                if script_path.endswith('.py'):
                                    shebang = '#!/usr/bin/env python3'
                                elif script_path.endswith('.zv'):
                                    shebang = '#!/usr/bin/env zenv'
                                else:
                                    shebang = '#!/bin/bash'
                                
                                with open(wrapper_path, 'w') as f:
                                    f.write(f"""{shebang}
# Wrapper pour {package_name} - {cmd_name}
# Généré automatiquement par Zenv Package Manager
# Version: {version}

export ZENV_PACKAGE_PATH="{install_path}"
export ZENV_PACKAGE_NAME="{package_name}"
export ZENV_PACKAGE_VERSION="{version}"

# Exécuter le script
cd "{install_path}"
exec "{script_full_path}" "$@"
""")
                                
                                # Rendre exécutable
                                wrapper_path.chmod(0o755)
                                print(f"  📝 Entrypoint créé: {cmd_name}")
            
            # Ajouter au PATH si nécessaire
            self.ensure_path_in_shell()
            
        except Exception as e:
            print(f"⚠️ Erreur création entrypoints: {e}")
    
    def show_available_commands(self, package_info):
        """Afficher les commandes disponibles après installation"""
        try:
            package_name = package_info['name']
            hash_id = hashlib.md5(f"{package_name}-{package_info['version']}".encode()).hexdigest()[:8]
            install_path = self.site_dir / hash_id
            
            manifest_path = install_path / "package.zcf"
            if manifest_path.exists():
                manifest = self.parse_zcf(manifest_path)
                
                if 'entrypoint' in manifest:
                    entrypoints = manifest['entrypoint']
                    if isinstance(entrypoints, dict) and entrypoints:
                        print("🚀 Commandes disponibles:")
                        for cmd_name in entrypoints.keys():
                            print(f"   • {cmd_name}")
                        print()
        except:
            pass
    
    def ensure_path_in_shell(self):
        """S'assurer que ~/.zenv/bin est dans le PATH"""
        zenv_bin = str(self.bin_dir)
        
        # Vérifier si déjà dans le PATH
        current_path = os.environ.get('PATH', '')
        if zenv_bin in current_path:
            return
        
        # Vérifier les fichiers de configuration shell
        shell_configs = [
            Path.home() / ".bashrc",
            Path.home() / ".zshrc",
            Path.home() / ".profile",
            Path.home() / ".bash_profile"
        ]
        
        path_line = f'export PATH="{zenv_bin}:$PATH"\n'
        
        for config_file in shell_configs:
            if config_file.exists():
                content = config_file.read_text()
                if zenv_bin not in content:
                    with open(config_file, 'a') as f:
                        f.write(f"\n# Added by Zenv Package Manager\n{path_line}")
                    print(f"  🔧 PATH ajouté à {config_file.name}")
    
    def get_installed_package(self, package_name: str):
        """Vérifier si un package est déjà installé"""
        installed_db = self.get_installed_db()
        
        for pkg in installed_db.get('packages', []):
            if pkg['name'] == package_name:
                return pkg
        
        # Vérifier dans les répertoires d'installation
        for dir_path in self.site_dir.iterdir():
            if dir_path.is_dir():
                meta_path = dir_path / ".zenv-meta.toml"
                if meta_path.exists():
                    try:
                        meta = toml.load(meta_path)
                        if meta['package']['name'] == package_name:
                            return meta['package']
                    except:
                        continue
        return None
    
    def get_installed_db(self):
        """Obtenir la base de données des packages installés"""
        db_path = self.config_dir / "installed.toml"
        
        if db_path.exists():
            try:
                return toml.load(db_path)
            except:
                return {'packages': []}
        return {'packages': []}
    
    def update_package_db(self, package_name: str, package_info):
        """Mettre à jour la base de données des packages installés"""
        db = self.get_installed_db()
        
        # Vérifier si le package est déjà dans la liste
        updated = False
        for i, pkg in enumerate(db['packages']):
            if pkg['name'] == package_name:
                db['packages'][i] = {
                    **package_info,
                    'installed_at': datetime.now().isoformat(),
                    'updated_at': datetime.now().isoformat(),
                    'install_path': str(self.site_dir / hashlib.md5(f"{package_name}-{package_info['version']}".encode()).hexdigest()[:8])
                }
                updated = True
                break
        
        if not updated:
            db['packages'].append({
                **package_info,
                'installed_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat(),
                'install_path': str(self.site_dir / hashlib.md5(f"{package_name}-{package_info['version']}".encode()).hexdigest()[:8])
            })
        
        db_path = self.config_dir / "installed.toml"
        with open(db_path, 'w') as f:
            toml.dump(db, f)
    
    def publish_package(self, manifest_path: str = "package.zcf"):
        """Publier un package sur le hub"""
        manifest_path = Path(manifest_path)
        if not manifest_path.exists():
            print(f"❌ Manifeste non trouvé: {manifest_path}")
            return
        
        # Parser le manifeste
        manifest = self.parse_zcf(manifest_path)
        
        if 'Zenv' not in manifest:
            print("❌ Section [Zenv] manquante dans le manifeste")
            return
        
        package_name = manifest['Zenv'].get('name')
        version = manifest['Zenv'].get('version')
        
        if not package_name or not version:
            print("❌ Nom ou version manquant dans le manifeste")
            return
        
        # Vérifier le token
        if not self.token:
            print("❌ Token d'authentification manquant")
            print("Utilisez: zenv auth <token>")
            return
        
        # Construire le package
        print(f"🏗️  Construction du package {package_name} v{version}...")
        base_dir = manifest_path.parent
        output_filename = f"{package_name.replace('[', '-').replace(']', '')}-{version}.zv"
        output_path = base_dir / "dist" / output_filename
        
        archive_path = self.create_archive(manifest, base_dir, output_path)
        
        # Vérifier si le package existe déjà
        existing_package = self.get_package_info(package_name, version)
        if existing_package:
            print(f"⚠️ Package {package_name} v{version} existe déjà")
            response = input("Voulez-vous le remplacer? (o/N): ")
            if response.lower() != 'o':
                return
        
        # Publier sur le hub
        print(f"📤 Publication sur {self.hub_url}...")
        success = self.upload_to_hub(archive_path, manifest)
        
        if success:
            print(f"✅ Package publié: {package_name} v{version}")
            print(f"🔗 URL: {self.hub_url}/api/packages/download/{package_name}/{version}")
        else:
            print("❌ Échec de la publication")
    
    def upload_to_hub(self, archive_path: Path, manifest):
        """Uploader un package sur le hub"""
        try:
            url = f"{self.hub_url}/api/packages/upload"
            
            with open(archive_path, 'rb') as f:
                files = {
                    'file': (archive_path.name, f, 'application/octet-stream')
                }
                
                data = {
                    'name': manifest['Zenv']['name'],
                    'version': manifest['Zenv']['version'],
                    'author': manifest['Zenv'].get('author', 'Unknown'),
                    'description': manifest['Zenv'].get('description', ''),
                    'license': manifest['Zenv'].get('license', 'MIT'),
                    'namespace': manifest['Zenv'].get('namespace', 'gopu-inc')
                }
                
                headers = {
                    'Authorization': f'Bearer {self.token}'
                }
                
                timeout = self.config.get('settings', {}).get('timeout', 60)
                response = requests.post(url, files=files, data=data, headers=headers, timeout=timeout)
                
                if response.status_code in [200, 201]:
                    print("✅ Upload réussi!")
                    print(f"📊 Réponse: {response.json().get('message', 'Succès')}")
                    return True
                else:
                    print(f"❌ Erreur serveur: {response.status_code}")
                    if response.text:
                        try:
                            error_data = response.json()
                            print(f"Message: {error_data.get('error', response.text)}")
                        except:
                            print(f"Message: {response.text}")
                    return False
                
        except requests.exceptions.Timeout:
            print("❌ Timeout: Le serveur ne répond pas")
            return False
        except Exception as e:
            print(f"❌ Erreur d'upload: {e}")
            return False
    
    def build_package(self, manifest_path: str = "package.zcf", output_dir: str = "dist"):
        """Construire un package localement"""
        manifest_path = Path(manifest_path)
        if not manifest_path.exists():
            print(f"❌ Manifeste non trouvé: {manifest_path}")
            return
        
        manifest = self.parse_zcf(manifest_path)
        
        if 'Zenv' not in manifest:
            print("❌ Section [Zenv] manquante")
            return
        
        package_name = manifest['Zenv'].get('name')
        version = manifest['Zenv'].get('version')
        
        if not package_name or not version:
            print("❌ Nom ou version manquant")
            return
        
        print(f"🏗️  Construction de {package_name} v{version}...")
        
        base_dir = manifest_path.parent
        output_path = Path(output_dir) / f"{package_name.replace('[', '-').replace(']', '')}-{version}.zv"
        
        self.create_archive(manifest, base_dir, output_path)
    
    def list_installed(self, verbose: bool = False):
        """Lister les packages installés"""
        db = self.get_installed_db()
        
        if not db.get('packages'):
            print("📦 Aucun package installé")
            return
        
        print(f"📦 Packages installés ({len(db['packages'])}):")
        print("=" * 60)
        
        for pkg in db['packages']:
            print(f"• {pkg['name']} v{pkg['version']}")
            if verbose:
                print(f"  📝 {pkg.get('description', 'Pas de description')}")
                print(f"  👤 {pkg.get('author', 'Unknown')}")
                if 'install_path' in pkg:
                    print(f"  📍 {pkg.get('install_path', 'Unknown')}")
                print(f"  ⏰ Installé: {pkg.get('installed_at', 'Unknown')}")
                print()
    
    def uninstall_package(self, package_name: str):
        """Désinstaller un package"""
        # CAS SPÉCIAL: zenv[core] - désinstallation via pip
        if package_name in ["zenv[core]", "zenv-core"]:
            self.uninstall_zenv_core()
            return
        
        # Trouver le package installé
        package_meta = self.get_installed_package(package_name)
        if not package_meta:
            print(f"❌ Package non installé: {package_name}")
            return
        
        print(f"🗑️  Désinstallation de {package_name} v{package_meta.get('version', '?')}")
        confirm = input("Êtes-vous sûr? (o/N): ")
        if confirm.lower() != 'o':
            print("❌ Annulé")
            return
        
        # Supprimer le répertoire d'installation
        install_path = package_meta.get('install_path')
        if install_path:
            install_path = Path(install_path)
            if install_path.exists() and install_path.is_dir():
                shutil.rmtree(install_path)
                print(f"✅ Répertoire supprimé: {install_path}")
        
        # Supprimer les entrypoints
        self.remove_entrypoints(package_name)
        
        # Mettre à jour la base de données
        self.remove_from_package_db(package_name)
        
        print(f"✅ Package désinstallé: {package_name}")
    
    def uninstall_zenv_core(self):
        """Désinstaller zenv[core] via pip"""
        print("🗑️  Désinstallation de zenv[core]...")
        confirm = input("Êtes-vous sûr? Cette action désinstallera zenv du système (o/N): ")
        
        if confirm.lower() != 'o':
            print("❌ Annulé")
            return
        
        pip_path = self.config.get('settings', {}).get('pip_path', 'pip3')
        
        try:
            print(f"🔧 Désinstallation avec {pip_path}...")
            result = subprocess.run(
                [pip_path, "uninstall", "zenv[core]", "-y"],
                capture_output=True,
                text=True,
                check=True
            )
            
            if result.returncode == 0:
                print("✅ zenv[core] désinstallé")
                
                # Retirer de la base de données
                self.remove_from_package_db("zenv[core]")
            else:
                print(f"❌ Erreur: {result.stderr}")
                
        except subprocess.CalledProcessError as e:
            print(f"❌ Erreur pip: {e}")
        except FileNotFoundError:
            print(f"❌ {pip_path} non trouvé")
    
    def remove_entrypoints(self, package_name: str):
        """Supprimer les entrypoints d'un package"""
        # Parcourir tous les wrappers dans bin_dir
        for wrapper_path in self.bin_dir.glob("*"):
            if wrapper_path.is_file() and wrapper_path.stat().st_mode & 0o111:
                # Lire le wrapper pour vérifier le package
                try:
                    with open(wrapper_path, 'r') as f:
                        content = f.read()
                        if f'ZENV_PACKAGE_NAME="{package_name}"' in content:
                            wrapper_path.unlink()
                            print(f"  🗑️  Entrypoint supprimé: {wrapper_path.name}")
                except:
                    pass
    
    def remove_from_package_db(self, package_name: str):
        """Retirer un package de la base de données"""
        db = self.get_installed_db()
        
        if 'packages' in db:
            initial_count = len(db['packages'])
            db['packages'] = [pkg for pkg in db['packages'] 
                            if pkg['name'] != package_name]
            
            if len(db['packages']) < initial_count:
                db_path = self.config_dir / "installed.toml"
                with open(db_path, 'w') as f:
                    toml.dump(db, f)
    
    def auth_login(self, token: str):
        """Configurer le token d'authentification"""
        self.token = token
        
        # Mettre à jour la configuration
        if 'auth' not in self.config:
            self.config['auth'] = {}
        
        self.config['auth']['token'] = token
        self.save_config()
        print("✅ Token enregistré")
        
        # Essayer de récupérer le nom d'utilisateur
        try:
            url = f"{self.hub_url}/api/auth/profile"
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                profile = response.json()
                username = profile.get('user', {}).get('username')
                if username:
                    self.config['auth']['username'] = username
                    self.save_config()
                    print(f"👤 Connecté en tant que: {username}")
        except:
            pass
    
    def auth_logout(self):
        """Déconnexion"""
        self.token = None
        
        if 'auth' in self.config:
            self.config['auth']['token'] = None
            self.config['auth']['username'] = None
            self.save_config()
        
        print("✅ Déconnecté")
    
    def auth_status(self):
        """Afficher le statut d'authentification"""
        if self.token:
            username = self.config.get('auth', {}).get('username', 'Inconnu')
            print(f"✅ Authentifié en tant que: {username}")
            print(f"🔑 Token: {self.token[:20]}...")
        else:
            print("❌ Non authentifié")
            print("Utilisez: zenv auth <token>")
    
    def search_packages(self, query: str):
        """Rechercher des packages"""
        try:
            url = f"{self.hub_url}/api/packages/search"
            params = {'q': query}
            
            headers = {}
            if self.token:
                headers['Authorization'] = f'Bearer {self.token}'
            
            timeout = self.config.get('settings', {}).get('timeout', 30)
            response = requests.get(url, params=params, headers=headers, timeout=timeout)
            
            if response.status_code == 200:
                results = response.json()
                
                if not results.get('packages'):
                    print(f"🔍 Aucun résultat pour '{query}'")
                    return
                
                print(f"🔍 Résultats pour '{query}' ({results.get('count', 0)}):")
                print("=" * 60)
                
                for pkg in results['packages']:
                    print(f"📦 {pkg['name']} v{pkg['version']}")
                    print(f"   {pkg.get('description', '')}")
                    print(f"   👤 {pkg.get('author', 'Unknown')}")
                    print(f"   📄 {pkg.get('license', 'MIT')}")
                    print(f"   ⬇️  {pkg.get('downloads_count', 0)} téléchargements")
                    print(f"   🔗 zenv install {pkg['name']}")
                    print()
            else:
                print(f"❌ Erreur API: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Erreur: {e}")
    
    def info_package(self, package_name: str):
        """Afficher les informations d'un package"""
        # CAS SPÉCIAL: zenv[core]
        if package_name in ["zenv[core]", "zenv-core"]:
            self.info_zenv_core()
            return
        
        try:
            # Essayer d'abord localement
            installed = self.get_installed_package(package_name)
            if installed:
                print(f"📦 {package_name} (installé localement)")
                print("=" * 40)
                for key, value in installed.items():
                    if key not in ['install_path', 'updated_at']:
                        print(f"  {key}: {value}")
                print()
            
            # Récupérer depuis le hub
            package_info = self.get_package_info(package_name)
            if package_info:
                print(f"🌐 {package_name} (sur le hub)")
                print("=" * 40)
                print(f"  Version: {package_info.get('version')}")
                print(f"  Description: {package_info.get('description')}")
                print(f"  Auteur: {package_info.get('author')}")
                print(f"  Licence: {package_info.get('license')}")
                print(f"  Téléchargements: {package_info.get('downloads_count', 0)}")
                print(f"  Taille: {package_info.get('size', 0) / 1024:.1f} KB")
                print(f"  URL: {package_info.get('download_url')}")
                print()
                print(f"Pour installer: zenv install {package_name}")
            elif not installed:
                print(f"❌ Package non trouvé: {package_name}")
                
        except Exception as e:
            print(f"❌ Erreur: {e}")
    
    def info_zenv_core(self):
        """Afficher les informations de zenv[core]"""
        print("📦 zenv[core] - Core Zenv Package")
        print("=" * 40)
        
        # Vérifier la version installée
        installed = self.get_installed_package("zenv[core]")
        if installed:
            print(f"  Version installée: {installed.get('version', '?')}")
            print(f"  Méthode: {installed.get('install_method', 'pip')}")
            print(f"  Installé le: {installed.get('installed_at', '?')}")
            print()
        
        # Vérifier la dernière version sur le hub
        latest_version = self.get_latest_zenv_core_version()
        if latest_version:
            print(f"  Dernière version: {latest_version}")
        else:
            print(f"  Dernière version: inconnue")
        
        print()
        print("Pour installer/mettre à jour: zenv install zenv[core]")
        print("Pour désinstaller: zenv uninstall zenv[core]")
    
    def cleanup_cache(self):
        """Nettoyer le cache"""
        try:
            cache_size = 0
            cache_files = list(self.cache_dir.glob("*"))
            
            if not cache_files:
                print("🗑️  Cache vide")
                return
            
            for cache_file in cache_files:
                cache_size += cache_file.stat().st_size
            
            print(f"🗑️  Nettoyage du cache ({len(cache_files)} fichiers, {cache_size / 1024:.1f} KB)")
            confirm = input("Continuer? (o/N): ")
            
            if confirm.lower() == 'o':
                for cache_file in cache_files:
                    cache_file.unlink()
                print("✅ Cache nettoyé")
            else:
                print("❌ Annulé")
                
        except Exception as e:
            print(f"❌ Erreur: {e}")
    
    def doctor(self):
        """Vérifier l'état de l'installation Zenv"""
        print("🩺 Diagnostic Zenv...")
        print("=" * 40)
        
        # Vérifier les répertoires
        dirs_to_check = [
            (self.config_dir, "Répertoire de configuration"),
            (self.bin_dir, "Répertoire des binaires"),
            (self.site_dir, "Répertoire des sites"),
            (self.cache_dir, "Cache")
        ]
        
        all_ok = True
        for dir_path, description in dirs_to_check:
            if dir_path.exists() and dir_path.is_dir():
                print(f"✅ {description}: {dir_path}")
            else:
                print(f"❌ {description}: Manquant")
                all_ok = False
        
        # Vérifier le PATH
        zenv_bin = str(self.bin_dir)
        current_path = os.environ.get('PATH', '')
        if zenv_bin in current_path:
            print(f"✅ ~/.zenv/bin est dans le PATH")
        else:
            print(f"⚠️ ~/.zenv/bin n'est pas dans le PATH")
            print(f"   Ajoutez: export PATH=\"{zenv_bin}:$PATH\" à votre shell")
        
        # Vérifier Python et pip
        try:
            python_version = subprocess.run(
                ["python3", "--version"],
                capture_output=True,
                text=True
            )
            if python_version.returncode == 0:
                print(f"✅ {python_version.stdout.strip()}")
            else:
                print(f"❌ Python3 non trouvé")
                all_ok = False
        except:
            print(f"❌ Python3 non trouvé")
            all_ok = False
        
        try:
            pip_version = subprocess.run(
                ["pip3", "--version"],
                capture_output=True,
                text=True
            )
            if pip_version.returncode == 0:
                lines = pip_version.stdout.split('\n')
                print(f"✅ {lines[0]}")
            else:
                print(f"⚠️ pip3 non trouvé")
        except:
            print(f"⚠️ pip3 non trouvé")
        
        # Vérifier l'authentification
        if self.token:
            print(f"✅ Authentifié: {self.config.get('auth', {}).get('username', 'Inconnu')}")
        else:
            print(f"⚠️ Non authentifié (utilisez: zenv auth <token>)")
        
        # Vérifier les packages installés
        db = self.get_installed_db()
        package_count = len(db.get('packages', []))
        print(f"📦 Packages installés: {package_count}")
        
        if all_ok:
            print("\n✅ Tous les checks sont OK!")
        else:
            print("\n⚠️ Certains problèmes ont été détectés")

def main():
    """Fonction principale du CLI"""
    parser = argparse.ArgumentParser(
        description="Zenv Package Manager",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples:
  zenv install zenv[core]          # Installer zenv[core] via pip
  zenv install mon-package         # Installer un package normal
  zenv publish                     # Publier le package courant
  zenv search "web"                # Rechercher des packages
  zenv list                        # Lister les packages installés
  zenv info zenv[core]             # Informations sur zenv[core]
  zenv init                        # Initialiser un nouveau package
  zenv doctor                      # Vérifier l'installation
  zenv auth <token>                # S'authentifier
  zenv auth logout                 # Se déconnecter
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Commandes disponibles')
    
    # Commande install
    install_parser = subparsers.add_parser('install', help='Installer un package')
    install_parser.add_argument('package', help='Nom du package (ex: zenv[core] ou mon-package)')
    install_parser.add_argument('--version', '-v', help='Version spécifique')
    
    # Commande publish
    publish_parser = subparsers.add_parser('publish', help='Publier un package')
    publish_parser.add_argument('--manifest', '-m', default='package.zcf', 
                              help='Chemin du manifeste (défaut: package.zcf)')
    
    # Commande build
    build_parser = subparsers.add_parser('build', help='Construire un package localement')
    build_parser.add_argument('--manifest', '-m', default='package.zcf', 
                            help='Chemin du manifeste (défaut: package.zcf)')
    build_parser.add_argument('--output', '-o', default='dist', 
                            help='Répertoire de sortie (défaut: dist)')
    
    # Commande list
    list_parser = subparsers.add_parser('list', help='Lister les packages installés')
    list_parser.add_argument('--verbose', '-v', action='store_true', 
                           help='Afficher plus de détails')
    
    # Commande search
    search_parser = subparsers.add_parser('search', help='Rechercher des packages')
    search_parser.add_argument('query', help='Terme de recherche')
    
    # Commande info
    info_parser = subparsers.add_parser('info', help='Informations sur un package')
    info_parser.add_argument('package', help='Nom du package')
    
    # Commande uninstall
    uninstall_parser = subparsers.add_parser('uninstall', help='Désinstaller un package')
    uninstall_parser.add_argument('package', help='Nom du package')
    
    # Commandes auth
    auth_parser = subparsers.add_parser('auth', help='Authentification')
    auth_subparsers = auth_parser.add_subparsers(dest='auth_command', help='Sous-commandes auth')
    
    auth_login_parser = auth_subparsers.add_parser('login', help='Se connecter')
    auth_login_parser.add_argument('token', nargs='?', help='Token d\'authentification')
    
    auth_subparsers.add_parser('logout', help='Se déconnecter')
    auth_subparsers.add_parser('status', help='Statut d\'authentification')
    
    # Commande init
    subparsers.add_parser('init', help='Initialiser un nouveau package')
    
    # Commande doctor
    subparsers.add_parser('doctor', help='Vérifier l\'état de l\'installation')
    
    # Commande cleanup
    subparsers.add_parser('cleanup', help='Nettoyer le cache')
    
    # Commande version
    subparsers.add_parser('version', help='Afficher la version')
    
    args = parser.parse_args()
    
    # Si aucune commande, afficher l'aide
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    cli = ZenvCLI()
    
    try:
        if args.command == 'install':
            cli.install_package(args.package, args.version)
        elif args.command == 'publish':
            cli.publish_package(args.manifest)
        elif args.command == 'build':
            cli.build_package(args.manifest, args.output)
        elif args.command == 'list':
            cli.list_installed(args.verbose)
        elif args.command == 'search':
            cli.search_packages(args.query)
        elif args.command == 'info':
            cli.info_package(args.package)
        elif args.command == 'uninstall':
            cli.uninstall_package(args.package)
        elif args.command == 'auth':
            if args.auth_command == 'login':
                if args.token:
                    cli.auth_login(args.token)
                else:
                    # Demander le token interactivement
                    token = input("Token: ").strip()
                    if token:
                        cli.auth_login(token)
            elif args.auth_command == 'logout':
                cli.auth_logout()
            elif args.auth_command == 'status':
                cli.auth_status()
            else:
                auth_parser.print_help()
        elif args.command == 'init':
            create_template_manifest()
        elif args.command == 'doctor':
            cli.doctor()
        elif args.command == 'cleanup':
            cli.cleanup_cache()
        elif args.command == 'version':
            print("Zenv Package Manager v2.0.0")
            print(f"Hub: https://zenv-hub.onrender.com")
        else:
            parser.print_help()
            
    except KeyboardInterrupt:
        print("\n❌ Interrompu par l'utilisateur")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Erreur: {e}")
        sys.exit(1)

def create_template_manifest():
    """Créer un template de manifeste TOML"""
    template = """# Zenv Configuration File - Manifeste du package
# Format: TOML

[Zenv]
name = "mon-package"
version = "1.0.0"
author = "Votre Nom"
description = "Description de votre package"
license = "MIT"

[File-build]
main = "src/main.zv"
include = [
    "src/",
    "package.zcf",
    "bin/",
]
exclude = [
    "tests/",
    "__pycache__/",
    "*.tmp",
    ".git/",
]

[Dep.zv]
# Dépendances Zenv
zenv-utils = "1.0.0"

[Dep.py]
# Dépendances Python
requests = ">=2.28.0"

[entrypoint]
mon-commande = "src/main.zv"
cli = "bin/cli.py"

[Build]
type = "zenv"
entry_point = "src/main.zv"
output = "dist/{name}-{version}.zv"
compression = "gzip"
optimize = true

[Install]
target = "$HOME/.zenv/packages/{name}-{version}"
bin_path = "$HOME/.zenv/bin"
lib_path = "$HOME/.zenv/lib"

[Metadata]
# Ces champs seront automatiquement remplis
uuid = ""
created = ""
zenv_version = ""
total_hash = ""
"""
    
    manifest_path = Path("package.zcf")
    if manifest_path.exists():
        print("⚠️ package.zcf existe déjà")
        response = input("Voulez-vous l'écraser? (o/N): ")
        if response.lower() != 'o':
            return
    
    with open(manifest_path, 'w') as f:
        f.write(template)
    
    # Créer la structure de répertoires
    dirs_to_create = ["src", "bin", "dist"]
    for dir_name in dirs_to_create:
        Path(dir_name).mkdir(exist_ok=True)
    
    # Créer un fichier main.zv exemple
    main_content = """#!/usr/bin/env python3
# Script principal du package

def main():
    print("Bonjour depuis mon-package!")
    print("Ceci est un package Zenv.")

if __name__ == "__main__":
    main()
"""
    
    with open("src/main.zv", 'w') as f:
        f.write(main_content)
    
    print("✅ Structure créée:")
    print("   📄 package.zcf - Manifeste du package")
    print("   📄 src/main.zv - Script principal")
    print("   📁 src/ - Code source")
    print("   📁 bin/ - Scripts exécutables")
    print("   📁 dist/ - Archives de build")
    print("\n📝 Modifiez package.zcf selon vos besoins avant de publier")

if __name__ == '__main__':
    main()
