"use client";

import React, { useRef, useState } from "react";
import { useUtilityContext } from "../../Context/Utility";

export default function CH5_page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { mousePosition, screenSize } = useUtilityContext();
  const vidSrc = "/vid/WUMBA ANIMATION_MIN.mp4";
  const togglePlayback = async () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      await videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    try {
      // jump forward a tiny amount so the video loads at 0.1s
      if (videoRef.current.currentTime < 0.1) {
        videoRef.current.currentTime = 0.1;
      }
    } catch (e) {
      // some browsers may throw if seeking isn't allowed yet — ignore
    }
  };

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setTimeout(() => {
  //       if (videoRef.current) {
  //         videoRef.current.currentTime = 1;
  //       }
  //     }, 1000);
  //   }, 1000);
  // }, []);

  const pointerX = `${(mousePosition.x / Math.max(screenSize.width, 1)) * 100}%`;
  const pointerY = `${(mousePosition.y / Math.max(screenSize.height, 1)) * 100}%`;

  return (
    <div className="flex min-h-screen items-center justify-center p-6 text-white bg-white">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
        <div
          className="relative aspect-video bg-black"
          style={{
            backgroundImage: `radial-gradient(circle at ${pointerX} ${pointerY}, rgba(255,255,255,0.16), transparent 30%)`,
          }}
        >
          <video
            ref={videoRef}
            src={vidSrc}
            className="h-full w-full object-cover"
            preload="metadata"
            poster="/img/thumbnail.png"
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          <button
            type="button"
            onClick={togglePlayback}
            className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-black/60 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-black/80"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}
