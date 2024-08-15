import React, { ReactNode, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import LayoutOne from "@/layouts/LayoutOne";
import { audioControllerSliceActions as acActions } from "@/store/AudioControllerSlice";
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";

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
    <div className="mt-[-10px] p-2 mb-20 pb-[40px] gap-2 flex overflow-y-scroll w-full scrollbar-custom scrollbar-hide h-full max-w-full box-border">
      <div className="relative w-full overflow-y-hidden">
        {/* behind */}
        <img
          src={image}
          className=" h-[40%] object-cover absolute rounded-b-lg blur-3xl w-full right-0  opacity-100"
        />
        <div className="w-full  bg-black bg-opacity-50 backdrop-blur-xl z-30 h-[50%] absolute flex">
          <div className=" bg-pink500 w-8/12 flex-auto flex flex-col justify-between mt-5 ">
            <div className="bg-lue-500 pt-5 px-10 w-[95%] flex-auto flex mx-auto gap-10">
              <Button
                variant="outline"
                className="bg--500 hover:bg-transparent  h-[90px] w-[90px] rounded-full border-2 hover:text-black duration-400"
              >
                <FaPlay className="text-5xl mr-[-8px] text-white " />
              </Button>
              <div className="bg-ink-500 flex-auto flex-col">
                <p className="bg-black text-3xl text-white px-4 truncate inline-block py-1">
                  {songName}
                </p>
                <br />
                <p className="bg-black text-2xl text-white px-4 truncate inline-block py-1">
                  {artistName}
                </p>
              </div>
            </div>
            <div className="bgyellow-500 w-[90%] mx-auto ">
              {audiourl && <SoundCloudPlayer audioUrl={audiourl} />}
            </div>
          </div>

          <img src={image} className="m-10" />
        </div>
      </div>
    </div>
  );
};

export default Track;

Track.getLayout = function getLayout(page: ReactNode) {
  return <LayoutOne>{page}</LayoutOne>;
};

interface SoundCloudPlayerProps {
  audioUrl: string;
}

const SoundCloudPlayer: React.FC<SoundCloudPlayerProps> = ({ audioUrl }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
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
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!waveformRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Define the waveform gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    gradient.addColorStop(0, "#656666");
    gradient.addColorStop(1, "#B1B1B1");

    // Create the waveform
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: gradient,
      progressColor: "#ffffff",
      barWidth: 6,
      barRadius: 50,
      height: waveformRef.current.clientHeight,
    });

    // Function to handle click event and log the time
    const handleWaveformClick = (event: MouseEvent) => {
      if (!wavesurfer.current) return;

      const boundingRect = waveformRef.current!.getBoundingClientRect();
      const clickX = event.clientX - boundingRect.left;
      const progress = clickX / waveformRef.current!.offsetWidth;
      const time = wavesurfer.current.getDuration() * progress;

      console.log("Clicked Time:", time);
      audioElement?.pause();
      audioElement?.pause();
      console.log("Called by track");
      if (audioElement?.currentTime) audioElement.currentTime = time;
      dispatch(acActions.setCurrent(time));
      dispatch(acActions.setIsPlaying(true));
      audioElement?.play();
      // audioElement?.play();
    };

    waveformRef.current.addEventListener("click", handleWaveformClick);

    wavesurfer.current.load(audioUrl);

    // sync with the audio element
    const syncWaveform = () => {
      const audioElement = document.getElementById(
        "audioPlayer1"
      ) as HTMLAudioElement | null;
      if (audioElement && wavesurfer.current) {
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration;
        const progress = currentTime / duration;
        wavesurfer.current.seekTo(progress);
      }
    };

    // event listeners to update waveform progress
    const audioElement = document.getElementById(
      "audioPlayer1"
    ) as HTMLAudioElement | null;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", syncWaveform);
    }

    // Cleanup
    return () => {
      if (wavesurfer.current) {
        try {
          wavesurfer.current.destroy();
        } catch (error) {
          console.error("Error destroying WaveSurfer instance:", error);
        } finally {
          wavesurfer.current = null; // Ensure it's cleared
        }
      }

      if (audioElement) {
        audioElement.removeEventListener("timeupdate", syncWaveform);
      }
      if (waveformRef.current) {
        waveformRef.current.removeEventListener("click", handleWaveformClick);
      }
    };
  }, [audioUrl]);

  return (
    <div>
      <div
        id="waveform"
        ref={waveformRef}
        style={{ cursor: "pointer" }}
        className=" h-[120px] my-10"
      />
    </div>
  );
};

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
