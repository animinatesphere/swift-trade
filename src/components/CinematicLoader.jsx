import React, { useState, useEffect } from "react";
import logoImg from "../assets/logo.png";

const C = {
  green: "#0ECB81",
  amber: "#F5A623",
  bg: "#080808",
  text: "#ffffff",
  muted: "#888888",
};

const LOADER_CSS = `
  @keyframes loaderGlow {
    0%, 100% { transform: scale(1); opacity: 0.4; filter: blur(40px); }
    50% { transform: scale(1.15); opacity: 0.6; filter: blur(60px); }
  }

  @keyframes logoEntrance {
    0% { transform: scale(0.85); opacity: 0; filter: drop-shadow(0 0 0px transparent); }
    30% { opacity: 1; }
    100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 25px rgba(14,203,129,0.35)); }
  }

  @keyframes textReveal {
    0% { letter-spacing: -2px; opacity: 0; filter: blur(5px); }
    40% { opacity: 0.3; }
    100% { letter-spacing: 5px; opacity: 1; filter: blur(0); }
  }

  @keyframes tagReveal {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 0.8; transform: translateY(0); }
  }

  .cinematic-loader-container {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: ${C.bg};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: opacity 0.8s cubic-bezier(0.85, 0, 0.15, 1), transform 0.8s cubic-bezier(0.85, 0, 0.15, 1), visibility 0.8s;
  }

  .cinematic-loader-container.fade-out {
    opacity: 0;
    transform: scale(1.03);
    pointer-events: none;
    visibility: hidden;
  }

  .loader-ambient {
    position: absolute;
    width: 450px;
    height: 450px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(14,203,129,0.12) 0%, rgba(245,166,35,0.04) 50%, transparent 70%);
    animation: loaderGlow 3s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  .loader-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    text-align: center;
  }

  .loader-logo-wrapper {
    animation: logoEntrance 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }

  .loader-logo {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  .loader-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 38px;
    color: ${C.text};
    line-height: 1;
    margin: 0;
    opacity: 0;
    animation: textReveal 1.6s cubic-bezier(0.25, 1, 0.5, 1) 0.3s forwards;
    letter-spacing: 5px;
  }

  .loader-tagline {
    font-family: 'Outfit', sans-serif;
    font-size: 8px;
    font-weight: 500;
    color: ${C.amber};
    letter-spacing: 7px;
    text-transform: uppercase;
    margin-top: -14px;
    opacity: 0;
    animation: tagReveal 1.2s ease 0.8s forwards;
  }

  .loader-progress-track {
    width: 140px;
    height: 2px;
    background: rgba(255,255,255,0.06);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    margin-top: 10px;
  }

  .loader-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, ${C.green}, ${C.amber});
    width: 0%;
    transition: width 2s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: 0 0 10px rgba(14,203,129,0.5);
  }
`;

export default function CinematicLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Inject Stylesheet
    const styleEl = document.createElement("style");
    styleEl.textContent = LOADER_CSS;
    document.head.appendChild(styleEl);

    // Trigger progressive loader fill
    const timer1 = setTimeout(() => setProgress(100), 100);

    // Trigger fade out
    const timer2 = setTimeout(() => setIsFadingOut(true), 2100);

    // Unmount and trigger complete
    const timer3 = setTimeout(() => {
      onComplete?.();
    }, 2900);

    return () => {
      document.head.removeChild(styleEl);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className={`cinematic-loader-container${isFadingOut ? " fade-out" : ""}`}>
      <div className="loader-ambient" />
      <div className="loader-content">
        <div className="loader-logo-wrapper">
          <img src={logoImg} alt="Swift Trade Logo" className="loader-logo" />
        </div>
        <h1 className="loader-title">SWIFT</h1>
        <span className="loader-tagline">TRADE</span>
        <div className="loader-progress-track">
          <div className="loader-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
