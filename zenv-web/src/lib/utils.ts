import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URL = "https://zenv-hub.onrender.com/api";

export async function fetchPackages() {
  try {
    // Revalidate = 0 pour toujours avoir les données fraîches
    const res = await fetch(`${API_URL}/packages`, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  } catch (e) {
    return { packages: [] };
  }
}

export async function fetchPackageDetails(name: string) {
  try {
    const encodedName = encodeURIComponent(name);
    const resInfo = await fetch(`${API_URL}/packages/${encodedName}/latest`, { cache: 'no-store' });
    const pkg = resInfo.ok ? await resInfo.json() : null;

    if (!pkg) return null;

    let markdownContent = pkg.description || "# No description provided";
    const resReadme = await fetch(`${API_URL}/readme/${encodedName}`);
    if (resReadme.ok) {
        markdownContent = await resReadme.text();
    }

    return { ...pkg, markdownContent };
  } catch (e) {
    console.error(e);
    return null;
  }
}
