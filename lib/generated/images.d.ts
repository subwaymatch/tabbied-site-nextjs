// Hand-written types for the generated manifest (scripts/build-image-manifest.mjs).
declare const imageManifest: Record<
  string,
  {
    hash: string;
    width: number;
    height: number;
    formats: string[];
    /** Served directory, e.g. "/images/mockups". Absent means /images/sites. */
    base?: string;
  }
>;
export default imageManifest;
