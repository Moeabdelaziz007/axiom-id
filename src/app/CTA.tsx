export default function CTA() {
  return (
    <section className="w-full py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Build the Future of AI Trust.
        </h2>
        <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
          Get started by reading our documentation or join the conversation with our community of developers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
            View GitHub
          </button>
          <button className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
            Join Discord
          </button>
        </div>
      </div>
    </section>
  );
}