import { useCallback, useEffect, useRef, useState } from "react";

export type SoundScene = "exploration" | "tension" | "battle" | "elite" | "boss" | "final" | "event" | "ritual" | "defeat";
export type SoundCue = "strike" | "lance" | "drain" | "boss" | "ritual" | "phase" | "bossPhase" | "relic" | "creature" | "physical" | "fire" | "ice" | "poison" | "holy" | "shadow" | "block" | "evade" | "counter" | "critical" | "death" | "victory" | "defeat" | "levelUp" | "roadEvent" | "discovery" | "quest" | "servant" | "resurrection" | "ui" | "telegraph";

type SoundProfile = { name: string; detail: string; root: number; interval: number; wave: OscillatorType; noise: number; accent: number[]; clock?: boolean };
type AudioMix = { muted: boolean; master: number; music: number; ambience: number; effects: number; interface: number };
type SceneRequest = { regionId: string; phaseId: string; scene: SoundScene; paused: boolean };

const regionalProfiles: Record<string, SoundProfile> = {
  ashen: { name: "Cinza e vigília", detail: "vento seco · cinzas · sinos baixos", root: 73.42, interval: 5200, wave: "triangle", noise: 0.022, accent: [1, 1.5, 2] },
  darkwood: { name: "Raízes sob a névoa", detail: "galhos · passos abafados · corvos", root: 87.31, interval: 4300, wave: "sine", noise: 0.028, accent: [1, 1.2, 1.5] },
  deadlands: { name: "Marcha sem túmulo", detail: "correntes · terra fria · passos", root: 61.74, interval: 4600, wave: "sawtooth", noise: 0.018, accent: [1, 1.33, 1.5] },
  swamp: { name: "Água de Vey", detail: "lodo · insetos · bolhas remotas", root: 65.41, interval: 3900, wave: "sine", noise: 0.04, accent: [1, 1.125, 1.5] },
  mountain: { name: "Sal contra a pedra", detail: "vento alto · cristais · ecos", root: 98, interval: 5600, wave: "triangle", noise: 0.018, accent: [1, 1.25, 2] },
  dragon: { name: "Escamas no horizonte", detail: "brasas · pedra profunda · asas", root: 55, interval: 4200, wave: "sawtooth", noise: 0.025, accent: [1, 1.5, 1.875] },
  titan: { name: "Osso de titã", detail: "pedra cedendo · graves · poeira", root: 49, interval: 6100, wave: "triangle", noise: 0.024, accent: [1, 1.25, 1.5] },
  tide: { name: "Maré morta", detail: "água funda · cordas · madeira", root: 82.41, interval: 3600, wave: "sine", noise: 0.05, accent: [1, 1.2, 1.5] },
  thorns: { name: "Jardim sem primavera", detail: "espinhos · seiva · respiração", root: 92.5, interval: 4100, wave: "triangle", noise: 0.021, accent: [1, 1.333, 1.667] },
  eclipse: { name: "Relógio do eclipse", detail: "tic · tic · constelações vazias", root: 103.83, interval: 2500, wave: "sine", noise: 0.012, accent: [1, 1.5, 2], clock: true },
  salt: { name: "Catedral do sal", detail: "cristais · cânticos baixos · vento", root: 77.78, interval: 4900, wave: "triangle", noise: 0.018, accent: [1, 1.25, 1.875] },
};

const bossRoots: Record<string, number> = { warden: 46.25, "tide-herald": 55, "rose-matriarch": 69.3, "starved-astronomer": 103.83, "black-salt-hierophant": 77.78 };
const defaultMix: AudioMix = { muted: false, master: 0.56, music: 0.68, ambience: 0.6, effects: 0.72, interface: 0.48 };
const sceneTracks: Record<SoundScene, string> = {
  exploration: "/manus-storage/necromancer-exploration_4defbe61.mp3",
  tension: "/manus-storage/necromancer-tension_31ca6c33.mp3",
  battle: "/manus-storage/necromancer-battle_f355b8e9.mp3",
  elite: "/manus-storage/necromancer-elite_46ba21ef.mp3",
  boss: "/manus-storage/necromancer-boss_3c60c52d.mp3",
  final: "/manus-storage/necromancer-final_0ec1905e.mp3",
  event: "/manus-storage/necromancer-event_7a153cc8.mp3",
  ritual: "/manus-storage/necromancer-ritual_e71ae760.mp3",
  defeat: "/manus-storage/necromancer-defeat_c3f06745.mp3",
};
const regionalTracks: Record<string, string> = {
  ashen: "/manus-storage/region-ash-verge_985695c2.mp3",
  darkwood: "/manus-storage/region-bone-forest_0b5a7ee1.mp3",
  deadlands: "/manus-storage/region-marga-village_3a7b57d6.mp3",
  swamp: "/manus-storage/region-fever-marsh_032af826.mp3",
  mountain: "/manus-storage/region-whisper-valley_c9f66d0f.mp3",
  dragon: "/manus-storage/region-shattered-citadel_1464f33f.mp3",
  titan: "/manus-storage/region-veyra-ruins_c4fb797d.mp3",
  tideCrypt: "/manus-storage/region-tide-crypt_ff7148dd.mp3",
  thornGarden: "/manus-storage/region-thorn-garden_a1b85d46.mp3",
  eclipse: "/manus-storage/region-eclipse-observatory_d3b5d21c.mp3",
  blackSalt: "/manus-storage/region-salt-cathedral_c8b7b6ae.mp3",
};
const victoryTrack = "/manus-storage/necromancer-victory_c796c68f.mp3";
const defeatStingerTrack = "/manus-storage/necromancer-defeat_c3f06745.mp3";

function contextFactory() {
  const Audio = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return Audio ? new Audio() : null;
}

class SoundscapeEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private ambient: GainNode | null = null;
  private effects: GainNode | null = null;
  private interfaceBus: GainNode | null = null;
  private ambienceLayer: GainNode | null = null;
  private musicLayer: GainNode | null = null;
  private ambienceVoices: OscillatorNode[] = [];
  private musicVoices: OscillatorNode[] = [];
  private ambienceTimer: number | null = null;
  private musicTimer: number | null = null;
  private ambienceKey = "";
  private musicKey = "";
  private mix = defaultMix;
  private ducked = false;
  private sceneRequest: SceneRequest | null = null;
  private soundtrack: HTMLAudioElement | null = null;
  private soundtrackKey = "";
  private trackTimers: number[] = [];

  private safeValue(value: number) { return Math.min(1, Math.max(0, value)); }
  private ramp(gain: GainNode | null, value: number, seconds = 0.18) {
    if (!this.context || !gain) return;
    const now = this.context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.linearRampToValueAtTime(Math.max(0.0001, value), now + seconds);
  }
  private soundtrackVolume() { return this.mix.muted ? 0 : this.safeValue(this.mix.master) * this.safeValue(this.mix.music) * (this.ducked ? 0.28 : 1); }
  private clearTrackTimers() { this.trackTimers.forEach((timer) => window.clearInterval(timer)); this.trackTimers = []; }
  private fadeHtmlAudio(audio: HTMLAudioElement, from: number, to: number, milliseconds: number, stopAfter = false) {
    const steps = Math.max(1, Math.round(milliseconds / 50)); let step = 0;
    const timer = window.setInterval(() => {
      step += 1; audio.volume = Math.max(0, Math.min(1, from + (to - from) * (step / steps)));
      if (step >= steps) {
        window.clearInterval(timer); this.trackTimers = this.trackTimers.filter((entry) => entry !== timer);
        if (stopAfter) { audio.pause(); audio.currentTime = 0; }
      }
    }, 50);
    this.trackTimers.push(timer);
  }
  private updateSoundtrackVolume() { if (this.soundtrack) this.soundtrack.volume = this.soundtrackVolume(); }
  private startSoundtrack(regionId: string, scene: SoundScene, key: string, fallback: GainNode | null) {
    const src = scene === "exploration" ? (regionalTracks[regionId] ?? sceneTracks.exploration) : sceneTracks[scene];
    if (!src || this.soundtrackKey === key) return;
    this.clearTrackTimers();
    const previous = this.soundtrack;
    if (previous) this.fadeHtmlAudio(previous, previous.volume, 0, 700, true);
    const next = new Audio(src);
    next.loop = scene !== "defeat";
    next.preload = "auto";
    next.volume = 0;
    this.soundtrack = next;
    this.soundtrackKey = key;
    void next.play().then(() => {
      if (this.soundtrack !== next) return;
      this.fadeHtmlAudio(next, 0, this.soundtrackVolume(), 800);
      if (fallback) this.ramp(fallback, 0.0001, 0.75);
    }).catch(() => {
      if (this.soundtrack === next) { this.soundtrack = null; this.soundtrackKey = ""; }
    });
  }
  private playStinger(src: string) {
    if (this.mix.muted) return;
    const stinger = new Audio(src); stinger.preload = "auto"; stinger.volume = Math.min(0.9, this.soundtrackVolume() * 1.08);
    void stinger.play().catch(() => { /* o sintetizador existente mantém o retorno quando mídia externa falhar */ });
  }

  private ensure() {
    if (this.context && this.master && this.music && this.ambient && this.effects && this.interfaceBus) return true;
    this.context = contextFactory();
    if (!this.context) return false;
    this.master = this.context.createGain();
    this.music = this.context.createGain();
    this.ambient = this.context.createGain();
    this.effects = this.context.createGain();
    this.interfaceBus = this.context.createGain();
    this.master.gain.value = 0.0001;
    this.music.connect(this.master); this.ambient.connect(this.master); this.effects.connect(this.master); this.interfaceBus.connect(this.master); this.master.connect(this.context.destination);
    return true;
  }

  async resume() {
    if (!this.ensure() || !this.context) return false;
    try {
      if (this.context.state !== "running") await this.context.resume();
    } catch {
      return false;
    }
    if (this.context.state !== "running") return false;
    this.setPreferences(this.mix);
    if (this.sceneRequest && !this.sceneRequest.paused) this.applyScene(this.sceneRequest);
    return true;
  }

  setPreferences(mix: Partial<AudioMix>) {
    this.mix = { ...this.mix, ...mix };
    if (!this.context || !this.master || !this.music || !this.ambient || !this.effects || !this.interfaceBus) return;
    const muted = this.mix.muted ? 0 : 1;
    this.ramp(this.master, muted * this.safeValue(this.mix.master) * (this.ducked ? 0.28 : 1), 0.2);
    this.ramp(this.music, this.safeValue(this.mix.music), 0.16);
    this.ramp(this.ambient, this.safeValue(this.mix.ambience), 0.16);
    this.ramp(this.effects, this.safeValue(this.mix.effects), 0.12);
    this.ramp(this.interfaceBus, this.safeValue(this.mix.interface), 0.12);
    this.updateSoundtrackVolume();
  }

  setDucked(ducked: boolean) { this.ducked = ducked; this.setPreferences({}); }

  setScene(regionId: string, phaseId: string, scene: SoundScene, paused: boolean) {
    this.sceneRequest = { regionId, phaseId, scene, paused };
    if (paused) { this.fadeAmbience(); this.fadeMusic(); return; }
    if (!this.context || this.context.state !== "running") return;
    this.applyScene(this.sceneRequest);
  }

  private applyScene({ regionId, phaseId, scene }: SceneRequest) {
    if (!this.context || this.context.state !== "running") return;
    const profile = regionalProfiles[regionId] ?? regionalProfiles.ashen;
    const ambienceKey = `${regionId}:${phaseId}`;
    if (this.ambienceKey !== ambienceKey || this.ambienceTimer === null) this.startAmbience(profile, phaseId, ambienceKey);
    const musicKey = `${regionId}:${scene}:${phaseId.includes("eclipse") || phaseId.includes("black") ? "altered" : "base"}`;
    if (this.musicKey !== musicKey || this.musicTimer === null) this.startMusic(profile, regionId, scene, musicKey);
  }

  private startAmbience(profile: SoundProfile, phaseId: string, key: string) {
    this.fadeAmbience();
    if (!this.context || !this.ambient) return;
    this.ambienceKey = key;
    this.ambienceLayer = this.context.createGain();
    this.ambienceLayer.gain.value = 0.0001;
    this.ambienceLayer.connect(this.ambient);
    this.ramp(this.ambienceLayer, 0.34, 1.1);
    this.spawnDrone(profile.root, profile.wave, 0.026, 0, this.ambienceLayer, this.ambienceVoices);
    this.spawnDrone(profile.root * 0.5, "sine", 0.034, 0, this.ambienceLayer, this.ambienceVoices);
    this.spawnNoise(profile.noise, this.ambienceLayer);
    const motif = () => this.playAmbientMotif(profile, phaseId);
    window.setTimeout(motif, 260);
    this.ambienceTimer = window.setInterval(motif, profile.interval);
  }

  private startMusic(profile: SoundProfile, regionId: string, scene: SoundScene, key: string) {
    this.fadeMusic(false);
    if (!this.context || !this.music) return;
    this.musicKey = key;
    this.musicLayer = this.context.createGain();
    this.musicLayer.gain.value = 0.0001;
    this.musicLayer.connect(this.music);
    this.ramp(this.musicLayer, scene === "exploration" ? 0.2 : scene === "defeat" ? 0.16 : 0.31, scene === "boss" || scene === "final" ? 0.65 : 0.9);
    this.startSoundtrack(regionId, scene, key, this.musicLayer);
    const motif = () => this.playMusicMotif(profile, scene);
    motif();
    const tempo = scene === "exploration" ? 5200 : scene === "tension" ? 3600 : scene === "battle" ? 2200 : scene === "elite" ? 1850 : scene === "boss" ? 1450 : scene === "final" ? 1050 : scene === "event" ? 3100 : scene === "ritual" ? 2800 : 4200;
    this.musicTimer = window.setInterval(motif, tempo);
  }

  private spawnDrone(frequency: number, wave: OscillatorType, gainAmount: number, detune: number, destination: AudioNode, list: OscillatorNode[]) {
    if (!this.context) return;
    const oscillator = this.context.createOscillator(); const filter = this.context.createBiquadFilter(); const volume = this.context.createGain();
    oscillator.type = wave; oscillator.frequency.value = frequency; oscillator.detune.value = detune; filter.type = "lowpass"; filter.frequency.value = 420; volume.gain.value = gainAmount;
    oscillator.connect(filter).connect(volume).connect(destination); oscillator.start(); list.push(oscillator);
  }

  private spawnNoise(gainAmount: number, destination: AudioNode) {
    if (!this.context || gainAmount <= 0) return;
    const buffer = this.context.createBuffer(1, this.context.sampleRate * 2, this.context.sampleRate); const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) samples[index] = Math.random() * 2 - 1;
    const source = this.context.createBufferSource(); const filter = this.context.createBiquadFilter(); const gain = this.context.createGain();
    source.buffer = buffer; source.loop = true; filter.type = "bandpass"; filter.frequency.value = 360; filter.Q.value = 0.38; gain.gain.value = gainAmount;
    source.connect(filter).connect(gain).connect(destination); source.start();
  }

  private playAmbientMotif(profile: SoundProfile, phaseId: string) {
    if (!this.context || !this.ambienceLayer || this.mix.muted) return;
    const high = phaseId.includes("eclipse") || phaseId.includes("high") ? 1.18 : phaseId.includes("black") ? 0.82 : 1;
    this.tone(profile.root * profile.accent[0] * high, 0.18, profile.wave, 0.032, this.ambienceLayer, 0.03);
    if (profile.clock) this.tone(profile.root * 2, 0.06, "square", 0.022, this.ambienceLayer, 0.15);
    window.setTimeout(() => this.tone(profile.root * profile.accent[1] * high, 0.15, "sine", 0.021, this.ambienceLayer!, 0.03), profile.clock ? 720 : 420);
  }

  private playMusicMotif(profile: SoundProfile, scene: SoundScene) {
    if (!this.context || !this.musicLayer || this.mix.muted) return;
    const root = profile.root;
    const musical: Record<SoundScene, { ratio: number[]; duration: number; gain: number; wave: OscillatorType; delay: number }> = {
      exploration: { ratio: [1, 1.5, 2], duration: 0.72, gain: 0.045, wave: "sine", delay: 0.44 },
      tension: { ratio: [1, 1.2, 1.5], duration: 0.52, gain: 0.058, wave: "triangle", delay: 0.29 },
      battle: { ratio: [0.5, 1, 1.125, 1.5], duration: 0.24, gain: 0.064, wave: "sawtooth", delay: 0.15 },
      elite: { ratio: [0.5, 1, 1.333, 1.5], duration: 0.28, gain: 0.072, wave: "triangle", delay: 0.13 },
      boss: { ratio: [0.5, 1, 1.2, 1.5], duration: 0.34, gain: 0.085, wave: "sawtooth", delay: 0.11 },
      final: { ratio: [0.5, 1, 1.125, 1.5, 2], duration: 0.21, gain: 0.095, wave: "square", delay: 0.09 },
      event: { ratio: [1, 1.25, 1.5], duration: 0.39, gain: 0.055, wave: "triangle", delay: 0.24 },
      ritual: { ratio: [0.5, 1, 1.5, 2], duration: 0.48, gain: 0.072, wave: "sine", delay: 0.19 },
      defeat: { ratio: [1, 0.75, 0.5], duration: 0.8, gain: 0.06, wave: "triangle", delay: 0.45 },
    };
    const pattern = musical[scene];
    pattern.ratio.forEach((ratio, index) => this.tone(root * ratio, pattern.duration, pattern.wave, pattern.gain, this.musicLayer!, index * pattern.delay));
  }

  cue(type: SoundCue, bossId?: string) {
    if (!this.context || this.context.state !== "running" || this.mix.muted || !this.effects || !this.music || !this.interfaceBus) return;
    const out = this.effects; const ui = this.interfaceBus; const root = bossRoots[bossId ?? ""] ?? 55;
    if (type === "strike" || type === "physical") { this.tone(126, 0.08, "square", 0.15, out); this.tone(58, 0.14, "triangle", 0.12, out, 0.015); }
    if (type === "lance" || type === "shadow") { this.tone(218, 0.24, "sine", 0.12, out); this.tone(445, 0.12, "triangle", 0.08, out, 0.08); }
    if (type === "drain" || type === "poison") { this.tone(164, 0.28, "sine", 0.11, out); this.tone(82, 0.34, "sine", 0.1, out, 0.08); }
    if (type === "fire") { this.tone(92, 0.12, "sawtooth", 0.14, out); this.tone(260, 0.24, "triangle", 0.1, out, 0.04); }
    if (type === "ice") { this.tone(720, 0.23, "sine", 0.08, out); this.tone(1080, 0.13, "triangle", 0.055, out, 0.07); }
    if (type === "holy") { [293.66, 440, 587.33].forEach((frequency, index) => this.tone(frequency, 0.36, "sine", 0.07, out, index * 0.07)); }
    if (type === "ritual" || type === "resurrection") { [110, 164.81, 220].forEach((frequency, index) => this.tone(frequency, 0.46, "triangle", 0.075, out, index * 0.08)); }
    if (type === "phase" || type === "telegraph") { this.tone(196, 0.19, "triangle", 0.1, out); this.tone(293.66, 0.34, "sine", 0.075, out, 0.15); }
    if (type === "creature" || type === "death") { this.tone(76, 0.22, "sawtooth", 0.095, out); this.tone(109, 0.18, "triangle", 0.07, out, 0.055); }
    if (type === "relic" || type === "quest") [392, 523.25, 659.25].forEach((frequency, index) => this.tone(frequency, 0.48, "sine", 0.07, out, index * 0.11));
    if (type === "block" || type === "counter") { this.tone(92, 0.11, "square", 0.1, out); this.tone(184, 0.18, "triangle", 0.08, out, 0.04); }
    if (type === "evade") { this.tone(440, 0.12, "sine", 0.055, out); this.tone(660, 0.16, "sine", 0.046, out, 0.06); }
    if (type === "critical") { this.tone(330, 0.12, "square", 0.12, out); this.tone(660, 0.2, "triangle", 0.075, out, 0.05); }
    if (type === "boss" || type === "bossPhase") { this.tone(root, 0.62, "sawtooth", 0.11, out); this.tone(root * 0.5, 0.7, "triangle", 0.1, out, 0.08); this.tone(type === "bossPhase" ? root * 1.5 : root * 1.2, 0.42, "sine", 0.075, out, 0.19); }
    if (type === "victory") { [root * 2, root * 2.5, root * 3, root * 4].forEach((frequency, index) => this.tone(frequency, 0.72, "sine", 0.09, this.music!, index * 0.22)); this.playStinger(victoryTrack); }
    if (type === "defeat") { [root * 1.5, root, root * 0.5].forEach((frequency, index) => this.tone(frequency, 0.82, "triangle", 0.08, this.music!, index * 0.35)); this.playStinger(defeatStingerTrack); }
    if (type === "levelUp") [220, 277.18, 329.63, 440].forEach((frequency, index) => this.tone(frequency, 0.28, "sine", 0.07, this.music!, index * 0.1));
    if (type === "roadEvent" || type === "discovery") { this.tone(196, 0.17, "triangle", 0.055, ui); this.tone(294, 0.28, "sine", 0.045, ui, 0.09); }
    if (type === "servant") { this.tone(146.83, 0.22, "sine", 0.07, out); this.tone(220, 0.28, "triangle", 0.055, out, 0.08); }
    if (type === "ui") this.tone(540, 0.06, "sine", 0.025, ui);
  }

  private tone(frequency: number, duration: number, wave: OscillatorType, gainValue: number, destination: AudioNode, delay = 0) {
    if (!this.context) return;
    const now = this.context.currentTime + delay; const oscillator = this.context.createOscillator(); const gain = this.context.createGain();
    oscillator.type = wave; oscillator.frequency.setValueAtTime(Math.max(24, frequency), now); gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, gainValue), now + 0.018); gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(destination); oscillator.start(now); oscillator.stop(now + duration + 0.04);
  }

  private fadeLayer(layer: GainNode | null, voices: OscillatorNode[]) {
    if (this.context && layer) { const now = this.context.currentTime; layer.gain.cancelScheduledValues(now); layer.gain.linearRampToValueAtTime(0.0001, now + 0.35); }
    const retiring = voices.splice(0); window.setTimeout(() => retiring.forEach((voice) => { try { voice.stop(); } catch { /* voz já encerrada */ } }), 420);
  }
  private fadeAmbience() { if (this.ambienceTimer !== null) { window.clearInterval(this.ambienceTimer); this.ambienceTimer = null; } this.fadeLayer(this.ambienceLayer, this.ambienceVoices); this.ambienceLayer = null; this.ambienceKey = ""; }
  private fadeMusic(stopTrack = true) {
    if (this.musicTimer !== null) { window.clearInterval(this.musicTimer); this.musicTimer = null; }
    this.fadeLayer(this.musicLayer, this.musicVoices); this.musicLayer = null; this.musicKey = "";
    if (stopTrack && this.soundtrack) {
      this.clearTrackTimers(); this.fadeHtmlAudio(this.soundtrack, this.soundtrack.volume, 0, 350, true);
      this.soundtrack = null; this.soundtrackKey = "";
    }
  }
  dispose() { this.fadeAmbience(); this.fadeMusic(); void this.context?.close(); this.context = null; this.master = null; this.music = null; this.ambient = null; this.effects = null; this.interfaceBus = null; }
}

export function useAdaptiveSoundscape({ regionId, phaseId, bossId, muted, paused, volume, ducked = false, musicVolume, ambienceVolume, effectsVolume, interfaceVolume, scene = "exploration" }: { regionId: string; phaseId: string; bossId?: string; muted: boolean; paused: boolean; volume: number; ducked?: boolean; musicVolume?: number; ambienceVolume?: number; effectsVolume?: number; interfaceVolume?: number; scene?: SoundScene }) {
  const engineRef = useRef<SoundscapeEngine | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const lastBoss = useRef<string | undefined>(undefined); const lastPhase = useRef<string | undefined>(undefined);
  const unlock = useCallback(async () => {
    if (!engineRef.current) engineRef.current = new SoundscapeEngine();
    const resumed = await engineRef.current.resume();
    if (resumed) setUnlocked(true);
    return resumed;
  }, []);
  useEffect(() => { const activate = () => { void unlock(); }; if (!engineRef.current) engineRef.current = new SoundscapeEngine(); window.addEventListener("pointerdown", activate, { passive: true }); window.addEventListener("keydown", activate); return () => { window.removeEventListener("pointerdown", activate); window.removeEventListener("keydown", activate); engineRef.current?.dispose(); }; }, [unlock]);
  useEffect(() => { engineRef.current?.setPreferences({ muted, master: volume, music: musicVolume ?? volume, ambience: ambienceVolume ?? volume, effects: effectsVolume ?? volume, interface: interfaceVolume ?? volume }); }, [muted, volume, musicVolume, ambienceVolume, effectsVolume, interfaceVolume]);
  useEffect(() => { engineRef.current?.setDucked(ducked); }, [ducked]);
  useEffect(() => { engineRef.current?.setScene(regionId, phaseId, scene, paused); }, [regionId, phaseId, scene, paused]);
  useEffect(() => { if (!unlocked) return; if (lastPhase.current && lastPhase.current !== phaseId) engineRef.current?.cue("phase"); lastPhase.current = phaseId; }, [phaseId, unlocked]);
  useEffect(() => { if (!unlocked) return; if (bossId && bossId !== lastBoss.current) engineRef.current?.cue("boss", bossId); lastBoss.current = bossId; }, [bossId, unlocked]);
  const profile = regionalProfiles[regionId] ?? regionalProfiles.ashen;
  return { cue: (type: SoundCue, cueBossId?: string) => engineRef.current?.cue(type, cueBossId), unlock, unlocked, profile, scene };
}
