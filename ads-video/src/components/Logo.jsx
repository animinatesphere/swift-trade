import { Img, staticFile } from "remotion";
import { C, FONT_DISPLAY } from "../colors";

export const Logo = ({ size = 64, textSize = 30, subSize = 12, style = {} }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, ...style }}>
    <Img
      src={staticFile("logo.png")}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
    <div>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: textSize,
          color: C.text,
          letterSpacing: 3,
          lineHeight: 1,
        }}
      >
        SWIFT
      </div>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: subSize,
          color: C.amber,
          letterSpacing: 7,
          marginTop: 2,
        }}
      >
        TRADE
      </div>
    </div>
  </div>
);
