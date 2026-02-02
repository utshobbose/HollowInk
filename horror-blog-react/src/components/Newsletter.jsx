import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Newsletter subscription coming soon!');
    setEmail('');
  };

  return (
    <div className="bg-bg-surface border-t border-b border-border py-16 px-6 text-center mb-8">
      <h3 className="font-display font-normal text-white text-2xl mb-2">Enter the Dark</h3>
      <p className="text-text-secondary text-[0.9rem] mb-6">
        New stories arrive every week. Subscribe to receive them before anyone else.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-[440px] mx-auto flex-wrap justify-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 min-w-[220px] bg-bg-raised border border-border rounded-md px-4 py-2 text-text-primary font-body text-[0.9rem] outline-none transition-colors duration-300 focus:border-accent-gold/35 placeholder:text-text-muted"
        />
        <button
          type="submit"
          className="bg-accent-blood text-white border-none px-6 py-2 rounded-md font-heading text-[0.68rem] tracking-[0.18em] uppercase cursor-pointer transition-colors duration-300 hover:bg-[#b52d2d]"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
