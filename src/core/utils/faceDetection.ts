/**
 * Uses the native browser FaceDetector API (Shape Detection API) when
 * available — no external model download, no network dependency, so it
 * works fully offline. Currently supported in Chromium-based browsers only;
 * Safari/Firefox don't implement it yet. When unsupported, we say so
 * honestly rather than faking a pass — the photo is queued for manual
 * admin review instead.
 */

export type FaceCheckResult = { supported: boolean; hasFace: boolean }

declare global {
  interface Window {
    FaceDetector?: new (options?: { maxDetectedFaces?: number; fastMode?: boolean }) => {
      detect: (image: ImageBitmapSource) => Promise<unknown[]>
    }
  }
}

export async function checkImageHasFace(file: File): Promise<FaceCheckResult> {
  if (typeof window === 'undefined' || !window.FaceDetector) {
    return { supported: false, hasFace: false }
  }
  try {
    const bitmap = await createImageBitmap(file)
    const detector = new window.FaceDetector({ maxDetectedFaces: 3, fastMode: true })
    const faces = await detector.detect(bitmap)
    return { supported: true, hasFace: faces.length > 0 }
  } catch {
    return { supported: false, hasFace: false }
  }
}
