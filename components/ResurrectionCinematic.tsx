// Estilo do componente: Gótico de Pergaminho Vivo — uma cerimônia ocupa o manuscrito e devolve o comando somente após a alma ser inscrita.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { FastForward, Play, ScrollText, Sparkles } from "lucide-react";
import type { ResurrectionCinematic } from "@/lib/gameData";
import "../resurrection-cinematic.css";

type ResurrectionCinematicProps = {
  cinematic: ResurrectionCinematic;
  onComplete: () => void;
};

export function ResurrectionCinematic({ cinematic, onComplete }: ResurrectionCinematicProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [fallbackVisible, setFallbackVisible] = useState(!cinematic.videoSrc);

  useEffect(() => {
    const skip = (event: KeyboardEvent) => { if (event.key === "Escape") onComplete(); };
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [onComplete]);

  useEffect(() => {
    if (cinematic.videoSrc && !videoFailed) return;
    setFallbackVisible(true);
    const timer = window.setTimeout(onComplete, 4200);
    return () => window.clearTimeout(timer);
  }, [cinematic.videoSrc, videoFailed, onComplete]);

  const showFallback = !cinematic.videoSrc || videoFailed;
  const sceneParticles = Array.from({ length: 9 }, (_, index) => index);
  return <section className={`resurrection-cinematic cinematic-${cinematic.accent} ${showFallback ? "is-static-ceremony" : ""}`} role="dialog" aria-modal="true" aria-labelledby="cinematic-title" aria-describedby="cinematic-description">
    <div className="cinematic-vignette" />
    <div className="cinematic-ember cinematic-ember-one" /><div className="cinematic-ember cinematic-ember-two" /><div className="cinematic-ember cinematic-ember-three" />
    <div className="cinematic-particle-field" aria-hidden="true">{sceneParticles.map((particle) => <i key={particle} style={{ "--particle": particle } as CSSProperties} />)}</div>
    <div className="cinematic-dais" aria-hidden="true"><span /><span /><span /></div>
    <div className="cinematic-stage" style={{ backgroundImage: `linear-gradient(180deg, rgba(5, 4, 8, .18), rgba(5, 4, 8, .92)), url(${cinematic.poster})` }}>
      {cinematic.videoSrc && !videoFailed && <video ref={videoRef} className="cinematic-video" src={cinematic.videoSrc} poster={cinematic.poster} autoPlay muted playsInline preload="metadata" onError={() => setVideoFailed(true)} onEnded={onComplete} />}
      <div className={`cinematic-sigil ${fallbackVisible ? "is-inscribing" : ""}`}><Sparkles size={30} /><span>{cinematic.seal}</span></div>
      <div className="cinematic-copy">
        <span className="eyebrow"><ScrollText size={12} /> RITO DE RESSURREIÇÃO · COROA RECLAMADA</span>
        <h2 id="cinematic-title">{cinematic.title}</h2>
        <strong className="cinematic-announcement">{cinematic.announcement}</strong>
        <p id="cinematic-description">{showFallback ? cinematic.fallbackDetail : cinematic.invocation}</p>
        <small>{showFallback ? "O manuscrito encena o rito enquanto a memória visual permanece velada." : cinematic.invocation}</small>
      </div>
    </div>
    <footer className="cinematic-footer"><span>{showFallback ? "RITO ALTERNATIVO · CONCLUSÃO SEGURA" : "MEMÓRIA VISUAL EM EXECUÇÃO"}</span><button type="button" onClick={onComplete}><FastForward size={15} /> Pular ritual</button></footer>
  </section>;
}
