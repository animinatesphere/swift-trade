import { useEffect } from "react";
import { C, GLOBAL_CSS } from "./constants";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { Services } from "./components/Services";
import { HowItWorks } from "./components/HowItWorks";
import { Rates } from "./components/Rates";
import { GiftCards } from "./components/GiftCards";
import { Testimonials } from "./components/Testimonials";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function Home() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ background:C.bg, color:C.text, fontFamily:"'Outfit',sans-serif" }}>
      <Nav />
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <Rates />
      <GiftCards />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
