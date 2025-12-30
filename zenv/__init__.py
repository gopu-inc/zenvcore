"""
Zenv Package Manager
Version: 1.0.0
"""

__version__ = "1.0.0"
__author__ = "Gopu.Inc"
__license__ = "MIT"

# Lire le README pour la documentation
def get_readme():
    """Retourner le contenu du README"""
    import os
    readme_path = os.path.join(os.path.dirname(__file__), '..', 'README.md')
    try:
        with open(readme_path, 'r', encoding='utf-8') as f:
            return f.read()
    except:
        return "Zenv Package Manager - Gestionnaire de packages avec support .zv/.zcf"

# Exporter uniquement les éléments nécessaires
__all__ = ['__version__', '__author__', '__license__', 'get_readme']
