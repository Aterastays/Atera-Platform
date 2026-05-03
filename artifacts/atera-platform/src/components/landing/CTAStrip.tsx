interface CTAStripProps {
  onBookStay: () => void;
  onLandlord: () => void;
}

export function CTAStrip({ onBookStay, onLandlord }: CTAStripProps) {
  return (
    <section className="bg-gold py-24 px-6 text-center">
      <div className="max-w-3xl mx-auto reveal">
        <h2 className="font-display text-4xl md:text-5xl text-black mb-4">Ready to Get Started?</h2>
        <p className="font-body text-[rgba(0,0,0,0.6)] text-lg mb-10">Whether you're looking for premium accommodation or a reliable property partner.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onBookStay}
            className="bg-black text-gold px-8 py-4 font-body font-medium text-sm tracking-wider uppercase hover:-translate-y-1 transition-transform"
          >
            Book a Stay
          </button>
          <button 
            onClick={onLandlord}
            className="border border-black text-black px-8 py-4 font-body font-medium text-sm tracking-wider uppercase hover:bg-black/5 hover:-translate-y-1 transition-all"
          >
            I Have a Property
          </button>
        </div>
      </div>
    </section>
  );
}
