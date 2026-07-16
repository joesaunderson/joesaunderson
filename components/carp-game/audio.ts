export class SoundKit {
  private ctx: AudioContext | null = null;
  muted = false;

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private tone(
    frequency: number,
    duration: number,
    type: OscillatorType = "square",
    volume = 0.04,
  ): void {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }

  private noise(duration: number, volume = 0.05, lowpass = 900): void {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const buffer = ctx.createBuffer(
      1,
      Math.ceil(ctx.sampleRate * duration),
      ctx.sampleRate,
    );
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i++) {
      channel[i] = (Math.random() * 2 - 1) * (1 - i / channel.length);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = lowpass;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
  }

  unlock(): void {
    this.ensure();
  }

  bleep(): void {
    this.tone(2300, 0.09);
  }

  alarm(): void {
    this.tone(2300, 0.14, "square", 0.05);
  }

  splash(): void {
    this.noise(0.35, 0.07, 700);
  }

  plop(): void {
    this.noise(0.12, 0.05, 500);
    this.tone(240, 0.1, "sine", 0.03);
  }

  reelClick(): void {
    this.tone(1400, 0.02, "square", 0.015);
  }

  snap(): void {
    this.tone(180, 0.25, "sawtooth", 0.06);
    this.noise(0.2, 0.06, 2400);
  }

  fanfare(): void {
    this.tone(523, 0.12, "triangle", 0.05);
    setTimeout(() => this.tone(659, 0.12, "triangle", 0.05), 120);
    setTimeout(() => this.tone(784, 0.2, "triangle", 0.05), 240);
  }

  legendary(): void {
    this.fanfare();
    setTimeout(() => this.tone(1047, 0.35, "triangle", 0.05), 380);
  }
}
