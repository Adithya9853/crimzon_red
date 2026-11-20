import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MUSIC_SRC = '/preetham/music/Killin%20Em%20Scene%20128%20Kbps.mp3';

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!playbackError) return;
    const timer = window.setTimeout(() => setPlaybackError(false), 3000);
    return () => window.clearTimeout(timer);
  }, [playbackError]);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    setPlaybackError(false);
    audio.loop = true;

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      setPlaybackError(true);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-7 sm:bottom-7">
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setPlaybackError(true);
        }}
      />

      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isPlaying}
        aria-label={
          playbackError
            ? 'Background music unavailable, click to retry'
            : isPlaying
              ? 'Pause background music'
              : 'Play background music'
        }
        title={isPlaying ? 'Pause Music' : 'Play Music'}
        className={`luminous-card group flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center gap-2.5 rounded-full px-3.5 py-2.5 text-xs font-mono tracking-[0.16em] uppercase transition-all focus-visible:outline-2 focus-visible:outline-[#ff2e63] sm:px-4 ${
          isPlaying
            ? 'border-[#f43f5e]/75 bg-[#1b0710]/90 text-white shadow-[0_0_24px_-4px_rgba(244,63,94,0.65)]'
            : 'border-[#ff3b62]/30 bg-[#0d0408]/85 text-white/75 hover:border-[#f43f5e]/65 hover:text-white'
        }`}
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
            isPlaying
              ? 'border-[#f43f5e]/70 bg-[#e11d48]/25 text-[#fda4af]'
              : 'border-white/15 bg-white/5 text-white/70 group-hover:border-[#f43f5e]/50 group-hover:text-white'
          }`}
        >
          {isPlaying ? (
            <Volume2 className="h-3.5 w-3.5" />
          ) : (
            <VolumeX className="h-3.5 w-3.5" />
          )}
        </span>

        {isPlaying && (
          <span aria-hidden="true" className="flex h-3 items-end gap-0.5">
            <span className="h-2 w-0.5 animate-pulse rounded-full bg-[#fb7185]" />
            <span className="h-3 w-0.5 animate-pulse rounded-full bg-[#f43f5e] [animation-delay:150ms]" />
            <span className="h-1.5 w-0.5 animate-pulse rounded-full bg-[#fda4af] [animation-delay:300ms]" />
          </span>
        )}

        <span className="hidden text-[11px] font-semibold sm:inline">
          {playbackError
            ? 'Audio Error'
            : isPlaying
              ? 'Music On'
              : 'Music Off'}
        </span>
      </button>
    </div>
  );
}
