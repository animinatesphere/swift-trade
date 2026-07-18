import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Background } from "../components/Background";
import { C, FONT_DISPLAY, FONT_BODY } from "../colors";

export const Step = ({ number, title, desc, icon, accent = C.green }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const badge = spring({ frame, fps, config: { damping: 13, mass: 0.6 } });
  const iconIn = spring({ frame: frame - 8, fps, config: { damping: 12, mass: 0.7 } });
  const titleIn = spring({ frame: frame - 20, fps, config: { damping: 14 } });
  const descIn = spring({ frame: frame - 32, fps, config: { damping: 14 } });

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
          textAlign: "center",
          padding: "0 70px",
        }}
      >
        <div
          style={{
            opacity: badge,
            transform: `scale(${interpolate(badge, [0, 1], [0.6, 1])})`,
            fontFamily: FONT_BODY,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 3,
            color: accent,
            background: `${accent}18`,
            border: `1px solid ${accent}55`,
            borderRadius: 100,
            padding: "8px 22px",
            marginBottom: 40,
          }}
        >
          STEP {number} OF 3
        </div>

        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: 30,
            background: `linear-gradient(135deg,${accent}22,${accent}08)`,
            border: `1px solid ${accent}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 44,
            opacity: iconIn,
            transform: `scale(${interpolate(iconIn, [0, 1], [0.6, 1])}) translateY(${interpolate(iconIn, [0, 1], [20, 0])}px)`,
            boxShadow: `0 0 60px ${accent}22`,
          }}
        >
          <span style={{ fontSize: 62 }}>{icon}</span>
        </div>

        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 56,
            color: C.text,
            lineHeight: 1.05,
            letterSpacing: 1,
            opacity: titleIn,
            transform: `translateY(${interpolate(titleIn, [0, 1], [24, 0])}px)`,
            marginBottom: 22,
            maxWidth: 720,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 25,
            color: C.muted,
            lineHeight: 1.6,
            maxWidth: 560,
            opacity: descIn,
            transform: `translateY(${interpolate(descIn, [0, 1], [16, 0])}px)`,
          }}
        >
          {desc}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
