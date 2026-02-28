/**
 * Audio service for subtle UI feedback sounds using Web Audio API.
 * Avoids external assets and ensures low-latency kiosk responsiveness.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
}

/** Play a subtle click sound for button feedback */
export const playClickSound = () => {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
        console.warn("Click sound failed", e);
    }
};

/** Play a major triad chime for success/completion feedback */
export const playSuccessSound = () => {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        const playNote = (freq: number, start: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
            gain.gain.linearRampToValueAtTime(0, start + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(start);
            osc.stop(start + duration);
        };

        // C major triad ascending chime
        playNote(523.25, now, 0.3);       // C5
        playNote(659.25, now + 0.1, 0.3); // E5
        playNote(783.99, now + 0.2, 0.5); // G5
        playNote(1046.50, now + 0.3, 0.6); // C6
    } catch (e) {
        console.warn("Success sound failed", e);
    }
};
