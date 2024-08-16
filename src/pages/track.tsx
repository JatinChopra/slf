import React, { ReactNode, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import LayoutOne from "@/layouts/LayoutOne";
import { audioControllerSliceActions as acActions } from "@/store/AudioControllerSlice";
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { commentSliceActions } from "@/store/CommentsSlice";
import { submitComment } from "@/store/CommentsSlice";
import { Comment } from "@/store/CommentsSlice";
const Track = () => {
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

  const commentsData = useAppSelector((state) => state.comment.comments);
  let filteredComments = commentsData.filter((item, idx) => {
    return item.songId == id;
  });

  function calculatePercentage(timestamp: number): number {
    return Math.floor((timestamp / duration) * 100);
  }
  return (
    <div className="mt-[-10px] p-2 mb-20 pb-[40px] gap-2 flex overflow-y-scroll bggreen-500  p-3 w-full scrollbar-custom scrollbar-hide h-full max-w-full box-border">
      <div className="relative w-full overflow-y-hidden bgpurple-500 p scrollbar-custom scrollbar-hide flex  justify-center">
        {/* behind */}
        <img
          src={image}
          className=" h-[40%] object-cover absolute rounded-b-lg blur-3xl w-[40%] mt-[400px] mx-auto  opacity-70"
        />

        <div className="wfull p-2  bg-white  bg-opacity50 backdropblur-xl z-30 h-[365px] absolute flex justify-center w-full md:w-full lg:w-[95%]">
          <div className="bg-pink-500 p-1 h-full w-3/4 flex-col hidden lg:flex">
            <div className="bg-purple-500 flex-auto flex h-[70%]  lg:px-5 items-center justify-center">
              <div className="h-full min-w-[120px] bg-black  ">Button</div>
              <div className="flex-auto bg-gray-500 py-5 px-4 gap-2 h-full">
                <div className="text-2xl text-white flex-auto">
                  <p className="bg-black  py-1 px-2  ">{songName}</p>
                </div>
                <div className="text-lg text-white mt-2">
                  <p className="bg-black inline-block py-1 px-2">
                    {artistName}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-cyan-500 content-end px-7 relative">
              {audiourl && <SoundCloudPlayer audioUrl={audiourl} />}
              <div className="bg-yellow-500 py-1 bottom-0 left-0 w-full h-10 absolute">
                <div className="bg-green-500 h-full  mx-7 relative">
                  {filteredComments.map((item, idx) => {
                    let leftMarginPercent = calculatePercentage(item.timestamp); // Define inline styles
                    let cssStyle: React.CSSProperties = {
                      backgroundColor: "rgba(255, 165, 0, 0.5)", // Equivalent to 'bg-orange-500 opacity-50'
                      height: "1.25rem", // Equivalent to 'h-5'
                      width: "1.25rem", // Equivalent to 'w-5'
                      position: "absolute",
                      left: `${leftMarginPercent}%`, // Dynamic left margin
                    };

                    return (
                      <div style={cssStyle} key={idx}>
                        <img src={item.img} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-500 aspect-square flex-shrink-0 lg:h-full lg:min-w-[320px]">
            <img src={image} />
          </div>

          {/* <div className=" bg-pink-500  flex-auto flex flex-col justify-between mt-5 ">
            <div className="bg-blue-500 pt-5 px-10 w-[95%] flex-auto flex mx-auto gap-10">
              <Button
                variant="outline"
                className="bg--500 hover:bg-transparent  h-[90px] w-[90px] rounded-full border-2 hover:text-black duration-400"
              >
                <FaPlay className="text-5xl mr-[-8px] text-white " />
              </Button>
              <div className="bg-green-500 w-[50%] flex-auto flex-col">
                <p className="bg-black w-[90%] text-3xl text-white px-4 truncate inline-block py-1">
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

          <img src={image} className="m-5" /> */}
        </div>
        <div className="wfull p-2 mt-[380px] bg-whte  bg-opacity50 backdropblur-xl z-30 absolute flex  w-full md:w-full lg:w-[95%] lg:px-12">
          <div className="flex bgpink-500 w-full ">
            <img src={session?.user?.image || "#"} className="h-10 w-10" />
            <Input
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
              }}
              className="   h-10  sm:w-[420px] lg:w-[520px] rounded-none"
              placeholder="Comment"
              onFocus={() => {
                console.log(current);
                setCommentTime(current);
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
                  console.log("new comment object prepared. ");
                  console.log(commentObj);
                  // dispatch(commentSliceActions.addComment(commentObj));
                  await dispatch(submitComment(commentObj));
                } else {
                  alert("Please sign in first.");
                }
              }}
            >
              Comment
            </Button>
          </div>
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
