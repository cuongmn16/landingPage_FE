import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StorySection from '../components/home/StorySection';
import HowToPlaySection from '../components/home/HowToPlaySection';
import MissionsSection from '../components/home/MissionsSection';
import UnitsSection from '../components/home/UnitsSection';
import LeaderboardPreviewSection from '../components/home/LeaderboardPreviewSection';
import PrizesSection from '../components/home/PrizesSection';
import TimelineSection from '../components/home/TimelineSection';
import FAQSection from '../components/home/FAQSection';
import RegisterSection from '../components/home/RegisterSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <HowToPlaySection />
      <MissionsSection />
      <UnitsSection />
      <LeaderboardPreviewSection />
      <PrizesSection />
      <TimelineSection />
      <FAQSection />
      <RegisterSection />
    </main>
  );
}
