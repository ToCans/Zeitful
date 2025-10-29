import type { RefObject } from "react";

// Play Audio for Button Clicks, Timer Finishing, etc.
export const playAudio = (audioRef: RefObject<HTMLAudioElement | null>) => {
    if (audioRef.current) {
        audioRef.current.play().catch((error: DOMException) => {
            if (error.name === 'NotAllowedError') {
                console.log('Audio playback blocked. User interaction required.');
            } else {
                console.error('Audio playback error:', error);
            }
        });
    }
};