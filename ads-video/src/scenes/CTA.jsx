import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Background } from "../components/Background";
import { Logo } from "../components/Logo";
import { C, FONT_DISPLAY, FONT_BODY } from "../colors";

export const CTA = ({
  headline = "START TRADING",
  headlineAccent = "TODAY",
  buttonText = "Create Free Account →",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const headlineSpring = spring({ frame: frame - 14, fps, config: { damping: 14 } });
  const button = spring({ frame: frame - 30, fps, config: { damping: 11, mass: 0.7 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  const url = spring({ frame: frame - 46, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <div style={{ transform: `scale(${logoS})`, marginBottom: 48 }}>
          <Logo size={90} textSize={42} subSize={17} />
        </div>

        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 68,
            color: C.text,
            lineHeight: 1,
            letterSpacing: 1,
            opacity: headlineSpring,
            transform: `translateY(${interpolate(headlineSpring, [0, 1], [24, 0])}px)`,
            marginBottom: 56,
          }}
        >
          {headline} <span style={{ color: C.green }}>{headlineAccent}</span>
        </div>

        <div
          style={{
            opacity: button,
            transform: `translateY(${interpolate(button, [0, 1], [24, 0])}px) scale(${button * pulse})`,
            background: C.green,
            color: "#000",
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 34,
            padding: "26px 56px",
            borderRadius: 100,
            boxShadow: "0 20px 60px rgba(14,203,129,0.4)",
          }}
        >
          {buttonText}
        </div>

        <div
          style={{
            marginTop: 44,
            fontFamily: FONT_BODY,
            fontSize: 26,
            color: C.muted,
            letterSpacing: 1,
            opacity: url,
          }}
        >
          swifttradeapp.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
