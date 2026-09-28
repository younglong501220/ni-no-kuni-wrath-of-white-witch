// Web Audio API Sound Synthesizer for Ni no Kuni Adventure & Battles

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private muted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted && this.bgmPlaying) {
      this.stopBgm();
      this.bgmPlaying = true; // remember intent
    } else if (!this.muted && this.bgmPlaying) {
      this.startBgm();
    }
    return this.muted;
  }

  public isBgmActive(): boolean {
    return this.bgmPlaying;
  }

  // Button Click / Page Turn
  public playClick() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Physical slash attack sound
  public playSlash() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // Magic Spell casting (Fireball / Pulse)
  public playSpellCast() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(940, t + 0.18);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.35);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(t + 0.4);
  }

  // Healing Spell (Warm celestial chime)
  public playHeal() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  }

  // Heart Mending / Heart Bottle (Sparkling magical harp chime)
  public playHeartMend() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const notes = [440, 554.37, 659.25, 830.61, 880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.07;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.55);
    });
  }

  // Gleam pickup (Crisp ping)
  public playGleamPickup(isGold: boolean = false) {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = isGold ? 1200 : 880;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.12);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(t + 0.25);
  }

  // Guard impact
  public playGuardSuccess() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.15);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(t + 0.2);
  }

  // Victory fanfare
  public playVictory() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const melody = [
      { f: 523.25, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.35 },
      { f: 783.99, d: 0.25 },
      { f: 1046.5, d: 0.6 },
    ];
    let cur = this.ctx.currentTime;
    melody.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, cur);
      gain.gain.setValueAtTime(0.2, cur);
      gain.gain.exponentialRampToValueAtTime(0.001, cur + note.d * 0.95);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(cur);
      osc.stop(cur + note.d);
      cur += note.d * 1.05;
    });
  }

  // Gentle Ghibli-inspired fantasy BGM arpeggio loop
  public toggleBgm(): boolean {
    if (this.bgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public startBgm() {
    this.initCtx();
    this.bgmPlaying = true;
    if (this.muted) return;

    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 392.0],  // G7
    ];

    let chordIndex = 0;
    const playMeasure = () => {
      if (!this.bgmPlaying || this.muted || !this.ctx) return;
      const chord = chords[chordIndex % chords.length];
      chordIndex++;

      // Play gentle rising and falling harp notes
      const pattern = [0, 1, 2, 3, 2, 1];
      const now = this.ctx.currentTime;
      pattern.forEach((noteIdx, step) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(chord[noteIdx], now + step * 0.28);
        gain.gain.setValueAtTime(0.04, now + step * 0.28);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + step * 0.28 + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + step * 0.28);
        osc.stop(now + step * 0.28 + 0.5);
      });

      this.bgmTimer = window.setTimeout(playMeasure, pattern.length * 280);
    };

    playMeasure();
  }

  public stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sound = new SoundManager();
