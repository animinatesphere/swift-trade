import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { C, FONT_DISPLAY, FONT_BODY } from "../colors";

export const SocialProof = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const photoIn = spring({ frame, fps, config: { damping: 16, mass: 0.8 } });
  const photoScale = interpolate(frame, [0, durationInFrames], [1.08, 1]);

  const numberSpring = spring({ frame: frame - 10, fps, config: { damping: 13 } });
  const countProgress = interpolate(frame, [10, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const count = Math.round(interpolate(countProgress, [0, 1], [0, 5000]));

  const stars = spring({ frame: frame - 40, fps, config: { damping: 14 } });
  const quote = spring({ frame: frame - 52, fps, config: { damping: 14 } });

  const exit = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: exit, background: C.bg }}>
      <AbsoluteFill
        style={{
          opacity: photoIn,
          transform: `scale(${photoScale})`,
        }}
      >
        <Img
          src={staticFile("testimonial.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 20%",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,8,0.15) 0%, rgba(8,8,8,0.35) 40%, rgba(8,8,8,0.97) 78%, #080808 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          textAlign: "center",
          padding: "0 70px 130px",
        }}
      >
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 108,
            color: C.green,
            lineHeight: 1,
            opacity: numberSpring,
            transform: `scale(${interpolate(numberSpring, [0, 1], [0.7, 1])})`,
            textShadow: "0 10px 40px rgba(0,0,0,0.6)",
          }}
        >
          {count.toLocaleString()}+
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 28,
            color: C.text,
            marginTop: 4,
            opacity: numberSpring,
          }}
        >
          Nigerians already trading
        </div>

        <div
          style={{
            marginTop: 26,
            fontSize: 38,
            letterSpacing: 6,
            color: C.amber,
            opacity: stars,
            transform: `translateY(${interpolate(stars, [0, 1], [16, 0])}px)`,
          }}
        >
          ★★★★★
        </div>

        <div
          style={{
            marginTop: 30,
            maxWidth: 600,
            fontFamily: FONT_BODY,
            fontSize: 24,
            fontStyle: "italic",
            color: C.muted,
            lineHeight: 1.6,
            opacity: quote,
            transform: `translateY(${interpolate(quote, [0, 1], [16, 0])}px)`,
          }}
        >
          "Fastest platform ever. Had my naira in under 10 minutes."
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
