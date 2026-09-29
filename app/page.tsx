import Contact from "@/components/home/Contact";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import PopularCombos from "@/components/home/PopularCombos";
import SpecialOffer from "@/components/home/SpecialOffer";
import Features from "@/components/home/Features";
import About from "@/components/home/About";
import Testimonials from "@/components/home/Testimonials";
import AppDownload from "@/components/home/AppDownload";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* =========================================================
          Main Navigation
          ========================================================= */}
      <Navbar />

      {/* =========================================================
          Homepage Content
          ========================================================= */}

      <Hero />

      <Categories />

      {/* Featured products only.
          Full menu is available at /menu. */}
      <PopularCombos />

      <SpecialOffer />

      <Features />

      <About />

      <Testimonials />

      <Contact />

      <AppDownload />

      {/* =========================================================
          Footer
          ========================================================= */}
      <Footer />
    </main>
  );
}