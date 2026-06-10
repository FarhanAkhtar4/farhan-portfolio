import Navbar from '@/components/portfolio/Navbar';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Experience from '@/components/portfolio/Experience';
import Projects from '@/components/portfolio/Projects';
import Skills from '@/components/portfolio/Skills';
import Certifications from '@/components/portfolio/Certifications';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="section-divider mx-auto max-w-6xl" />
        <About />
        <div className="section-divider mx-auto max-w-6xl" />
        <Experience />
        <div className="section-divider mx-auto max-w-6xl" />
        <Projects />
        <div className="section-divider mx-auto max-w-6xl" />
        <Skills />
        <div className="section-divider mx-auto max-w-6xl" />
        <Certifications />
        <div className="section-divider mx-auto max-w-6xl" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}