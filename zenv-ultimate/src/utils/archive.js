import * as fflate from 'fflate';

/**
 * Télécharge une archive .zv (zip/tar) et extrait le README et le Manifeste
 * Ceci s'exécute côté CLIENT dans le navigateur.
 */
export const extractPackageData = async (url) => {
  try {
    // 1. Télécharger le blob binaire
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to download package archive");
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    return new Promise((resolve, reject) => {
      // 2. Décompression (supposons ZIP pour .zv standard, ou GZIP)
      // On essaie d'abord en tant que ZIP
      fflate.unzip(uint8Array, (err, unzipped) => {
        if (err) {
            // Si échec ZIP, c'est peut-être un tar.gz, mais restons simple pour l'exemple
            // Zenv CLI v2 utilise souvent ZIP par défaut pour .zv
            reject(err);
            return;
        }

        let readmeContent = null;
        let manifestContent = null;
        let fileList = [];

        // 3. Parcourir les fichiers extraits
        for (const [path, fileData] of Object.entries(unzipped)) {
            fileList.push({ path, size: fileData.length });
            
            const lower = path.toLowerCase();
            // Chercher README
            if (lower.includes('readme.md') || lower.includes('readme.txt')) {
                // Convertir Uint8Array en String
                readmeContent = new TextDecoder().decode(fileData);
            }
            // Chercher Manifeste
            if (lower.includes('package.zcf') || lower.includes('manifest.toml')) {
                manifestContent = new TextDecoder().decode(fileData);
            }
        }

        resolve({
            readme: readmeContent || "# No README found in archive",
            manifest: manifestContent || "# No manifest found",
            files: fileList
        });
      });
    });
  } catch (error) {
    console.error("Archive extraction failed:", error);
    return null;
  }
};