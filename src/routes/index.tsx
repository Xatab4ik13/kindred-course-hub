import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AboutSection } from "@/components/site/AboutSection";
import { TeamSection } from "@/components/site/TeamSection";

import { HeroSection } from "@/components/site/HeroSection";

import { PricingSection } from "@/components/site/PricingSection";
import { SchedulePreviewSection } from "@/components/site/SchedulePreviewSection";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { CtaSection } from "@/components/site/CtaSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CHINAR — школа китайского языка" },
      {
        name: "description",
        content:
          "Живые уроки китайского с носителями, подготовка к HSK 1–6, детские и взрослые группы. Онлайн и офлайн.",
      },
      { property: "og:title", content: "CHINAR — школа китайского языка" },
      {
        property: "og:description",
        content: "Живые уроки с носителями, HSK 1–6, онлайн и офлайн.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <div data-companion-section="about">
          <AboutSection />
        </div>
        <div data-companion-section="team">
          <TeamSection />
        </div>



        <div data-companion-section="pricing">
          <PricingSection />
        </div>
        <div data-companion-section="schedule">
          <SchedulePreviewSection />
        </div>
        <div data-companion-section="reviews">
          <ReviewsSection />
        </div>

      </main>
      <Footer />
      
    </div>
  );
}
