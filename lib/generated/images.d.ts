// Hand-written types for the generated manifest (scripts/build-image-manifest.mjs).
declare const imageManifest: Record<
  string,
  { hash: string; width: number; height: number; formats: string[] }
>;
export default imageManifest;
