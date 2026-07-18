import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Background } from "../components/Background";
import { Logo } from "../components/Logo";
import { C, FONT_DISPLAY, FONT_BODY } from "../colors";

export const Hook = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const line1 = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  const line2 = spring({ frame: frame - 34, fps, config: { damping: 14 } });
  const pill = spring({ frame: frame - 55, fps, config: { damping: 14 } });

  const exit = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <Background />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 70px",
          textAlign: "center",
        }}
      >
        <div style={{ transform: `scale(${logoScale})`, marginBottom: 56 }}>
          <Logo size={84} textSize={40} subSize={16} />
        </div>

        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 84,
            lineHeight: 0.98,
            color: C.text,
            letterSpacing: 1,
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [30, 0])}px)`,
          }}
        >
          TRADE CRYPTO <span style={{ color: C.green }}>FAST.</span>
        </div>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 84,
            lineHeight: 0.98,
            color: C.text,
            letterSpacing: 1,
            marginTop: 6,
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [30, 0])}px)`,
          }}
        >
          GET <span style={{ color: C.amber }}>NAIRA.</span> INSTANTLY.
        </div>

        <div
          style={{
            marginTop: 60,
            opacity: pill,
            transform: `translateY(${interpolate(pill, [0, 1], [16, 0])}px)`,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(14,203,129,0.1)",
            border: `1px solid ${C.green}55`,
            padding: "12px 26px",
            borderRadius: 100,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: C.green,
            }}
          />
          <span
            style={{
              fontFamily: FONT_BODY,
              color: C.green,
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Trusted by 5,000+ Nigerians
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
