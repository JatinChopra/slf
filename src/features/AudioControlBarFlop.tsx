import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { IoPlaySharp, IoPauseSharp } from "react-icons/io5";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";

interface AudioControlBarProps {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
}

const AudioControlBar: React.FC<AudioControlBarProps> = ({
  duration,
  currentTime,
  isPlaying,
  onPlay,
  onPause,
  onSeek,
}) => {
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gradient-to-t z-20 border-t-[1px] shadow-lg border-white border-opacity-50 backdrop-blur-lg bg-black bg-opacity-70 flex bg-transparent w-full h-[90px] fixed bottom-0">
      <div className="flex flex-auto items-center justify-evenly">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="rounded-full bg-transparent hover:bg-transparent"
        >
          <MdSkipPrevious className="text-4xl ml-[1px] text-white" />
        </Button>
        <Button
          variant={"ghost"}
          className="rounded-full py-7 px-2 border-white bg-transparent hover:bg-transparent"
          onClick={isPlaying ? onPause : onPlay}
        >
          {isPlaying ? (
            <IoPauseSharp className="text-4xl ml-[1px] text-purple-500" />
          ) : (
            <IoPlaySharp className="text-4xl ml-[1px] text-purple-500" />
          )}
        </Button>
        <Button
          size={"icon"}
          variant={"ghost"}
          className="rounded-full bg-transparent hover:bg-transparent"
        >
          <MdSkipNext className="text-4xl text-white" />
        </Button>
      </div>

      <div className="text-white flex-auto flex justify-center items-center px-5 group">
        <p>{formatTime(currentTime)}</p>
        <Slider
          className="mx-3"
          value={[currentTime]}
          max={duration}
          step={0.1}
          onValueChange={([value]) => onSeek(value)}
        />
        <p>{formatTime(duration)}</p>
      </div>
    </div>
  );
};

export default AudioControlBar;
