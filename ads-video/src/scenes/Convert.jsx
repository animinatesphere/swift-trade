import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { Background } from "../components/Background";
import { C, FONT_DISPLAY, FONT_BODY, FONT_MONO } from "../colors";

const ASSETS = [
  { src: "btc.png", label: "BTC" },
  { src: "eth.png", label: "ETH" },
  { src: "usdt.png", label: "USDT" },
];

export const Convert = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const caption = spring({ frame, fps, config: { damping: 14 } });
  const card = spring({ frame: frame - 14, fps, config: { damping: 13, mass: 0.7 } });
  const rowIn = spring({ frame: frame - 30, fps, config: { damping: 14 } });

  const countProgress = interpolate(frame, [50, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ngnValue = Math.round(interpolate(countProgress, [0, 1], [0, 795840]));

  const exit = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", padding: "150px 60px 0" }}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 58,
            textAlign: "center",
            lineHeight: 1.05,
            color: C.text,
            opacity: caption,
            transform: `translateY(${interpolate(caption, [0, 1], [24, 0])}px)`,
            marginBottom: 90,
          }}
        >
          Convert crypto to cash
          <br />
          in <span style={{ color: C.green }}>minutes.</span>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 760,
            background: C.card,
            border: `1px solid ${C.border2}`,
            borderRadius: 40,
            padding: 44,
            opacity: card,
            transform: `translateY(${interpolate(card, [0, 1], [60, 0])}px) scale(${interpolate(card, [0, 1], [0.92, 1])})`,
            boxShadow: "0 60px 120px rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 18,
              color: C.muted,
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            YOU SEND
          </div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 44,
              color: C.text,
              marginBottom: 30,
            }}
          >
            500 USDT
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 30,
            }}
          >
            <div style={{ flex: 1, height: 1, background: C.border2 }} />
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: `${C.green}18`,
                border: `1px solid ${C.green}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: C.green,
              }}
            >
              ↓
            </div>
            <div style={{ flex: 1, height: 1, background: C.border2 }} />
          </div>

          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 18,
              color: C.muted,
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            YOU RECEIVE
          </div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 56,
              color: C.green,
              fontWeight: 600,
            }}
          >
            ₦{ngnValue.toLocaleString()}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 56,
            opacity: rowIn,
            transform: `translateY(${interpolate(rowIn, [0, 1], [20, 0])}px)`,
          }}
        >
          {ASSETS.map((a) => (
            <div
              key={a.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: C.card2,
                border: `1px solid ${C.border2}`,
                borderRadius: 100,
                padding: "10px 20px 10px 10px",
              }}
            >
              <Img
                src={staticFile(a.src)}
                style={{ width: 32, height: 32, borderRadius: "50%" }}
              />
              <span style={{ fontFamily: FONT_MONO, fontSize: 20, color: C.text }}>
                {a.label}
              </span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
