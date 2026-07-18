import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../colors";

export const Background = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 60) * 30;

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          opacity: 0.15,
          backgroundImage: `radial-gradient(#222 1.5px, transparent 1.5px)`,
          backgroundSize: "44px 44px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 120 + drift,
          left: -220,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.green}22, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -180 - drift,
          right: -240,
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.amber}18, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />
    </AbsoluteFill>
  );
};
