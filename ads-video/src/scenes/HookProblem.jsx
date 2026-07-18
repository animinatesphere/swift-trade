import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Background } from "../components/Background";
import { C, FONT_DISPLAY, FONT_BODY } from "../colors";

export const HookProblem = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const line1 = spring({ frame, fps, config: { damping: 14 } });
  const line2 = spring({ frame: frame - 16, fps, config: { damping: 14 } });
  const strike = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line3 = spring({ frame: frame - 55, fps, config: { damping: 13, mass: 0.6 } });

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
            fontFamily: FONT_DISPLAY,
            fontSize: 72,
            lineHeight: 1.05,
            color: C.text,
            letterSpacing: 1,
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [26, 0])}px)`,
          }}
        >
          STILL WAITING
        </div>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 72,
            lineHeight: 1.05,
            color: C.text,
            letterSpacing: 1,
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [26, 0])}px)`,
            marginBottom: 30,
            position: "relative",
          }}
        >
          HOURS FOR YOUR CASH?
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: `${strike * 100}%`,
              height: 6,
              background: C.red,
              transform: "translate(-50%, -50%) rotate(-2deg)",
              borderRadius: 4,
            }}
          />
        </div>

        <div
          style={{
            opacity: line3,
            transform: `translateY(${interpolate(line3, [0, 1], [20, 0])}px)`,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(14,203,129,0.1)",
            border: `1px solid ${C.green}55`,
            padding: "14px 28px",
            borderRadius: 100,
          }}
        >
          <span
            style={{
              fontFamily: FONT_BODY,
              color: C.green,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            Swift Trade pays you in minutes.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
