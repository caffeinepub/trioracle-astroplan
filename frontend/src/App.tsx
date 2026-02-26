import React, { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CoursesSection from './components/CoursesSection';
import SpecialUniqueServiceSection from './components/SpecialUniqueServiceSection';
import ServicesSection from './components/ServicesSection';
import BlogSection from './components/BlogSection';
import ComparisonTable from './components/ComparisonTable';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import ProfileSetupModal from './components/ProfileSetupModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden w-full">
      <Header onAdminClick={() => setShowAdmin(true)} />

      {showAdmin ? (
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      ) : (
        <main className="overflow-x-hidden w-full">
          <HeroSection />
          <section id="courses">
            <CoursesSection />
          </section>
          <section id="special-services">
            <SpecialUniqueServiceSection />
          </section>
          <section id="services">
            <ServicesSection />
          </section>
          <section id="blog">
            <BlogSection />
          </section>
          <ComparisonTable />
        </main>
      )}

      <Footer />

      {showProfileSetup && <ProfileSetupModal />}
      <Toaster richColors position="top-right" />
    </div>
  );
}
