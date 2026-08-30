import Hero             from "@/components/sections/Hero";
import SixTools         from "@/components/sections/SixTools";
import HowItWorks       from "@/components/sections/HowItWorks";
import Anatomy          from "@/components/sections/Anatomy";
import TheGap           from "@/components/sections/TheGap";
import Templates        from "@/components/sections/Templates";
import Playground       from "@/components/sections/Playground";
import WorkspaceFeatures from "@/components/sections/WorkspaceFeatures";
import WhatWorksToday   from "@/components/sections/WhatWorksToday";
import WaysToStart      from "@/components/sections/WaysToStart";
import FAQ              from "@/components/sections/FAQ";
import WaitlistCTA      from "@/components/sections/WaitlistCTA";
import Footer           from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="page-shell">
      <Hero />
      <SixTools />
      <HowItWorks />
      <Anatomy />
      <TheGap />
      <Templates />
      <Playground />
      <WorkspaceFeatures />
      <WhatWorksToday />
      <WaysToStart />
      <FAQ />
      <WaitlistCTA />
      <Footer />
    </div>
  );
}
