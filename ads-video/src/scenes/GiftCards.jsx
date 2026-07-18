import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Background } from "../components/Background";
import { C, FONT_DISPLAY, FONT_BODY } from "../colors";

const CARDS = [
  { label: "Amazon", color: "#FF9900", bg: "linear-gradient(135deg,#1a0a00,#2d1500)" },
  { label: "Steam", color: "#66C0F4", bg: "linear-gradient(135deg,#001a2d,#00264d)" },
  { label: "iTunes", color: "#FC3C44", bg: "linear-gradient(135deg,#1a001a,#2d002d)" },
  { label: "Google Play", color: "#0ECB81", bg: "linear-gradient(135deg,#001a00,#002d00)" },
];

export const GiftCards = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const caption = spring({ frame, fps, config: { damping: 14 } });

  const exit = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", padding: "170px 60px 0" }}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 58,
            textAlign: "center",
            lineHeight: 1.05,
            color: C.text,
            opacity: caption,
            transform: `translateY(${interpolate(caption, [0, 1], [24, 0])}px)`,
            marginBottom: 20,
          }}
        >
          🎁 Got gift cards?
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 26,
            textAlign: "center",
            color: C.muted,
            opacity: caption,
            marginBottom: 80,
            maxWidth: 640,
          }}
        >
          Turn them into instant naira — Amazon, Steam, iTunes & more.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            width: "100%",
            maxWidth: 760,
          }}
        >
          {CARDS.map((card, i) => {
            const s = spring({
              frame: frame - (20 + i * 8),
              fps,
              config: { damping: 12, mass: 0.6 },
            });
            return (
              <div
                key={card.label}
                style={{
                  background: card.bg,
                  border: `1px solid ${card.color}33`,
                  borderRadius: 28,
                  padding: 32,
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 15,
                    fontWeight: 700,
                    color: card.color,
                    letterSpacing: 2,
                    marginBottom: 18,
                  }}
                >
                  {card.label.toUpperCase()}
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 18,
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  Instant payout
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
