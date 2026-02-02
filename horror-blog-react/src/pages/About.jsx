import React from 'react';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="animate-pageIn min-h-screen pt-24 flex flex-col items-center justify-center">
      <div className="text-center pt-8 pb-10 px-4">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-accent-gold font-heading mb-3">
          The Writer
        </span>
        <h2 className="font-display font-normal text-white" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)' }}>
          About
        </h2>
        <div
          className="w-10 h-px mx-auto mt-5"
          style={{ background: 'linear-gradient(90deg, transparent, #9b2424, transparent)' }}
        ></div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 pb-24 text-center">
        {/* Avatar */}
        <div className="w-[100px] h-[100px] rounded-full border-2 border-border p-1 bg-bg-surface mx-auto mb-7">
          <div
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1a1020, #0d1515)' }}
          >
            <svg className="w-[38px] h-[38px] opacity-60" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.2">
              <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
              <path d="M4 22c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
        </div>

        <h3 className="font-display font-normal text-white text-2xl mb-2">Utshob Bose</h3>
        <span className="block text-accent-gold text-[0.7rem] tracking-[0.25em] uppercase font-heading mb-5">
          Horror Writer · Bengali
        </span>

        <p className="text-text-secondary text-[0.95rem] leading-[1.9] mb-4">
          I write horror stories rooted in the folklore, history, and forgotten corners of Bengal and South Asia.
          Every tale here is born from a real legend, a real place, or a real event — twisted just enough to keep you
          awake at night. I believe the scariest stories are the ones that feel like they could be true. The ones
          where you recognize the landscape. The ones where the darkness is familiar.
        </p>

        <p className="text-text-secondary text-[0.95rem] leading-[1.9]">
          HollowInk is my space to explore that darkness — one story at a time. If you enjoy atmospheric horror,
          folklore-driven narratives, and the quiet dread of things that lurk just beyond what we choose to see,
          you're in the right place.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default About;
