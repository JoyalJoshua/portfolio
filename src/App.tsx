import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  ArrowUpRight, 
  MapPin, 
  ChevronDown,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { DATA } from './lib/constants';
import React, { useState, useEffect, useRef } from 'react';

// --- Sub-components ---

const SectionTitle = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-baseline gap-4 mb-16 overflow-hidden">
    <motion.span 
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 0.4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="font-mono text-xs sm:text-sm tracking-tighter"
    >
      {number}
    </motion.span>
    <motion.h2 
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="text-4xl md:text-5xl lg:text-8xl font-light tracking-tight leading-none"
    >
      {title}
    </motion.h2>
  </div>
);

const MagneticButton = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = (clientX - centerX) * 0.35;
    const y = (clientY - centerY) * 0.35;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

const CircularProgress = ({ value, name }: { value: number; name: string }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6 p-10 border border-line group hover:bg-ink transition-colors duration-500 rounded-3xl">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-line group-hover:text-ink/10"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray={circumference}
            className="text-ink group-hover:text-white"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-light group-hover:text-white transition-colors tracking-tighter">
            {value}%
          </span>
        </div>
      </div>
      <span className="text-xs uppercase tracking-[0.2em] font-medium opacity-60 group-hover:opacity-100 group-hover:text-white transition-all">
        {name}
      </span>
    </div>
  );
};

// --- Main Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 transition-all duration-700 ${
          scrolled ? 'bg-paper/80 backdrop-blur-xl border-b border-line py-4' : 'bg-transparent'
        }`}
      >
        <a href="#" className="font-serif text-3xl tracking-tighter group flex items-center gap-1">
          <span className="bg-ink text-paper px-2 py-0.5 rounded-lg group-hover:rotate-12 transition-transform">J</span>.
        </a>
        
        <div className="hidden md:flex gap-16 font-mono text-[10px] uppercase tracking-[0.3em] opacity-40">
          {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:opacity-100 hover:tracking-[0.4em] transition-all duration-300">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <MagneticButton className="hidden sm:block">
            <a 
              href="#contact" 
              className="bg-ink text-paper px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold hover:scale-105 transition-all shadow-xl hover:shadow-ink/20"
            >
              Contact
            </a>
          </MagneticButton>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-ink/5 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-ink text-paper flex flex-col items-center justify-center gap-12"
          >
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-8 right-8 p-4 hover:bg-white/10 rounded-full"
            >
              <X size={32} />
            </button>
            {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-5xl font-serif italic hover:translate-x-4 transition-transform opacity-60 hover:opacity-100"
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-ink opacity-[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-ink opacity-[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:w-1/2 text-center lg:text-left z-10"
        >
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.5 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.5em] font-semibold mb-8 flex items-center justify-center lg:justify-start gap-3"
          >
            <span className="w-8 h-px bg-ink/30" />
            {DATA.role}
          </motion.p>
          
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl md:text-9xl lg:text-[11rem] font-serif tracking-tighter leading-[0.75] mb-12"
          >
            {DATA.name.split(' ')[0]} <br />
            <span className="italic pl-8 sm:pl-16 opacity-80">{DATA.name.split(' ').slice(1).join(' ')}</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            transition={{ delay: 0.7 }}
            className="max-w-md lg:mx-0 mx-auto text-xl md:text-2xl font-light italic mb-12 text-ink/70 leading-relaxed"
          >
            {DATA.tagline}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex gap-10 items-center justify-center lg:justify-start"
          >
            <a href={DATA.linkedin} target="_blank" rel="noreferrer" className="opacity-40 hover:opacity-100 hover:scale-125 transition-all text-xl"><Linkedin size={24} /></a>
            <a href={DATA.github} target="_blank" rel="noreferrer" className="opacity-40 hover:opacity-100 hover:scale-125 transition-all text-xl"><Github size={24} /></a>
            <a href={`mailto:${DATA.email}`} className="opacity-40 hover:opacity-100 hover:scale-125 transition-all text-xl group relative">
              <Mail size={24} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 100, scale: 0.9 }}
           animate={{ opacity: 1, x: 0, scale: 1 }}
           transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
           className="lg:w-1/2 relative"
        >
          <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-[60px] md:rounded-[100px] overflow-hidden border-[1px] border-ink/10 p-2 shadow-2xl skew-y-1">
             <div className="absolute inset-0 bg-ink/5 z-0" />
             <img 
               src={DATA.photo} 
               alt={DATA.name}
               className="w-full h-full object-cover rounded-[55px] md:rounded-[95px] grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100 relative z-10"
             />
             <div className="absolute -bottom-10 -right-10 w-40 h-40 border border-ink/20 rounded-full animate-pulse" />
          </div>
          <div className="absolute -top-12 -left-12 font-mono text-[10px] uppercase tracking-widest opacity-20 rotate-90 origin-bottom-left italic whitespace-nowrap">
            Portfolio Vol.01 // 2026
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="mt-20 flex flex-col items-center gap-3 opacity-20"
      >
        <span className="text-[9px] uppercase tracking-[0.5em] font-mono">Scroll Explore</span>
        <ChevronDown size={14} />
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-40 bg-ink text-paper">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-20">
          <div className="lg:col-span-4 lg:pr-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="sticky top-40"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40 mb-10 flex items-center gap-4">
                <span className="w-4 h-px bg-white/40" /> 01 // Overview
              </div>
              <h2 className="text-5xl md:text-7xl font-serif mb-12 italic leading-tight tracking-tighter">The <br />Narrative.</h2>
              <div className="flex items-center gap-4 text-xs font-mono tracking-widest opacity-60">
                <MapPin size={14} />
                <span>{DATA.location}</span>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-8 flex flex-col gap-16">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <p className="text-3xl md:text-5xl lg:text-6xl leading-[1.1] font-light text-paper/90 tracking-tight mb-20 excerpt">
                {DATA.about.bio}
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-20 border-t border-white/5 pt-16">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-30 mb-8 font-bold">The Internal Drive</h3>
                <p className="text-xl italic font-light opacity-60 leading-relaxed">{DATA.about.passion}</p>
              </motion.div>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-30 mb-8 font-bold">Future Trajectory</h3>
                <p className="text-xl italic font-light opacity-60 leading-relaxed">{DATA.about.vision}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="py-40">
      <div className="container mx-auto px-6 mb-32">
        <SectionTitle number="02" title="Arsenal." />
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-2xl text-xl opacity-50 font-light italic"
        >
          A selection of technologies and methodologies I employ to construct intelligent, high-fidelity digital systems.
        </motion.p>
      </div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {DATA.skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <CircularProgress value={skill.level} name={skill.name} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({ year, title, subtitle, desc, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.2 }}
    className="group relative pl-12 border-l border-ink/5 pb-20 last:pb-0"
  >
    <div className="absolute top-0 left-[-6px] w-3 h-3 rounded-full border border-ink bg-paper group-hover:bg-ink transition-all duration-500" />
    <span className="font-mono text-[10px] uppercase tracking-[0.5em] opacity-30 mb-6 block font-bold">{year}</span>
    <h4 className="text-3xl md:text-5xl font-serif mb-4 tracking-tighter transition-all group-hover:italic">{title}</h4>
    <p className="text-lg md:text-xl font-light italic mb-4 opacity-50">{subtitle}</p>
    {desc && <p className="text-sm opacity-40 font-mono tracking-tight leading-relaxed max-w-lg">{desc}</p>}
  </motion.div>
);

const Experience = () => {
  return (
    <section id="experience" className="py-40 bg-paper">
      <div className="container mx-auto px-6">
        <SectionTitle number="03" title="Timeline." />
        
        <div className="grid lg:grid-cols-12 gap-24 mt-20">
          <div className="lg:col-span-12">
            <div className="flex flex-col">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-20 mb-20 flex items-center gap-4">
                Academic Progress <span className="w-12 h-px bg-ink/20" />
              </h3>
              {DATA.education.map((edu, index) => (
                <TimelineItem 
                  key={index}
                  index={index}
                  year={edu.year}
                  title={edu.college}
                  subtitle={`${edu.degree} — ${edu.department}`}
                />
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-12 mt-20">
             <div className="bg-ink text-paper p-12 md:p-20 rounded-[60px] relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-[0.02] transition-opacity duration-1000" />
               <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-30 mb-16 italic font-bold">Certifications & Merits</h3>
               <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
                 {DATA.certifications.map((cert, i) => (
                   <motion.a 
                     key={i}
                     href={cert.link}
                     target="_blank"
                     rel="noreferrer"
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ delay: i * 0.1 }}
                     className="flex items-center justify-between group/link py-6 border-b border-white/10 hover:border-white transition-all overflow-hidden"
                   >
                     <span className="text-xl md:text-2xl font-serif italic tracking-tighter opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-2 transition-all">
                       {cert.name}
                     </span>
                     <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center group-hover/link:bg-paper group-hover/link:text-ink transition-all">
                       <ArrowUpRight size={20} />
                     </div>
                   </motion.a>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-40">
      <div className="container mx-auto px-6 mb-32">
        <SectionTitle number="04" title="Curation." />
      </div>
      
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20">
          {DATA.projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[40px] md:rounded-[60px] mb-10 bg-ink/5 border border-ink/5">
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="w-full h-full object-cover grayscale brightness-110 contrast-90 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 group-hover:contrast-100"
                />
                <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-sm flex flex-col items-center justify-center gap-12">
                   <div className="flex gap-6">
                    <MagneticButton>
                      <a href={project.github} className="w-16 h-16 bg-paper text-ink rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Github size={24} /></a>
                    </MagneticButton>
                    <MagneticButton>
                      <button className="w-16 h-16 bg-paper text-ink rounded-full flex items-center justify-center hover:scale-110 transition-transform"><ExternalLink size={24} /></button>
                    </MagneticButton>
                   </div>
                   <div className="font-mono text-[9px] uppercase tracking-[0.5em] text-paper opacity-60">View Details</div>
                </div>
              </div>
              <div className="flex justify-between items-start px-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-40 block mb-4 font-bold lowercase italic">{project.tech}</span>
                  <h3 className="text-4xl md:text-5xl font-serif italic tracking-tighter leading-none">{project.name}</h3>
                </div>
                <div className="mt-2 w-14 h-14 border border-ink/10 rounded-full flex items-center justify-center group-hover:bg-ink group-hover:text-paper transition-all group-hover:rotate-45 duration-700">
                  <ArrowUpRight size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-40 bg-paper relative overflow-hidden border-t border-line">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-24">
          <div className="lg:col-span-5">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-30 mb-10 flex items-center gap-4">
                <span className="w-4 h-px bg-ink/30" /> 05 // Contact
              </div>
              <h2 className="text-6xl md:text-8xl font-serif italic mb-16 leading-[0.9] tracking-tighter">Manifest a <br /><span className="opacity-30">Collaboration.</span></h2>
              
              <div className="flex flex-col gap-16">
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-20 mb-6 font-bold">Availability</h4>
                  <div className="flex items-center gap-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-ink animate-pulse" />
                    <span className="text-lg font-light italic opacity-80 underline underline-offset-8">Available for innovative paradigms</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                  <div className="group cursor-pointer">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-20 mb-4 font-bold group-hover:opacity-100 transition-opacity">Telephonic</h4>
                    <a href={`tel:${DATA.phone}`} className="text-xl md:text-2xl font-serif italic tracking-tight border-b border-transparent hover:border-ink transition-all">{DATA.phone}</a>
                  </div>
                  <div className="group cursor-pointer overflow-hidden">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-20 mb-4 font-bold group-hover:opacity-100 transition-opacity">Electronical</h4>
                    <a href={`mailto:${DATA.email}`} className="text-xl md:text-2xl font-serif italic tracking-tight border-b border-transparent hover:border-ink transition-all inline-block truncate max-w-full">{DATA.email}</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-7">
            <motion.form 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-16 p-10 md:p-20 border border-line rounded-[60px] bg-paper shadow-2xl skew-x-1"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid md:grid-cols-2 gap-16">
                <div className="flex flex-col gap-6 group">
                  <label className="text-[10px] uppercase tracking-[0.5em] opacity-30 group-focus-within:opacity-100 transition-opacity font-bold">Identification</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Alan Turing" 
                    className="bg-transparent border-b border-line pb-6 outline-none focus:border-ink transition-all text-xl font-light italic placeholder:opacity-20"
                  />
                </div>
                <div className="flex flex-col gap-6 group">
                  <label className="text-[10px] uppercase tracking-[0.5em] opacity-30 group-focus-within:opacity-100 transition-opacity font-bold">Communication Link</label>
                  <input 
                    type="email" 
                    placeholder="aturing@enigma.com" 
                    className="bg-transparent border-b border-line pb-6 outline-none focus:border-ink transition-all text-xl font-light italic placeholder:opacity-20"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6 group">
                <label className="text-[10px] uppercase tracking-[0.5em] opacity-30 group-focus-within:opacity-100 transition-opacity font-bold">Ideation Brief</label>
                <textarea 
                  rows={4} 
                  placeholder="Elucidate your perspective..." 
                  className="bg-transparent border-b border-line pb-6 outline-none focus:border-ink transition-all text-xl font-light italic placeholder:opacity-20 resize-none"
                />
              </div>
              <button 
                type="submit"
                className="group relative overflow-hidden bg-ink text-paper px-16 py-8 rounded-full font-serif text-3xl italic tracking-tighter"
              >
                <span className="relative z-10 transition-all group-hover:tracking-widest">Transmit Request</span>
                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
                <span className="absolute inset-0 z-20 flex items-center justify-center text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-700 italic font-bold">In-Progress...</span>
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-24 px-6 md:px-12 bg-white flex flex-col items-center">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-line pb-20 mb-20">
          <div className="max-w-md">
            <a href="#" className="font-serif text-6xl tracking-tighter mb-8 block grayscale hover:grayscale-0 transition-all">J.</a>
            <p className="text-xl font-light opacity-50 italic">Designing digital artifacts and cognitive systems in the heart of India.</p>
          </div>
          <div className="flex gap-20">
            <div className="flex flex-col gap-6">
              <h5 className="font-mono text-[9px] uppercase tracking-[0.5em] opacity-30 font-bold">Navigation</h5>
              <div className="flex flex-col gap-3 font-serif italic text-lg opacity-60">
                <a href="#about" className="hover:opacity-100 transition-opacity">About</a>
                <a href="#skills" className="hover:opacity-100 transition-opacity">Skills</a>
                <a href="#projects" className="hover:opacity-100 transition-opacity">Projects</a>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h5 className="font-mono text-[9px] uppercase tracking-[0.5em] opacity-30 font-bold">Connect</h5>
              <div className="flex flex-col gap-3 font-serif italic text-lg opacity-60">
                <a href={DATA.linkedin} target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">LinkedIn</a>
                <a href={DATA.github} target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">GitHub</a>
                <a href={`mailto:${DATA.email}`} className="hover:opacity-100 transition-opacity">Email</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 font-mono text-[9px] uppercase tracking-[0.4em] opacity-20 italic">
          <div>&copy; {new Date().getFullYear()} Joyal Joshua J. All Rights Reserved.</div>
          <div>Coded with Minimal Intention.</div>
        </div>
      </div>
    </footer>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-ink z-[100] origin-left"
      style={{ scaleX }}
    />
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[200] bg-paper flex items-center justify-center p-6"
        >
          <div className="relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 h-px bg-ink opacity-20"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-7xl sm:text-9xl font-serif italic tracking-tighter flex items-baseline gap-2"
            >
              Joyal <span className="text-3xl opacity-30 not-italic">Joshua</span>
              <motion.span 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="text-ink"
              >
                .
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen selection:bg-ink selection:text-paper"
        >
          <ScrollProgress />
          <Navbar />
          
          <main className="overflow-x-hidden">
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Contact />
          </main>
          
          <Footer />
          
          {/* Custom Cursor */}
          <CustomCursor />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="hidden lg:block fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
      animate={{ 
        x: mousePos.x - 16, 
        y: mousePos.y - 16,
        scale: isHovering ? 2.5 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.1 }}
    >
      <div className="w-full h-full rounded-full border border-white" />
      {isHovering && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-1 h-1 bg-white rounded-full" />
        </motion.div>
      )}
    </motion.div>
  );
};
