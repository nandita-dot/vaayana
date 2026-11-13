// VAAYANA (വായന) — Unified Procedural Sound Effects Engine
// 100% Offline, Zero-Dependency, Lightweight Web Audio API Synthesis

export type SoundEffect =
  | 'whoosh'        // Airplane chapter transition
  | 'click'         // Button or interactive object pressed
  | 'correct'       // Pleasant success chime
  | 'celebration'   // Short celebratory victory fanfare
  | 'incorrect'     // Gentle, friendly feedback sound
  | 'coin'          // Soft coin/cash sound
  | 'bead'          // Subtle wooden abacus bead movement sound
  | 'tick';         // Soft clock tick sound

interface AudioSettings {
  isMuted: boolean;
  volume: number; // 0.0 to 1.0
}

const STORAGE_KEY = 'vaayana_sound_settings_v1';

class SoundService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private settings: AudioSettings = { isMuted: false, volume: 0.7 };
  private listeners: Set<(settings: AudioSettings) => void> = new Set();
  private activeMelodyNodes: { stop: () => void }[] = [];
  private lastPlayTime: Partial<Record<SoundEffect, number>> = {};

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.isMuted === 'boolean') this.settings.isMuted = parsed.isMuted;
        if (typeof parsed.volume === 'number') this.settings.volume = Math.max(0, Math.min(1, parsed.volume));
      }
    } catch (e) {
      console.warn('Could not read sound settings from localStorage', e);
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Could not save sound settings to localStorage', e);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.settings }));
  }

  public subscribe(listener: (settings: AudioSettings) => void): () => void {
    this.listeners.add(listener);
    listener({ ...this.settings });
    return () => this.listeners.delete(listener);
  }

  public isMuted(): boolean {
    return this.settings.isMuted;
  }

  public getVolume(): number {
    return this.settings.volume;
  }

  public toggleMute(): boolean {
    this.settings.isMuted = !this.settings.isMuted;
    if (this.settings.isMuted) {
      this.stopCelebration();
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.settings.isMuted ? 0 : this.settings.volume,
        this.ctx.currentTime
      );
    }
    this.saveSettings();
    return this.settings.isMuted;
  }

  public setVolume(val: number) {
    this.settings.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.settings.isMuted) {
      this.masterGain.gain.setValueAtTime(this.settings.volume, this.ctx.currentTime);
    }
    this.saveSettings();
  }

  private initContext(): boolean {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(
        this.settings.isMuted ? 0 : this.settings.volume,
        this.ctx.currentTime
      );
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  public stopCelebration() {
    this.activeMelodyNodes.forEach((node) => {
      try {
        node.stop();
      } catch (e) {}
    });
    this.activeMelodyNodes = [];
  }

  /**
   * Play procedural sound effect cleanly without distortion or clipping
   */
  public play(effect: SoundEffect) {
    if (this.settings.isMuted) return;

    // Rate limit rapid repetitive clicks/ticks (minimum 40ms interval)
    const now = Date.now();
    const last = this.lastPlayTime[effect] || 0;
    if (now - last < 40 && (effect === 'click' || effect === 'tick' || effect === 'bead')) {
      return;
    }
    this.lastPlayTime[effect] = now;

    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    try {
      switch (effect) {
        case 'click':
          this.synthesizeClick();
          break;
        case 'correct':
          this.synthesizeChime();
          break;
        case 'celebration':
          this.synthesizeCelebration();
          break;
        case 'incorrect':
          this.synthesizeIncorrect();
          break;
        case 'whoosh':
          this.synthesizeWhoosh();
          break;
        case 'coin':
          this.synthesizeCoin();
          break;
        case 'bead':
          this.synthesizeBead();
          break;
        case 'tick':
          this.synthesizeTick();
          break;
      }
    } catch (err) {
      console.warn('Error playing procedural sound effect:', effect, err);
    }
  }

  // 1. Soft UI Click / Pop
  private synthesizeClick() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.04);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.045);
  }

  // 2. Pleasant Success Chime (C5 -> E5 -> G5)
  private synthesizeChime() {
    if (!this.ctx || !this.masterGain) return;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteStart = startTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.28, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.55);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteStart);
      osc.stop(noteStart + 0.56);
    });
  }

  // 3. Short Celebratory Fanfare Music
  private synthesizeCelebration() {
    if (!this.ctx || !this.masterGain) return;
    this.stopCelebration();

    // Joyful melodic fanfare: C5, E5, G5, C6, G5, C6 (Bright cheerful bell arpeggio)
    const melody = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.50, d: 0.22 }, // C6
      { f: 880.00, d: 0.12 }, // A5
      { f: 1046.50, d: 0.65 } // C6 final chord hold
    ];

    let t = this.ctx.currentTime;
    melody.forEach((note) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(note.f * 1.5, t); // pleasant fifth harmonic

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      subOsc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      subOsc.start(t);
      osc.stop(t + note.d + 0.05);
      subOsc.stop(t + note.d + 0.05);

      this.activeMelodyNodes.push(osc, subOsc);
      t += note.d * 0.85;
    });
  }

  // 4. Gentle Friendly Feedback Sound (Low, warm two-note wobble, not harsh)
  private synthesizeIncorrect() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.18);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.23);
  }

  // 5. Airplane Fly-by / Whoosh (White noise with resonant filter sweep)
  private synthesizeWhoosh() {
    if (!this.ctx || !this.masterGain) return;
    const duration = 1.2;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // white noise
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    const t = this.ctx.currentTime;
    // Frequency sweep: starts around 250Hz, peaks at 1800Hz when plane passes, settles down to 180Hz
    filter.frequency.setValueAtTime(250, t);
    filter.frequency.exponentialRampToValueAtTime(1800, t + duration * 0.45);
    filter.frequency.exponentialRampToValueAtTime(180, t + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.4, t + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + duration);
  }

  // 6. Metallic Coin / Cash Sound (Dual high bell ring with fast decay)
  private synthesizeCoin() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2350, t);
    osc1.frequency.exponentialRampToValueAtTime(1900, t + 0.25);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(3920, t);
    osc2.frequency.exponentialRampToValueAtTime(3200, t + 0.2);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.29);
    osc2.stop(t + 0.29);
  }

  // 7. Subtle Wooden Abacus Bead Clack
  private synthesizeBead() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Woodblock-style resonant click
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(820, t);
    osc.frequency.exponentialRampToValueAtTime(450, t + 0.035);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.045);
  }

  // 8. Soft Clock Tick
  private synthesizeTick() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Crisp high frequency escapement click
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.015);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.02);
  }
}

export const soundService = new SoundService();
