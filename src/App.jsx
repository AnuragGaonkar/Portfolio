import React, { useEffect, useState } from "react";
import emailjs from '@emailjs/browser';  // ✅ ADD THIS
import AOS from "aos";
import "aos/dist/aos.css";
import TiltedCard from "./TiltedCard.jsx";
import ProfileCard from "./ProfileCard.jsx";
import CardNav from "./CardNav.jsx";
import ProjectCard from "./ProjectCard.jsx";
import ProjectModal from "./ProjectModal.jsx";

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [formStatus, setFormStatus] = useState('');  // ✅ ADD FORM STATUS

  // ✅ EMAILJS INIT (REPLACE YOUR_PUBLIC_KEY)
  useEffect(() => {
    emailjs.init('112QULphEAjJAlwB3');  // ← GET FROM emailjs.com → Account → Public Key
  }, []);

  // ================= AOS + MOBILE CHECK =================
  useEffect(() => {
    // 🔥 AOS with animations ON mobile + smart offset
    AOS.init({
      duration: 800,
      once: false,
      offset: window.innerWidth <= 640 ? 10 : 80,  // 🔥 Tiny offset mobile
      easing: "ease-out-quart",
    });

    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ================= PAGE TRANSITION + NAV CONTROL =================
  useEffect(() => {
    const root = document.querySelector(".page-root");
    let isTransitioning = false;

    const onScroll = () => {
      if (!root || isTransitioning) return;
      const y = window.scrollY;
      const vh = window.innerHeight;

      // 🔥 SMOOTH SWIPE DOWN - Any scroll → Page 2
      if (y > 5 && !root.classList.contains("letter-opened")) {
        isTransitioning = true;
        root.classList.add("letter-opened");
        window.scrollTo({
          top: vh,
          behavior: 'smooth'  // 🔥 SMOOTH animation
        });
        setTimeout(() => { isTransitioning = false; }, 600);
      } 
      // 🔥 SMOOTH SWIPE UP - Page 2 → Page 1
      else if (y < vh * 0.2 && root.classList.contains("letter-opened")) {
        isTransitioning = true;
        root.classList.remove("letter-opened");
        window.scrollTo({
          top: 0,
          behavior: 'smooth'  // 🔥 SMOOTH back
        });
        setTimeout(() => { isTransitioning = false; }, 600);
      }

      // 🔥 NAVBAR control - PERFECT timing
      if (root.classList.contains("letter-opened")) {
        root.classList.add("after-landing");
      } else {
        root.classList.remove("after-landing");
      }
    };

    let animationTriggered = false;
    const triggerAnimations = () => {
      if (animationTriggered) return;
      animationTriggered = true;
      requestAnimationFrame(() => {
        AOS.refresh();
        document.body.offsetHeight;
      });
    };

    triggerAnimations();
    
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      animationTriggered = false;
      triggerAnimations();
    });
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", triggerAnimations);
    };
  }, []);

  // ================= NAV ITEMS =================
  const navItems = [
    { 
      label: "Journey", 
      bgColor: "#0d252a", 
      textColor: "#f4f0e8", 
      links: [{ label: "The Wanderer", href: "#journey" }] 
    },
    { 
      label: "Skills", 
      bgColor: "#102f33", 
      textColor: "#c3cacb", 
      links: [{ label: "Martial Arts", href: "#skills" }] 
    },
    { 
      label: "Quests", 
      bgColor: "#1e2d30", 
      textColor: "#c9a56a", 
      links: [{ label: "Projects", href: "#projects" }] 
    },
    { 
      label: "Research", 
      bgColor: "#081e22", 
      textColor: "#f4f0e8", 
      links: [{ label: "Achievements", href: "#research" }] 
    },
    { 
      label: "Tea House", 
      bgColor: "#071b20", 
      textColor: "#f7f5ee", 
      links: [{ label: "Contact Me", href: "#contact" }] 
    }
  ];

  // ================= PROJECT MODAL STATE =================
  const [activeProject, setActiveProject] = useState(null);
  const [activeAction, setActiveAction] = useState(null);

  const openProjectModal = (project, action) => {
    setActiveProject(project);
    setActiveAction(action);
  };

  const closeProjectModal = () => {
    setActiveProject(null);
    setActiveAction(null);
  };

  // ✅ EMAILJS SEND FUNCTION
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_unaqzuw', 'template_qmo4fbv', e.target, '112QULphEAjJAlwB3')  // ← ADD TEMPLATE_ID + PUBLIC_KEY
      .then((result) => {
        setFormStatus('✅ Message sent successfully! I\'ll reply within 24 hours.');
        e.target.reset();
        setTimeout(() => setFormStatus(''), 5000);  // Clear message after 5s
      }, (error) => {
        setFormStatus('❌ Failed to send. Please try again or email me directly.');
        console.error('EmailJS error:', error);
      });
  };

  // ================= PROJECT DATA =================
  const projects = [
    {
      title: "Medi-Quick Platform",
      status: "live",
      liveUrl: "https://mediquick-pqv7.onrender.com",
      architectureImage: "/images/Mediquick.png",
      description: `
Full-stack online medicine delivery platform built with MongoDB, Express.js,
React.js, and Node.js, implementing role-based access for users and admins,
secure JWT authentication, and guarded APIs for catalogue, cart, orders, and
inventory management.

Integrated an AI chatbot from scratch to assist users with medical queries and
help admins receive alerts on low stock, combining robust backend flows with
intelligent assistance.
      `,
      actions: ["live", "architecture", "demo"],
      actionLabels: { live: "View Live", architecture: "View Architecture", demo: "Watch Demo" },
      demo: { enabled: true, mobileVideo: "/videos/mediquick-mobile.mp4", desktopVideo: "/videos/mediquick-desktop.mp4" },
      architecture: `
MERN-based architecture with JWT authentication, role-based access control,
secure REST APIs, and a modular backend. The AI chatbot is integrated as a
service layer interacting with inventory, orders, and user workflows.
      `
    },
    {
      title: "MediScan",
      status: "demo",
      architectureImage: "/images/mediscan.png",
      description: `
End-to-end medical image classification model in PyTorch, trained on over
21,000 grayscale images across multiple diagnostic categories with automated
64×64 preprocessing and feature scaling, achieving around 99% accuracy for
robust disease prediction.

Integrated with a simple React frontend to expose model predictions in a
clear, decision-support format for doctors.
      `,
      actions: ["demo", "architecture"],
      actionLabels: { demo: "Watch Demo", architecture: "Model Pipeline" },
      demo: { enabled: true, mobileVideo: "/videos/mediscan.mp4", desktopVideo: "/videos/mediscan.mp4" },
      architecture: `
PyTorch CNN pipeline with controlled inference, designed strictly for
local execution to prevent public misuse of medical predictions.
      `
    },
    {
      title: "Policy Drafting Agent",
      status: "forging",
      architectureImage: "/images/rag.png",
      description: `
Phase-1 RAG-based policy drafting assistant that indexes policy PDFs using
FAISS for semantic search and answers queries via retrieval augmented
generation, reducing manual document lookup.

Includes an LLM-based conflict checker that compares new or updated drafts
against top-k similar policies and suggests how to resolve overlaps,
preventing redundant policies from being stored.
      `,
      actions: ["architecture", "progress"], 
      actionLabels: { architecture: "System Architecture", progress: "Development Progress" },
      architecture: `
FAISS vector indexing + LLM drafting pipeline with semantic conflict detection.
      `,
      progress: [
        "Document ingestion & embedding completed",
        "Semantic retrieval operational",
        "Draft generation implemented",
        "Conflict detection in progress"
      ]
    },
    {
      title: "Smart Transportation Optimizer",
      status: "live", 
      liveUrl: "https://stepping-stone-solution-lzezabbhmtqpyowvnesj6f.streamlit.app/",
      architectureImage: "/images/transport.png",
      description: `
Python desktop application using Tkinter and Pillow to solve transportation
problems with VAM and Stepping Stone algorithms, optimizing supply allocation
for up to four sources and four destinations.

Provides a clear GUI for visualizing minimum-cost routes and understanding
allocation decisions.
      `,
      actions: ["live", "algorithm", "demo"],
      actionLabels: { live: "View Live", algorithm: "Algorithm Flow", demo: "Watch Demo" },
      demo: { enabled: true, mobileVideo: "/videos/transport.mp4", desktopVideo: "/videos/transport.mp4" },
      algorithmInfo: `
Implements Vogel's Approximation Method and Stepping Stone optimization
with deterministic cost minimization logic.
      `
    },
    {
      title: "FacialOcclusionNet",
      status: "published",
      liveUrl: "https://mask-detection-research-lry6ystaf9q3drfgq3raas.streamlit.app/", 
      description: `
Lead author of an IEEE-published paper titled "FacialOcclusionNet: A Novel
Real Time Face Mask Detection Model", proposing a MobileNet-based architecture
tailored for real-time face-mask detection under occlusion.

Trained on a curated dataset of 7,553 images (balanced across mask and no-mask)
and achieved over 99% test accuracy, precision, recall, and F1-score,
outperforming a custom CNN baseline and several referenced models.

Designed specifically for lightweight edge deployment so it can run in
real-time on resource-constrained devices in crowded environments.
      `,
      actions: ["live", "paper","demo"],
      actionLabels: { live: "View Live", paper: "Research Overview", demo: "Watch Demo" },
      demo: { enabled: true, mobileVideo: "/videos/research.mp4", desktopVideo: "/videos/research.mp4" },
      paperInfo: `
Peer-reviewed IEEE publication focused on efficient CNN design for real-time
mask detection on resource-constrained devices.
      `
    }
  ];

  return (
    <div className="page-root">
      {/* MOBILE ONLY CARD NAV - Controlled via isMobile and after-landing class */}
      {isMobile && (
        <CardNav 
          items={navItems} 
          title="My Portfolio" 
          baseColor="rgba(13, 37, 42, 0.98)" 
          menuColor="#c9a56a"
          className="mobile-card-nav"
        />
      )}

      {/* PAGE 1: full-screen profile cover */}
      <section className="page profile-page transition-shell">
        <div className="profile-page-inner">
          <ProfileCard
            avatarUrl="/profile.png"
            miniAvatarUrl="/profile.png"
            name="Anurag Gaonkar"
            title="AI & Full‑Stack Engineer"
            handle="anuraggaonkar"
            status="Exploring new quests"
            enableTilt={true}
            enableMobileTilt={true}
            showUserInfo={false}
          />
        </div>
      </section>

      {/* PAGE 2: main site / portfolio */}
      <section className="page portfolio-page" id="portfolio-root">
        <header className="top-nav desktop-only-nav">
          <div className="nav-logo">My Portfolio</div>
          <nav className="nav-links">
            <a href="#journey">Journey</a>
            <a href="#skills">Martial Arts</a>
            <a href="#projects">Quests</a>
            <a href="#research">Research</a>
            <a href="#contact">Tea House</a>
          </nav>
        </header>

        <main className="main-content">
          {/* HERO */}
          <section className="hero-section">
            <div className="hero-left">
              <h1 className="hero-title" data-aos="fade-right">
                Anurag Gaonkar
              </h1>
              <p className="hero-subtitle" data-aos="fade-right" data-aos-delay="150">
                Final‑year Artificial Intelligence and Data Science engineer,
                blending full‑stack development with AI integration to build
                end‑to‑end systems that are fast, reliable, and ready for
                real‑world deployment.
              </p>
              <div className="hero-actions" data-aos="fade-right" data-aos-delay="250">
                <a href="#projects" className="btn primary-btn">
                  View Quests
                </a>
                <a href="#contact" className="btn ghost-btn">
                  Contact
                </a>
              </div>
            </div>

            <div className="hero-profile-wrapper" data-aos="fade-left" data-aos-delay="150">
              <TiltedCard
                imageSrc="/profile.png"
                altText="Anurag Gaonkar"
                captionText="Anurag Gaonkar"
                containerHeight="340px"
                containerWidth="280px"
                imageHeight="340px"
                imageWidth="280px"
                rotateAmplitude={10}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={false}
              />
            </div>
          </section>

          {/* Journey */}
          <section id="journey" className="section section-ink" data-aos="fade-up">
            <h2 className="section-title">The Wanderer's Journey</h2>
            <p className="section-text">
              I am pursuing a Bachelor of Engineering in Artificial Intelligence
              and Data Science at Thadomal Shahani Engineering College, Mumbai,
              graduating in 2026 with a current CGPA of 9.32. My core focus is
              designing and delivering production‑ready AI and web systems that
              perform well under real constraints.
            </p>
            <p className="section-text">
              I see myself as a full‑stack developer with a strong inclination
              towards AI integration. On the development side, I work primarily
              with the MERN stack—React for frontend, Node.js and Express for
              backend, and MongoDB for data—while also using Java and Spring Boot
              for more enterprise‑level systems and working with databases like
              MySQL, Oracle, and SQLite.
            </p>
            <p className="section-text">
              On the AI side, I work extensively with Python, PyTorch, and more
              recently LLMs, RAG architectures, and GenAI frameworks. I enjoy
              architecting end‑to‑end solutions where intelligent backends and
              user‑centric frontends are designed together rather than in
              isolation.
            </p>
          </section>

          {/* Skills */}
          <section id="skills" className="section section-scroll" data-aos="fade-up">
            <h2 className="section-title">Martial Arts & Skills</h2>
            <div className="skills-grid">
              <div className="skill-card">
                <h3>Languages</h3>
                <ul>
                  <li>Python, Java, JavaScript</li>
                  <li>SQL</li>
                </ul>
              </div>
              <div className="skill-card">
                <h3>Web & Backend</h3>
                <ul>
                  <li>React.js, Node.js, Express.js</li>
                  <li>REST APIs, JSON</li>
                  <li>Authentication & Authorization (JWT, RBAC)</li>
                  <li>Spring Boot</li>
                </ul>
              </div>
              <div className="skill-card">
                <h3>Data & AI</h3>
                <ul>
                  <li>PyTorch, Computer Vision</li>
                  <li>LLMs, RAG, LangChain</li>
                  <li>Model evaluation & deployment</li>
                </ul>
              </div>
              <div className="skill-card">
                <h3>Databases & Tools</h3>
                <ul>
                  <li>MongoDB, MySQL, Oracle, SQLite</li>
                  <li>GitHub, Firebase, Postman</li>
                  <li>Hackathons & team collaboration</li>
                </ul>
              </div>
            </div>
          </section>

          {/* PROJECTS - NEW DYNAMIC CARDS */}
          <section id="projects" className="section section-ink" data-aos="fade-up">
            <h2 className="section-title">Quests & Legends</h2>
            <div className="projects-grid">
              {projects.map((project, idx) => (
                <ProjectCard 
                  key={idx} 
                  project={project} 
                  onOpen={openProjectModal} 
                />
              ))}
            </div>
          </section>

          {/* Research */}
          <section id="research" className="section section-scroll" data-aos="fade-up">
            <h2 className="section-title">Research & Achievements</h2>
            <div className="projects-grid">
              <article className="project-card">
                <h3>Hackathons & Leadership</h3>
                <p>
                  Participated in multiple hackathons, securing Top‑5 finishes in
                  three events and a recent Top‑6 placement at Mumbai Hacks 2025
                  for AI‑driven solutions, learning to ship under pressure and
                  collaborate across disciplines.
                </p>
                <p>
                  Served as Creatives & Design lead at CSI, TSEC, managing
                  visual communication for college events and ensuring timely
                  delivery of marketing material while coordinating with
                  cross‑functional teams.
                </p>
              </article>
            </div>
          </section>

          {/* Contact - ✅ EMAILJS FORM */}
          <section id="contact" className="section section-scroll" data-aos="fade-up">
            <h2 className="section-title">The Tea House</h2>
            <p className="section-text">
              For roles involving full‑stack development, AI integration, or
              applied research, feel free to reach out. I am especially interested
              in working on systems that combine intelligent backends with clean,
              performance‑focused frontends.
            </p>

            <form className="contact-form" onSubmit={sendEmail}>
              <div className="form-row">
                <label htmlFor="user_name">Name</label>
                <input id="user_name" name="user_name" type="text" required />
              </div>
              <div className="form-row">
                <label htmlFor="user_email">Email</label>
                <input id="user_email" name="user_email" type="email" required />
              </div>
              <div className="form-row">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="4" required />
              </div>
              <button type="submit" className="btn primary-btn wind-hover">
                Send Message
              </button>
              {formStatus && (
                <p className={`form-status ${formStatus.includes('✅') ? 'success' : 'error'}`}>
                  {formStatus}
                </p>
              )}
            </form>
          </section>

          <footer className="page-footer">
            <span>
              © {new Date().getFullYear()} Anurag Gaonkar • AI & Full‑Stack
              Engineering.
            </span>
          </footer>
        </main>

        {/* PROJECT MODAL */}
        {activeProject && (
          <ProjectModal
            project={activeProject}
            action={activeAction}
            onClose={closeProjectModal}
          />
        )}
      </section>
    </div>
  );
}

export default App;

