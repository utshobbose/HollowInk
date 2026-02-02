import React from 'react';

const Hero = () => {
  const scrollToFeatured = () => {
    document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-8 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% 105%, rgba(42,61,46,0.3) 0%, transparent 70%),
            radial-gradient(ellipse 50% 35% at 30% 60%, rgba(155,36,36,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 75% 40%, rgba(58,74,92,0.06) 0%, transparent 60%),
            linear-gradient(180deg, #08090b 0%, #0c0e12 50%, #08090b 100%)
          `,
        }}
      ></div>

      {/* Mist */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[35%] animate-mistPulse"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(58,74,92,0.07))',
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <p
          className="text-[0.72rem] tracking-[0.4em] uppercase text-text-muted mb-6"
          style={{ animation: 'fadeDown 0.8s ease both' }}
        >
          Welcome to the dark
        </p>
        <h1
          className="font-display font-normal text-white mb-1 text-shadow-glow"
          style={{
            fontSize: 'clamp(2.6rem, 7vw, 4.8rem)',
            lineHeight: '1.15',
            animation: 'fadeDown 1s ease 0.15s both',
          }}
        >
          HOLLOW<span className="text-accent-blood">INK</span>
        </h1>
        <p
          className="font-body italic text-[1.15rem] text-text-secondary mb-10"
          style={{ animation: 'fadeDown 1s ease 0.35s both' }}
        >
          Stories written in the language of fear
        </p>
        <div
          className="w-[50px] h-px mx-auto mb-8"
          style={{
            background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
            animation: 'fadeDown 1s ease 0.5s both',
          }}
        ></div>
        <button
          onClick={scrollToFeatured}
          className="inline-block px-8 py-3 border border-accent-gold/25 text-accent-gold font-heading text-[0.72rem] tracking-[0.22em] uppercase rounded-md transition-all duration-300 hover:bg-accent-gold hover:text-bg-base hover:border-accent-gold hover:shadow-[0_0_30px_rgba(201,168,76,0.2)]"
          style={{ animation: 'fadeDown 1s ease 0.65s both' }}
        >
          Read the Latest
        </button>
      </div>

      {/* Scroll Hint */}
      <div
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted text-[0.65rem] tracking-[0.2em] uppercase"
        style={{ animation: 'fadeDown 1.2s ease 1s both' }}
      >
        <span>Scroll</span>
        <div className="w-px h-7 bg-gradient-to-b from-accent-gold to-transparent animate-arrowPulse"></div>
      </div>
    </section>
  );
};

export default Hero;
