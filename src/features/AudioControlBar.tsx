import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

import { MdSkipNext } from "react-icons/md";
import { MdSkipPrevious } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

import { MdRepeat } from "react-icons/md";
import { MdRepeatOne } from "react-icons/md";
import { MdShuffle } from "react-icons/md";

import { PiSpeakerHighFill } from "react-icons/pi";
import { FaHeart } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { audioControllerSliceActions as acActions } from "@/store/AudioControllerSlice";
import { Console } from "console";

const AudioControlBar = () => {
  const dispatch = useAppDispatch();
  const sliderRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
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

  if (!audioRef.current?.src && src && audioRef.current) {
    audioRef.current.src = src;
    audioRef.current.play();
  }

  if (audioRef.current?.src && src && src != audioRef.current.src) {
    audioRef.current.src = src;

    audioRef.current.play();
  }
  useEffect(() => {
    const audioPlayer = audioRef.current;

    const handleTimeUpdate = () => {
      if (audioPlayer && sliderRef.current) {
        // setCurrent(audioPlayer.currentTime);
        dispatch(acActions.setCurrent(audioPlayer.currentTime));
        // Set slider value if it's not already being interacted with
        (sliderRef.current as any).value = audioPlayer.currentTime;
        dispatch(acActions.setCurrent(audioPlayer.currentTime));
        // setCurrent(audioRef.current.currentTime);
      }
    };

    if (audioPlayer) {
      audioPlayer.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (audioPlayer) {
        audioPlayer.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [isPlaying]);

  function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    // Pad the seconds with a leading zero if necessary
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  }

  function toggleAudio(): void {
    if (isPlaying) {
      audioRef.current?.pause();
      // setIsPlaying(false);
      dispatch(acActions.setIsPlaying(false));
    } else {
      audioRef.current?.play();
      dispatch(acActions.setIsPlaying(true));
      // setIsPlaying(true);
    }
  }
  function startStreaming(songid: string, duration: number) {
    dispatch(acActions.setDuration(duration));
    dispatch(acActions.setSrc(`http://localhost:3001/play/${songid}`));
    dispatch(acActions.setIsPlaying(true));
  }

  function playNext() {
    let songidx = (songIndex + 1) % data.length;
    // setSongIndex(songidx);
    dispatch(acActions.setSongIndex(songidx));
    let songDuration = data[songidx].duration;
    startStreaming(data[songidx]._id, data[songidx].duration);
  }

  function playPrev() {
    let songidx = (songIndex - 1 + data.length) % data.length;
    dispatch(acActions.setSongIndex(songidx));
    let songDuration = data[songidx].duration;
    startStreaming(data[songidx]._id, data[songidx].duration);
  }

  return (
    <>
      <audio
        ref={audioRef}
        id="audioPlayer1"
        className="mb-[140px] hidden"
        controls
      ></audio>
      {src && (
        <div className="bg-gradient-to-t z-10 border-t-[1px] shadow-lg border-purple-500 border-opacity-50 bg-reen-500 backdrop-blur-lg bg-black bg-opacity-70 flex bg-transparent w-full h-[90px] fixed bottom-0 ">
          <div className="relative w-full overflowy-hidden">
            {/* behind */}
            <img
              src={image}
              className="w-[280px] h-full object-cover absolute inset-0 blur-xl  opacity-"
              style={{
                maskImage:
                  "linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))",
                WebkitMaskImage:
                  "linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))",
              }}
            />

            {/* overlay */}
            <div className="flex w-full absolute bg-ellow-500 h-full justify-stretch">
              {/* section 1 */}
              <div
                className="flex gap-4 items-center justify-start md:bg-lue-500 bg-ray-500 w-[70%] md:w-[14%] lg:w-[28%] h-full py-2 pl-5
          "
              >
                <img src={image} className="h-16 w-16 rounded-lg" />
                <div className="bg-pnk-500 h-[70%] my-5 lg:flex flex-col gap-1 text-white justify-center bg-ellow-500 flex bg-pnk-500 max-w-[65%] md:hidden lg:w-full overflow-x-hidden">
                  <p className="font-bold text-sm">{artistName}</p>
                  <p className="truncate font-bold max-w-[97%] bg-green500">
                    {songName}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full hover:bg-transparent"
                >
                  <FaHeart className="text-2xl text-white" />
                </Button>
              </div>

              {/* prev play pause for small screen */}
              <div className="flex flex-auto bg-geen-500  gap- items-center justify-evenly md:hidden ">
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={() => {
                    playPrev();
                  }}
                  className="rounded-full bg-transparent hover:bg-transparent"
                >
                  <MdSkipPrevious className="text-4xl ml-[1px] text-white " />
                </Button>
                <Button
                  onClick={() => {
                    toggleAudio();
                  }}
                  className="rounded-full py-7 px-2 0 hoverbg-green-500  border-white  bg-transparent hover:bg-transparent"
                >
                  {isPlaying ? (
                    <FaPause className="text-2xl ml-[1px] text-white " />
                  ) : (
                    <FaPlay className="text-2xl ml-[1px] text-white" />
                  )}
                </Button>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={() => {
                    playNext();
                  }}
                  className="rounded-full   bg-transparent hover:bg-transparent"
                >
                  <MdSkipNext className="text-4xl text-white " />
                </Button>
              </div>
              {/* section 2 */}
              {/* Slider for sm screen */}
              <Slider
                className="mx-0 px-0 md:hidden  absolute top-0 z-30"
                value={[current]}
                ref={sliderRef}
                max={duration}
                step={1}
                onMouseDown={() => {
                  audioRef.current?.pause();
                }}
                onClickCapture={() => {
                  if (audioRef.current) audioRef.current.play();
                }}
                onValueChange={(val) => {
                  // setCurrent(val[0]);
                  dispatch(acActions.setCurrent(val[0]));
                  if (audioRef.current?.currentTime)
                    audioRef.current.currentTime = val[0];
                  audioRef.current?.pause();
                }}
              />

              {/* Section 2 : md &  lg*/}
              <div className="text-white flex-auto hidden md:flex bg-ink-500 justify-center items-center md:px-2 lg:px-5 group ml-5">
                <p>{formatDuration(current)}</p>
                {/* Slider for medium and large screen */}
                <Slider
                  className="mx-3"
                  value={[current]}
                  ref={sliderRef}
                  max={duration}
                  step={1}
                  onMouseDown={() => {
                    audioRef.current?.pause();
                  }}
                  onClickCapture={() => {
                    if (audioRef.current) audioRef.current.play();
                  }}
                  onValueChange={(val) => {
                    // setCurrent(val[0]);
                    dispatch(acActions.setCurrent(val[0]));
                    if (audioRef.current?.currentTime)
                      audioRef.current.currentTime = val[0];
                    audioRef.current?.pause();
                  }}
                  color="#00FF00"
                />
                <p>{formatDuration(duration)}</p>
                <div className="ml-5 bg-lue-500 gap-4 w-2/5 flex justify-center h-full items-center">
                  {/* prev Play pause  for medium and large screen*/}
                  <div className="flex gap-4 items-center ">
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={() => {
                        playPrev();
                      }}
                      className="rounded-full bg-transparent hover:bg-transparent"
                    >
                      <MdSkipPrevious className="text-4xl ml-[1px] text-white " />
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => {
                        toggleAudio();
                      }}
                      className="rounded-full py-7 px-2   border-white  bg-transparent hover:bg-transparent"
                    >
                      {isPlaying ? (
                        <FaPause className="text-2xl ml-[1px] text-white" />
                      ) : (
                        <FaPlay className="text-2xl ml-[1px] text-white " />
                      )}
                    </Button>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={() => {
                        playNext();
                      }}
                      className="rounded-full   bg-transparent hover:bg-transparent"
                    >
                      <MdSkipNext className="text-4xl text-white " />
                    </Button>
                  </div>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    className="rounded-full   bg-transparent hover:bg-transparent"
                  >
                    <MdRepeat className="text-3xl text-white" />
                    {false && <MdRepeatOne className="text-3xl text-white" />}
                  </Button>{" "}
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    className="rounded-full   bg-transparent hover:bg-transparent"
                  >
                    <MdShuffle className="text-3xl text-white " />
                  </Button>
                </div>
              </div>
              {/* section 3 */}
              <div className="lg:flex bg-yan-500 items-center justify-center lg:min-w-[5%] mr-5 hidden">
                <PiSpeakerHighFill className="text-2xl text-white" />
                {/* <Slider
                className="mx-5 lg:max-w-[45%] "
                defaultValue={[33]}
                max={100}
                step={1}
                color="#00FF00"
              />               <p className="text-white text-sm font-bold">50%</p>
            */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AudioControlBar;
