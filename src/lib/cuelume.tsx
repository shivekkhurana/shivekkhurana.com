import { useEffect } from 'react';
import type { SoundName } from 'cuelume';

export enum CuelumeSound {
  Bloom = 'bloom',
  Chime = 'chime',
  Droplet = 'droplet',
  Error = 'error',
  Loading = 'loading',
  Page = 'page',
  Press = 'press',
  Ready = 'ready',
  Release = 'release',
  Sparkle = 'sparkle',
  Success = 'success',
  Tick = 'tick',
  Toggle = 'toggle',
  Whisper = 'whisper',
}

export function CuelumeBinding({ volume = 0.55 }: { volume?: number }) {
  useEffect(() => {
    let isActive = true;

    void import('cuelume').then(({ bind, setVolume }) => {
      if (!isActive) {
        return;
      }

      setVolume(volume);
      bind();
    });

    return () => {
      isActive = false;
    };
  }, [volume]);

  return null;
}

export function playCuelumeSound(sound: SoundName) {
  void import('cuelume').then(({ play }) => {
    play(sound);
  });
}
