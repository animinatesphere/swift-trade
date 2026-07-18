import { Composition } from "remotion";
import "./fonts.css";
import { SwiftTradeAd } from "./SwiftTradeAd";
import { SwiftTradeHowItWorks } from "./SwiftTradeHowItWorks";

export const Root = () => {
  return (
    <>
      <Composition
        id="SwiftTradeAd"
        component={SwiftTradeAd}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SwiftTradeHowItWorks"
        component={SwiftTradeHowItWorks}
        durationInFrames={570}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
