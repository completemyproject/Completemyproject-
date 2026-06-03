export default function IntroVideo() {
  return (
    <section aria-labelledby="intro-video-heading" className="py-10 sm:py-16 bg-background">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-6">
          <h2
            id="intro-video-heading"
            className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
          >
            Sky News Reports
          </h2>
        </div>
        <div className="relative w-full overflow-hidden rounded-2xl shadow-brand border-4 border-accent" style={{ paddingTop: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/HDZ3nXNB604"
            title="Completemyproject.co.uk introduction"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}