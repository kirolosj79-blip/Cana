import { useEffect, useRef } from 'react'
import { useMusicPrefStore } from '@/store/musicPref.store'

// The member's own track, hosted directly in this project (not an
// external CDN link) so it never depends on a third-party service staying
// available — served as a normal static asset alongside the app itself.
const TRACK_URL = '/audio/background-music.mp3'

/**
 * Mounted once at the very root of the app (not inside any single screen),
 * so background music genuinely starts "from the moment the site opens" —
 * including on Splash and Onboarding, which don't render the TopBar where
 * the pause/volume control (`MusicControl`) lives.
 */
export function GlobalBackgroundMusic() {
  const enabled = useMusicPrefStore((s) => s.enabled)
  const volume = useMusicPrefStore((s) => s.volume)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Most browsers block audio autoplay-with-sound until the visitor has
  // interacted with the page at least once. We still attempt it
  // immediately on load (works in some browsers/contexts); if blocked,
  // this retries on the very first tap/click/keypress anywhere on the
  // page, so playback starts as close to "the moment the site opens" as
  // the platform allows, with no manual "Play" press ever required.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const tryPlay = () => {
      if (!useMusicPrefStore.getState().enabled) return
      audio.play().catch(() => {})
    }

    tryPlay()

    const onFirstInteraction = () => {
      tryPlay()
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
    window.addEventListener('pointerdown', onFirstInteraction)
    window.addEventListener('keydown', onFirstInteraction)
    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (enabled) audio.play().catch(() => {})
    else audio.pause()
  }, [enabled])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  return <audio ref={audioRef} src={TRACK_URL} loop preload="auto" />
}
