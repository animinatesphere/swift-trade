import { Series, Sequence, Audio, staticFile, interpolate } from "remotion";
import { Hook } from "./scenes/Hook";
import { Convert } from "./scenes/Convert";
import { GiftCards } from "./scenes/GiftCards";
import { SocialProof } from "./scenes/SocialProof";
import { CTA } from "./scenes/CTA";

const TOTAL_DURATION = 540;

const bgmVolume = (f) =>
  interpolate(
    f,
    [0, 20, TOTAL_DURATION - 40, TOTAL_DURATION],
    [0, 0.35, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

const Whoosh = () => (
  <Audio src={staticFile("sfx-whoosh.mp3")} volume={0.45} />
);

export const SwiftTradeAd = () => {
  return (
    <>
      <Audio src={staticFile("bgm.mp3")} volume={bgmVolume} endAt={TOTAL_DURATION} />

      <Series>
        <Series.Sequence durationInFrames={90}>
          <Whoosh />
          <Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={120}>
          <Whoosh />
          {/* coin chime timed to land as the NGN counter finishes (~frame 60) */}
          <Sequence from={60}>
            <Audio src={staticFile("sfx-coin.mp3")} volume={0.55} />
          </Sequence>
          <Convert />
        </Series.Sequence>

        <Series.Sequence durationInFrames={90}>
          <Whoosh />
          <GiftCards />
        </Series.Sequence>

        <Series.Sequence durationInFrames={90}>
          <Whoosh />
          <SocialProof />
        </Series.Sequence>

        <Series.Sequence durationInFrames={150}>
          <Whoosh />
          {/* pop timed to land as the CTA button springs in (~frame 30) */}
          <Sequence from={30}>
            <Audio src={staticFile("sfx-pop.mp3")} volume={0.5} />
          </Sequence>
          <CTA />
        </Series.Sequence>
      </Series>
    </>
  );
};
