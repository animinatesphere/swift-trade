import { Series, Sequence, Audio, staticFile, interpolate } from "remotion";
import { HookProblem } from "./scenes/HookProblem";
import { Step } from "./scenes/Step";
import { CTA } from "./scenes/CTA";
import { C } from "./colors";

const TOTAL_DURATION = 570;

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

export const SwiftTradeHowItWorks = () => {
  return (
    <>
      <Audio src={staticFile("bgm.mp3")} volume={bgmVolume} endAt={TOTAL_DURATION} />

      <Series>
        <Series.Sequence durationInFrames={90}>
          <Whoosh />
          <HookProblem />
        </Series.Sequence>

        <Series.Sequence durationInFrames={120}>
          <Whoosh />
          <Step
            number="1"
            icon="🔐"
            accent={C.blue}
            title="Sign Up & Get Verified"
            desc="Create your account and verify your ID in under 2 minutes."
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={120}>
          <Whoosh />
          <Step
            number="2"
            icon="⇄"
            accent={C.amber}
            title="Send Crypto or a Gift Card"
            desc="Send BTC, USDT, ETH — or submit a gift card. Your rate is locked in instantly."
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={120}>
          <Whoosh />
          {/* coin chime as the payout lands */}
          <Sequence from={45}>
            <Audio src={staticFile("sfx-coin.mp3")} volume={0.55} />
          </Sequence>
          <Step
            number="3"
            icon="🏦"
            accent={C.green}
            title="Get Paid to Your Bank"
            desc="Your Naira lands straight in your account — most payouts in minutes."
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={120}>
          <Whoosh />
          <Sequence from={30}>
            <Audio src={staticFile("sfx-pop.mp3")} volume={0.5} />
          </Sequence>
          <CTA
            headline="JOIN SWIFT TRADE"
            headlineAccent="NOW"
            buttonText="Get Started Free →"
          />
        </Series.Sequence>
      </Series>
    </>
  );
};
