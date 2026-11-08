import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const SubmissionGuidelines = () => {
  return (
    <div className="min-h-screen pt-28 bg-bg-base text-text-primary animate-pageIn">
      <div className="max-w-[800px] mx-auto px-6 pb-24">
        {/* Header */}
        <div className="text-center pb-12 border-b border-border mb-12">
          <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-accent-gold font-heading mb-3">
            Scribe Codex
          </span>
          <h1 className="font-display font-normal text-white text-3xl md:text-5xl mb-4 text-shadow-glow">
            Submission Guidelines
          </h1>
          <p className="font-body italic text-text-secondary text-base">
            How to craft and submit tales for inclusion in the Hollow Ink archives.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-[1.05rem] font-body text-text-secondary leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-white mb-3 flex items-center gap-2">
              <span className="text-accent-gold font-heading text-sm">I.</span> What We Seek
            </h2>
            <p className="mb-4">
              Hollow Ink publishes literary horror, regional folklore, supernatural legends, and gothic literature rooted in South Asian geographies, mythologies, and forgotten histories.
            </p>
            <p>
              We look for quiet dread over gratuitous gore, atmosphere that drips like river water, and narratives where the supernatural feels as authentic as the earth from which it crawls.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3 flex items-center gap-2">
              <span className="text-accent-gold font-heading text-sm">II.</span> Manuscript Standards
            </h2>
            <ul className="space-y-3 list-disc pl-6 text-sm font-light text-text-primary">
              <li><strong>Length:</strong> 1,200 to 4,500 words. Richly detailed short stories and novelettes.</li>
              <li><strong>Regional Grounding:</strong> Anchor your tale in an identifiable landscape — whether the Sundarbans mangroves, North Kolkata alleys, Malabar courtyards, or Varanasi ghats.</li>
              <li><strong>Formatting:</strong> Readable typography with section separators (· · ·) where mood shifts occur.</li>
              <li><strong>Content Warnings:</strong> Mandatory disclosure for intense psychological horror or visceral imagery.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3 flex items-center gap-2">
              <span className="text-accent-gold font-heading text-sm">III.</span> The Moderation Cycle
            </h2>
            <p className="mb-4">
              All submitted manuscripts are held in the <em>Sanctum Sanctorum</em> moderation queue. Our archivist council reviews each piece for atmospheric integrity, historical nuance, and literary craft.
            </p>
            <div className="p-4 bg-bg-surface border border-border rounded-md text-xs font-heading uppercase tracking-wider text-text-muted space-y-2">
              <p>• <strong>Draft:</strong> Your private workspace. Only you can view and edit.</p>
              <p>• <strong>Submitted:</strong> Locked for administrative evaluation.</p>
              <p>• <strong>Published:</strong> Sealed into the permanent public archive.</p>
              <p>• <strong>Revision Needed:</strong> Returned to you with moderator notes.</p>
            </div>
          </section>

          <div className="pt-8 border-t border-border text-center">
            <Link
              to="/writer"
              className="inline-block px-8 py-3.5 bg-accent-gold hover:bg-[#d6b75c] text-bg-base font-heading text-xs uppercase tracking-widest font-semibold rounded shadow-lg transition-colors"
            >
              Enter the Writer Workshop →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubmissionGuidelines;

