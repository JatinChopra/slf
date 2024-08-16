import React, { ReactNode, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import LayoutOne from "@/layouts/LayoutOne";
import { audioControllerSliceActions as acActions } from "@/store/AudioControllerSlice";
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { commentSliceActions } from "@/store/CommentsSlice";
import { fetchComments } from "@/store/CommentsSlice";
import { submitComment } from "@/store/CommentsSlice";
import { Comment } from "@/store/CommentsSlice";
import { useRouter } from "next/router";
const Player = () => {
  let audiourl = useAppSelector((state) => state.audioController.src);
  let dispatch = useAppDispatch();
  let [commentTime, setCommentTime] = useState<number>();
  let [commentText, setCommentText] = useState<string>();

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
    id,
  } = useAppSelector((state) => state.audioController);
  const { data: session } = useSession();
  const router = useRouter();

  const audioEl = useRef<HTMLAudioElement | null>(null);
  const commentsData = useAppSelector((state) => state.comment.comments);
  let filteredComments = commentsData.filter((item, idx) => {
    return item.songId == id;
  });

  useEffect(() => {
    if (!src) router.push("/");
  }, []);
  // console.log(id);
  useEffect(() => {
    if (typeof window !== undefined) {
      let audioElem = document.getElementById(
        "audioPlayer1"
      ) as HTMLAudioElement;
      audioEl.current = audioElem;
    }
    console.log("calling the thunk");
    if (id) {
      dispatch(fetchComments(id));
    }
  }, [dispatch, id]);

  function calculatePercentage(timestamp: number): number {
    return Math.floor((timestamp / duration) * 100);
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  return (
    <div className="mt-[-10px] p-2 mb-20 pb-[40px] gap-2 flex overflow-y-scroll bggreen-500  p-3 w-full scrollbar-custom scrollbar-hide h-full max-w-full box-border">
      <div className="relative w-full overflow-y-hidden bgpurple-500 p scrollbar-custom scrollbar-hide flex  justify-center">
        {/* behind */}
        <img
          src={image}
          className=" h-[365px]  object-cover absolute  blurl   overflow-hidden w-[95%] mx-auto  opacity-80"
        />

        <div className="wfull p-2  bgwhite  bg-opacity50 backdrop-blur-xl z-30 h-[365px] absolute flex justify-center w-full md:w-full lg:w-[95%]">
          <div className="bgpink-500 p-1 h-full w-3/4 flex-col hidden lg:flex">
            <div className="bgpurple-500 flex-auto flex h-[70%]  lg:px-5 items-center justify-center">
              <div className="h-full min-w-[120px]   ">
                {isPlaying ? (
                  <FaPause
                    className="text-white text-2xl ml-auto mr-5 mt-10 cursor-pointer"
                    onClick={() => {
                      audioEl && audioEl.current?.pause();
                      dispatch(acActions.setIsPlaying(false));
                    }}
                  />
                ) : (
                  <FaPlay
                    className="text-white text-2xl ml-auto mr-5 mt-10 cursor-pointer"
                    onClick={() => {
                      audioEl && audioEl.current?.play();
                      dispatch(acActions.setIsPlaying(true));
                    }}
                  />
                )}
              </div>
              <div className="flex-auto bggray-500 py-5 px-4 gap-2 h-full">
                <div className="text-2xl text-white flex-auto">
                  <p className="bg-black  py-1 px-2 inline-block ">
                    {songName}
                  </p>
                </div>
                <div className="text-lg text-white mt-2">
                  <p className="bg-black inline-block py-1 px-2">
                    {artistName}
                  </p>
                </div>
              </div>
            </div>
            <div className="bgcyan-500 content-end px-7 relative ">
              {audiourl && <SoundCloudPlayer audioUrl={audiourl} />}
              <div className="absolute inset-[43%] z-20  bg-black left-0 text-center w-8 content-center h-5">
                <p className="text-white font-bold text-[10px]">
                  {formatDuration(current)}
                </p>
              </div>
              <div className="absolute top-[43%]  z-20  bg-black right-0 text-center w-8 content-center h-5">
                <p className="text-white font-bold text-[10px]">
                  {formatDuration(duration)}
                </p>
              </div>
              <div className="bg-ye-500 pb-2 bottom-0 left-0 w-full h-10 absolute">
                <div className="bggreen-500 h-full  mx-7 relative">
                  {filteredComments.map((item, idx) => {
                    let leftMarginPercent = calculatePercentage(item.timestamp); // Define inline styles
                    let cssStyle: React.CSSProperties = {
                      backgroundColor: "rgba(255, 165, 0, 0.5)", // Equivalent to 'bg-orange-500 opacity-50'
                      height: "1.25rem", // Equivalent to 'h-5'
                      width: "1.25rem", // Equivalent to 'w-5'
                      position: "absolute",
                      left: `${leftMarginPercent}%`, // Dynamic left margin
                    };

                    let currentCommentCondition =
                      current >= item.timestamp &&
                      current <= item.timestamp + 1;

                    return (
                      <div style={cssStyle} key={idx}>
                        <img src={item.img} />

                        <div
                          className={`duration-150 text-white w-[400px] flex gap-2 origin-left ${
                            currentCommentCondition
                              ? "scale-x-100"
                              : "scale-x-0"
                          }`}
                        >
                          <p className="">{item.username}</p>
                          <p className="font-bold poppins-regular-italic truncate">
                            {item.text}
                          </p>
                        </div>

                        {/* <CommentText
                        username={item.username}
                        text={item.text}
                        condition={current == item.timestamp}
                      />*/}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="bggreen-500 aspect-square flex-shrink-0 p-5 lg:h-full lg:min-w-[320px]">
            <img src={image} className="w-full h-full" />
          </div>
        </div>
        <div className="wfull p-2 mt-[380px] bg-whte bggreen-500   z-30  w-full md:w-full lg:w-[95%] lg:px-12">
          <div className="w-full flex">
            {session && (
              <div className="flex bgpink-500 w-full ">
                <img
                  src={session?.user?.image || "/dummy_dp.png"}
                  className="h-10 w-10"
                />
                {commentTime && (
                  <div className="bg-white px-1 flex items-center">
                    <p className="w-12 text-center text-sm font-bold text-white bg-black rounded-md px-1 my-auto max-h-5">
                      {formatDuration(commentTime)}
                    </p>
                  </div>
                )}
                <Input
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                  }}
                  className="   h-10  sm:w-[420px] lg:w-[520px] rounded-none"
                  placeholder="Comment"
                  onFocus={() => {
                    console.log("got focus");
                    console.log(current);
                    setCommentTime(current - 0.4);
                  }}
                />
                <Button
                  variant="secondary"
                  className="ml-5"
                  onClick={async () => {
                    // create a new object
                    // add it to the state
                    if (session) {
                      let commentObj: Comment = {
                        userId: session?.user?.email as string,
                        text: commentText as string,
                        img: session?.user?.image as string,
                        username: session?.user?.name as string,
                        songId: id,
                        timestamp: commentTime as number,
                      };

                      // reset the commentTime
                      setCommentTime(undefined);
                      setCommentText("");
                      console.log("new comment object prepared. ");
                      console.log(commentObj);
                      dispatch(commentSliceActions.addComment(commentObj));
                      await dispatch(submitComment(commentObj));
                    } else {
                      alert("Please sign in first.");
                    }
                  }}
                >
                  Comment
                </Button>
              </div>
            )}
          </div>
          <div className="bgorange-500 text-white poppins-semibold lg:w-[50%]">
            <div className="border-b-2 content-center  mt-5 h-10">
              <p className="text-xl">Comments</p>
              {
                <div className="bgyellow-500 over">
                  {filteredComments.map((item, idx) => {
                    return (
                      <div
                        key={item.id + "comment" + idx}
                        className="bggray-500 gap-4 w-full min-h-16 flex mt-4 items-center p-2"
                      >
                        <div className="w-14 h-14 rounded-full ">
                          <img
                            src={item.img}
                            className="bg-cover rounded-full"
                          />
                        </div>
                        <div className="bgcyan-500 w-full h-full">
                          <p>
                            {item.username} @ {formatDuration(item.timestamp)}
                          </p>
                          <p>{item.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;

const CommentText = ({
  username,
  text,
  condition,
}: {
  username: string;
  text: string;
  condition: boolean;
}) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (condition) {
      setShowText(true); // Show text when conditionY becomes true

      // Hide the text after 2 seconds
      timer = setTimeout(() => {
        setShowText(false);
      }, 2000);
    }

    // Clean up the timer when the component unmounts or conditionY changes
    return () => clearTimeout(timer);
  }, [condition]);

  return (
    <>
      {showText && (
        <p>
          {username}
          {text}
        </p>
      )}
    </>
  );
};

Player.getLayout = function getLayout(page: ReactNode) {
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
      barWidth: 3,
      barRadius: 50,
      height: waveformRef.current.clientHeight,
      //
      barHeight: 2,
      normalize: true,
      minPxPerSec: 1,
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
      const audioElement = document?.getElementById(
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
        className=" h-[70px] my-10"
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
