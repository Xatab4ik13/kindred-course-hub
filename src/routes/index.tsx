import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AboutSection } from "@/components/site/AboutSection";
import { TeamSection } from "@/components/site/TeamSection";
import { HeroSection } from "@/components/site/HeroSection";
import { PricingSection } from "@/components/site/PricingSection";
import { SchedulePreviewSection } from "@/components/site/SchedulePreviewSection";
import { ReviewsSection } from "@/components/site/ReviewsSection";


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
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash ?? window.location.hash;
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <div id="about" data-companion-section="about">
          <AboutSection />
        </div>
        <div id="team" data-companion-section="team">
          <TeamSection />
        </div>
        <div id="pricing" data-companion-section="pricing">
          <PricingSection />
        </div>
        <div id="schedule" data-companion-section="schedule">
          <SchedulePreviewSection />
        </div>
        <div id="reviews" data-companion-section="reviews">
          <ReviewsSection />
        </div>

      </main>
      <Footer />
      
    </div>
  );
}
