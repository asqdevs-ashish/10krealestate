import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { ResidenceExplorer } from "@/components/sections/ResidenceExplorer";
import { ArchitectureSection } from "@/components/sections/ArchitectureSection";
import { FloorPlanSection } from "@/components/sections/FloorPlanSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { LifestyleSection } from "@/components/sections/LifestyleSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { InvestmentSection } from "@/components/sections/InvestmentSection";
import { AvailabilitySection } from "@/components/sections/AvailabilitySection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { DeveloperSection } from "@/components/sections/DeveloperSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { QualificationSection } from "@/components/sections/QualificationSection";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "VAULT — Private Residences in Sector 58, Gurugram",
  description:
    "Thirty-four private residences by A Square Devs off Golf Course Road Extension. Two, three and four bedroom homes plus four penthouses, from ₹1.85 Cr.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <ResidenceExplorer />
      <ArchitectureSection />
      <FloorPlanSection />
      <LocationSection />
      <LifestyleSection />
      <GallerySection />
      <InvestmentSection />
      <AvailabilitySection />
      <TestimonialSection />
      <DeveloperSection />
      <FaqSection />
      <QualificationSection />
      <FinalCta />
    </>
  );
}
