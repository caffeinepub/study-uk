# Specification

## Summary
**Goal:** Fix ambient sound player audio source errors in Chrome browser by replacing broken audio URLs with reliable sources and adding proper error handling.

**Planned changes:**
- Replace all six ambient sound URLs (rain, coffee shop, forest, waves, white noise, lofi beats) in `useAmbientSound.ts` with publicly accessible MP3/OGG audio sources that work in Chrome
- Add comprehensive error handling and logging to catch audio loading and playback failures with specific error messages
- Properly initialize Audio element with error listeners attached before setting source and appropriate preload settings

**User-visible outcome:** Users can successfully play all ambient sounds without "no supported source" errors, with the audio player working reliably in Chrome browser.
