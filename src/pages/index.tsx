import React, { ReactNode, useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { GoDotFill } from "react-icons/go";
import { Button } from "@/components/ui/button";
import LayoutOne from "@/layouts/LayoutOne";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { audioControllerSliceActions as acActions } from "@/store/AudioControllerSlice";

import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import { metaDataSchema } from "@/store/SongDataSlice";
import { IoMdCalendar, IoMdHeart, IoMdPeople, IoMdPlay } from "react-icons/io";
import { PiWaveformBold } from "react-icons/pi";
import Link from "next/link";

const Home = ({ data }: { data: metaDataSchema[] | [] }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [handleVisible, setHandleVisible] = useState(false);

  let { current, duration, isPlaying, songIndex } = useAppSelector(
    (state) => state.audioController
  );

  const sliderRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  dispatch(acActions.setData(data));
  const toast = useToast();

  function startStreaming(songid: string, duration: number) {
    console.log(songid);
    dispatch(acActions.setDuration(duration));
    dispatch(acActions.setSrc(`${process.env.NEXT_PUBLIC_API}/play/${songid}`));

    dispatch(acActions.setIsPlaying(true));
  }

  const circleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const circle = circleRef.current;
      if (circle) {
        // Get the circle's dimensions
        const { offsetWidth: width, offsetHeight: height } = circle;

        // Adjust position to center the circle at the mouse cursor
        const x = event.clientX - width / 2;
        const y = event.clientY - height / 2;

        // Update circle position
        circle.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    // Add event listener
    document.addEventListener("mousemove", handleMouseMove);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <>
      {/* <div
        ref={circleRef}
        id="circle"
        className="fixed w-16 h-16 pointer-events-none z-50 transform  mix-blenddifference
        mt-[-121px] ml-[-95px] backdrop-contrast- backdrop-grayscale mix-blend-overlay
        "
      >
        <div className="absolute inset-0 rounded-full bg-black filter grayscale "></div>
      </div> */}
      {/* <div
        ref={circleRef}
        id="circle"
        className="fixed w-16 h-16 pointer-events-none z-50 transform
    mt-[-121px] ml-[-95px] mix-blend-color-dodge shadow-2xl backdrop-filter
     backdrop-brightness-150  backdrop-saturate-200"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-purple-500 via-pink-500 to-red-500 animate-pulse"></div>
      </div> */}

      <audio
        ref={audioRef}
        id="audioPlayer"
        className="mt-20 hidden "
        controls
      ></audio>

      {/* left section */}
      {/* right bar */}
      <div className="bgorange-500 p-2 mb-20 pb-[40px] gap-2 flex overflow-y-scroll scrollbar-custom scrollbar-hide h-full max-w-full box-border">
        <div className="flex-grow overflow-x-hidden bgpurple-500 scrollbar-hide mb-[195px]">
          {/* Section 1 */}
          <Banners />
          <p className="bggreen-500  text-white font-bold text-2xl mt-7">
            Recommendations for you
          </p>
          <HorizontalSongsScroller data={data} />
        </div>
        {/* Sidebar for home screen */}
        <RightBar />
      </div>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactNode) {
  return <LayoutOne>{page}</LayoutOne>;
};

export const getServerSideProps = async () => {
  // Fetch data from external API
  let response = await axios.get(`${process.env.NEXT_PUBLIC_API}/getmetaData`);
  if (response.status == 200) {
    let arrayData: metaDataSchema[] = response.data as metaDataSchema[];
    return { props: { data: arrayData } };
  } else {
    alert("Error fetching data from the db");
  }
  return { props: { data: [] } };
};

const RightBar = () => {
  return (
    <div className="scrollbar-custom scrollbar-hide overflow-y-scroll bgcyan-500  px-2 mb-[195px] flex flex-col items-center flex-no-wrap  flex-shrink-0  duration-500  lg:w-[440px] w-0  mt-[2px]  scale-x-0 lg:scale-100 border-l-2 bgcyan-500 ml-5">
      <div className="w-full h-[400px] flex flex-col bggreen-500  py-2">
        <SideBarCard type="artists" />
      </div>
      <div className="w-full h-[400px] mt-7 flex flex-col bggreen-500  py-2">
        <SideBarCard type="history" />
      </div>
    </div>
  );
};

const SideBarCard = ({ type }: { type: "artists" | "history" }) => {
  return (
    <>
      {/* heading */}
      <div className="bgyellow-500 border-bottom-[1px] mb-2 h-[40px] content-end px-2 py-1 text-lg text-white">
        {type == "artists" ? (
          <div className="border-b-[1px] pb-2 flex justify-between  border-gray-400">
            {" "}
            <div className="flex gap-2">
              <IoMdPeople className="text-2xl" />
              <p className="">Artists you should follow</p>
            </div>
          </div>
        ) : (
          <div className="border-b-[1px] pb-2 flex justify-between  border-gray-400">
            {" "}
            <div className="flex gap-2">
              <IoMdCalendar className="text-2xl" />
              <p className="">Your listening history</p>
            </div>
          </div>
        )}
      </div>

      {/* 3 item list */}
      <div className="flex flex-col gap-3 h-full b-blue-500 ">
        {new Array(4).fill(0).map((_, index) => {
          return (
            <>
              {type == "artists" ? (
                <ArtistSideBarCardItem index={index} />
              ) : (
                <HistorySideBarCardItem index={index} />
              )}
            </>
          );
        })}
      </div>
    </>
  );
};

const HistorySideBarCardItem = ({ index }: { index: number }) => {
  return (
    <div
      key={index}
      className="bg-range-500 gap-2 px-2 items-center flex-grow py-2 flex"
    >
      <img
        src="https://picsum.photos/200"
        className="b-pink-500 w-[70px] h-[70px] bg-cover "
      />
      <div className="bg-ellow-500 w-3/4">
        <div className="w-full truncate font-semibold text-gray-300 ">
          Artist Singer
        </div>
        <div className="w-full truncate text-lg text-white">
          Song Name Goes Here What do you say
        </div>
        <div className="flex text-gray-400 gap-2">
          <Link href={"#"} className="flex items-center gap-1">
            <IoMdPlay /> 4,123
          </Link>
          <Link href={"#"} className="flex items-center gap-1">
            <IoMdHeart /> 81
          </Link>
        </div>
      </div>
    </div>
  );
};

const ArtistSideBarCardItem = ({ index }: { index: number }) => {
  return (
    <div
      key={index}
      className="bgorange-500 gap-2 px-2 items-center flex-grow py-2 flex"
    >
      <img
        src="https://picsum.photos/200"
        className="b-pink-500 w-[60px] h-[60px] bg-cover rounded-full"
      />
      <div className="bgyellow-500 w-2/4 text-white">
        <div className="w-[88%] truncate text-lg ">
          Artist Name Goes Here What do you say
        </div>
        <div className="flex text-gray-400 gap-2">
          <Link href={"#"} className="flex items-center gap-1">
            <IoMdPeople className="text-2xl" /> 4,123
          </Link>
          <Link href={"#"} className="  flex items-center gap-1">
            <PiWaveformBold className="text-xl" /> 81
          </Link>
        </div>
      </div>
      <div className="bgpink-500 w-1/4 h-full flex justify-end items-end">
        <Button
          className="bg-transparent border-gray-500 border-[1px] h-[32px] w-full hover:bg-transparent hover:border-gray-300"
          size="sm"
        >
          Follow
        </Button>
      </div>
    </div>
  );
};

const Banners = () => {
  const router = useRouter();
  return (
    <div className="bgpurple-500 relative h-[350px] mb-2 flex gap-5">
      <div className="relative w-[280px] my-[5px] content-end p-5 bg-[url('/abstractBg1.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        <div className="relative z-10">
          <p className="text-3xl fontbold text-white poppins-regular">
            Upload your Track
          </p>
          <p className="mb-5 text-white">Add a new track</p>
          <Button
            className="bg-white "
            onClick={() => {
              router.push("/upload");
            }}
          >
            <p className="btn-mint">Upload</p>
          </Button>
        </div>
      </div>

      <div className="relative text-white bg-[url('/abstractBg2.jpg')] w-[280px] my-[5px] flex-auto p-5 content-end">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        <div className="relative z-10">
          <p className="text-3xl font-bold">Create NFT</p>
          <p className="mb-5">Mint an NFT</p>
          <Button
            className="bg-white "
            onClick={() => {
              router.push("/upload");
            }}
          >
            <p className="btn-mint ">Mint Now</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

const HorizontalSongsScroller = ({ data }: { data: metaDataSchema[] }) => {
  const scrollBarOneRef = useRef<HTMLDivElement>(null);
  const scrollLeft = () => {
    if (scrollBarOneRef.current) {
      scrollBarOneRef.current.scrollBy({ left: -800, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    console.log("movring right ");
    console.log(scrollBarOneRef);
    if (scrollBarOneRef.current) {
      scrollBarOneRef.current.scrollBy({ left: 800, behavior: "smooth" });
    }
  };
  return (
    <div className="relative flex justify-center items-center  bgorange-500 bg-#161A1F] rounded-lg mb-2    pl-4  pr-4 overflow-x-hidden whitespace-nowrap  wstart -full">
      <Button
        size="icon"
        onClick={scrollLeft}
        className="bg-white hover:bg-white opacity-41 hover:opacity-50 backdrop-blur-2xl  absolute z-20 left-0 text-2xl "
      >
        <FaChevronLeft className="text-black opacity-101" />
      </Button>
      <div
        ref={scrollBarOneRef}
        className="bgwhite scrollbar-curstom py-6 mb-2 flex gap-5 items-center 
            overflow-x-auto whitespace-nowrap scrollbar-hide  
            "
      >
        {data.map((item, idx) => {
          return <SongCard3 key={idx + item._id} item={item} idx={idx} />;
        })}
      </div>
      <Button
        size="icon"
        onClick={scrollRight}
        className="bg-white hover:bg-white opacity-41 hover:opacity-50 backdrop-blur-2xl  absolute z-20 right-0 text-2xl "
      >
        <FaChevronRight className="text-black opacity-101" />
      </Button>
    </div>
  );
};

const SongCard3 = ({ item, idx }: { item: metaDataSchema; idx: number }) => {
  const dispatch = useAppDispatch();
  const [handleVisible, setHandleVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  let { src, current, duration, isPlaying, songIndex } = useAppSelector(
    (state) => state.audioController
  );

  return (
    <div
      className="h-[332px] min-w-[316px] overflow-hidden bg-gray-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        let songid = item._id;
        dispatch(acActions.setDuration(item.duration));
        dispatch(acActions.setImage(item.image));
        dispatch(acActions.setSongName(item.attributes[1].value));
        dispatch(acActions.setArtistName(item.attributes[0].value));
        dispatch(acActions.setSongIndex(idx));
        dispatch(
          acActions.setSrc(`${process.env.NEXT_PUBLIC_API}/play/${songid}`)
        );
        dispatch(acActions.setIsPlaying(true));
      }}
    >
      <div className="relative w-full h-full">
        <img
          src={item.image}
          className="w-full h-full object-cover hover:scale-125 filter gcale hover:grayscale0 duration-500"
          alt="Sample Image"
        />

        <div className="absolute  top-0 right-0 w-10 h-10 pr-5 pt-5 bggreen-500 content-center">
          <FaPlay
            className={`mx-auto text-2xl duration-500 mr-5 text-white scale-0 ${
              hovered && "scale-100"
            }`}
          />
          <GoDotFill
            className={`mx-auto text-[10px] mt-[-17px] text-white scale-100 duration-500 ${
              hovered && "scale-0"
            }`}
          />
        </div>

        {/* The text background container */}
        <div className="absolute bottom-0 ronded-lg text-white px-5 py-5 bg-gradient-to-t from-black via-transparent to-transparent w-full left-0">
          <div className="relative bggreen-500 w-full h-10 overflow-clip">
            <div
              className={` flex mb-[-40px] transition-transform flex-col duration-700 ease-in-out  bg-ink-500 ${
                hovered
                  ? "transform translate-y-[-50%]"
                  : "transform translate-y-0"
              }`}
            >
              <p className="py-2 text-2xl poppins-medium truncate">
                {item.attributes[1].value}
              </p>
              <p className="py-2 text-2xl poppins-medium truncate">
                {item.attributes[1].value}
              </p>
            </div>
          </div>
          <p className="poppins-regular text-md max-w-[70%]">
            {item.attributes[0].value}
          </p>
        </div>
      </div>
    </div>
  );
};
