const Reviews = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Reviews</h1>
          <p className="text-sm text-gray-400">Customer feedback and review management coming soon.</p>
        </div>
      </div>

      <div className="bg-charcoal-900 border border-white/5 rounded-3xl p-8 space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-gray-300">
          <p className="text-lg font-semibold text-white">No reviews yet.</p>
          <p className="text-sm text-gray-400 mt-3">
            Review tracking is not yet enabled in the backend, but this page is ready for future customer ratings and comment moderation.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="glassmorphism p-6 rounded-3xl border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm uppercase tracking-widest text-amber-500">Sample Review</span>
                <span className="text-sm text-gray-400">No data</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                This space will display customer praise, suggestions, and product ratings once reviews are stored in the project database.
              </p>
              <div className="text-xs text-gray-500">Feature placeholder for future review moderation.</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
