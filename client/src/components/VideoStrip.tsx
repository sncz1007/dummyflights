export default function VideoStrip() {
  return (
    <section className="w-full h-48 md:h-64 lg:h-80 overflow-hidden">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        data-testid="video-airplane-window"
      >
        <source
          src="https://videos.pexels.com/video-files/13879887/13879887-uhd_2560_1440_60fps.mp4"
          type="video/mp4"
        />
        Tu navegador no soporta videos HTML5.
      </video>
    </section>
  );
}
