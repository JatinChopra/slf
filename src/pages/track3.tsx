import React, { ReactNode, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import LayoutOne from "@/layouts/LayoutOne";
import { audioControllerSliceActions as acActions } from "@/store/AudioControllerSlice";
const Track = () => {
  let audiourl = useAppSelector((state) => state.audioController.src);
  let {
    current,
    duration,
    isPlaying,
    songIndex,
    src,
    data,
    image,
    songName,
    artistName,
  } = useAppSelector((state) => state.audioController);

  return (
    <div className="bg-black p-2 mb-20 pb-[40px] gap-2 flex overflow-y-scroll w-full scrollbar-custom scrollbar-hide h-full max-w-full box-border">
      <div className="w-full bgcyan-500 h-[80px] ">
        {audiourl && <SoundCloudPlayer audioUrl={audiourl} />}
      </div>
    </div>
  );
};
export default Track;

Track.getLayout = function getLayout(page: ReactNode) {
  return <LayoutOne>{page}</LayoutOne>;
};
const SoundCloudPlayer: React.FC<{ audioUrl: string }> = ({ audioUrl }) => {
  const dispatch = useAppDispatch();
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");

  // let {
  //   current,
  //   duration,
  //   isPlaying,
  //   songIndex,
  //   src,
  //   data,
  //   image,
  //   songName,
  //   artistName,
  // } = useAppSelector((state) => state.audioController);

  useEffect(() => {
    const audioElement = document.getElementById(
      "my-audio"
    ) as HTMLAudioElement;
    console.log("waveform called");

    if (!waveformRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Define the waveform gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    gradient.addColorStop(0, "#656666"); // Top color
    gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666"); // Top color
    gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, "#ffffff"); // White line
    gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, "#ffffff"); // White line
    gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, "#B1B1B1"); // Bottom color
    gradient.addColorStop(1, "#B1B1B1"); // Bottom color

    // define progress gradient
    const progressGradient = ctx.createLinearGradient(
      0,
      0,
      0,
      canvas.height * 1.35
    );
    progressGradient.addColorStop(0, "#800080"); // Top color (Dark Purple)
    progressGradient.addColorStop(
      (canvas.height * 0.7) / canvas.height,
      "#9932CC"
    ); // Top color (Medium Purple)
    progressGradient.addColorStop(
      (canvas.height * 0.7 + 1) / canvas.height,
      "#D8BFD8"
    ); // White line (Thistle)
    progressGradient.addColorStop(
      (canvas.height * 0.7 + 2) / canvas.height,
      "#D8BFD8"
    ); // White line (Thistle)
    progressGradient.addColorStop(
      (canvas.height * 0.7 + 3) / canvas.height,
      "#E6E6FA"
    ); // Bottom color (Lavender)
    progressGradient.addColorStop(1, "#E6E6FA"); // Bottom color (Lavender)

    // Create the waveform
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: gradient,
      progressColor: progressGradient,
      media: audioElement,
      barWidth: 3,
      barRadius: 50,
      url: audioUrl,
    });

    wavesurfer.current.on("decode", (duration) => {
      setDuration(formatDuration(duration));
      // dispatch(acActions.setDuration(duration));
    });

    wavesurfer.current.on("timeupdate", (currentTime) => {
      setCurrentTime(formatDuration(currentTime));
      // dispatch(acActions.setCurrent(current));
    });

    return () => wavesurfer.current?.destroy();
  }, [audioUrl]);
  const handlePointerMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const hover = document.querySelector("#hover") as HTMLDivElement;
    hover.style.width = `${e.nativeEvent.offsetX}px`;
  };

  const handlePlayPause = () => {
    wavesurfer.current?.playPause();
  };
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  return (
    <div
      id="waveform"
      ref={waveformRef}
      onClick={handlePlayPause}
      onMouseMove={handlePointerMove}
      style={{ cursor: "pointer", position: "relative" }}
    >
      <div id="time" style={timeStyle}>
        {duration}
        {/* {formatDuration(current)} */}
      </div>
      <div id="duration" style={durationStyle}>
        {/* {formatDuration(duration)} */}
      </div>
      <div id="hover" style={hoverStyle}></div>
    </div>
  );
};

// Inline styles
const hoverStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  zIndex: 10,
  pointerEvents: "none",
  height: "100%",
  width: 0,
  mixBlendMode: "overlay",
  background: "rgba(255, 255, 255, 0.5)",
  opacity: 0,
  transition: "opacity 0.2s ease",
};

const timeStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 11,
  top: "50%",
  marginTop: "-1px",
  transform: "translateY(-50%)",
  fontSize: "11px",
  background: "rgba(0, 0, 0, 0.75)",
  padding: "2px",
  color: "#ddd",
  left: 0,
};

const durationStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 11,
  top: "50%",
  marginTop: "-1px",
  transform: "translateY(-50%)",
  fontSize: "11px",
  background: "rgba(0, 0, 0, 0.75)",
  padding: "2px",
  color: "#ddd",
  right: 0,
};
