import React, { ReactNode, useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

import { Button } from "@/components/ui/button";
import LayoutOne from "@/layouts/LayoutOne";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { audioControllerSliceActions as acActions } from "@/store/AudioControllerSlice";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import { Router } from "lucide-react";

export type metaDataSchema = {
  _id: string;
  name: string;
  description: string;
  duration: number;
  image: string;
  attributes: [
    {
      trait_type: string;
      value: string;
    },
    {
      trait_type: string;
      value: string;
    }
  ];
};

const Home = ({ data }: { data: metaDataSchema[] | [] }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [handleVisible, setHandleVisible] = useState(false);

  const scrollBarOneRef = useRef<HTMLDivElement>(null);
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
    dispatch(acActions.setSrc(`https://18.119.137.31:443/play/${songid}`));

    dispatch(acActions.setIsPlaying(true));
  }

  const scrollLeft = () => {
    if (scrollBarOneRef.current) {
      scrollBarOneRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollBarOneRef.current) {
      scrollBarOneRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        id="audioPlayer"
        className="mt-20 hidden "
        controls
      ></audio>

      <div className="bgorange-500 p-2 pb-28 gap-2 flex-auto  flex-nowrap overflow-y-scroll scrollbar-custom scrollbar-hide h-full ">
        {/* Section 1 */}
        <div className="bgpurple-500  h-[350px] mb-2 flex gap-5">
          <div className="relative w-[280px] my-[5px] content-end p-5 bg-[url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f110c028-627b-4e5a-a0fc-54fd9ed17ca4/d8yebbu-5f6db196-13e1-45c1-8035-fd8072fc91f8.png/v1/fill/w_1131,h_707,q_70,strp/city_in_the_clouds_by_tatasz_d8yebbu-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTIwMCIsInBhdGgiOiJcL2ZcL2YxMTBjMDI4LTYyN2ItNGU1YS1hMGZjLTU0ZmQ5ZWQxN2NhNFwvZDh5ZWJidS01ZjZkYjE5Ni0xM2UxLTQ1YzEtODAzNS1mZDgwNzJmYzkxZjgucG5nIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.oS3sHiLn2E0UyfD7wq77ceVobtOlOHRxHtNrm_EiJwQ')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="relative z-10">
              <p className="text-3xl font-bold text-white">Upload your Track</p>
              <p className="mb-5 text-white">Add a new track</p>
              <Button
                className="bg-white "
                onClick={() => {
                  router.push("/upload");
                }}
              >
                <p className="px-6 py-2.5 font-bold text-black  transition-all duration-300 ease-in-out bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-cyan-500 rounded-lg ">
                  Upload
                </p>
              </Button>
            </div>
          </div>

          <div className="relative text-white bg-[url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f110c028-627b-4e5a-a0fc-54fd9ed17ca4/db6lkxe-8cf62586-a499-4278-94b2-00603a2f59fb.png/v1/fill/w_1095,h_730,q_70,strp/waves_by_tatasz_db6lkxe-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2YxMTBjMDI4LTYyN2ItNGU1YS1hMGZjLTU0ZmQ5ZWQxN2NhNFwvZGI2bGt4ZS04Y2Y2MjU4Ni1hNDk5LTQyNzgtOTRiMi0wMDYwM2EyZjU5ZmIucG5nIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Zuf5mvwo8EvZPWIIhWH2EnCF6binnTgXpuCaa9spEE4')] w-[280px] my-[5px] flex-auto p-5 content-end">
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
                <p className="px-6 py-2.5 font-bold text-black  transition-all duration-300 ease-in-out bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-cyan-500 rounded-lg ">
                  Mint Now
                </p>
              </Button>
            </div>
          </div>
        </div>
        <p className="bg--500 text-white font-bold text-2xl mt-7">
          Recommendations for you
        </p>
        <div className="relative flex justify-center items-center  bg-range-500 bg[#161A1F] rounded-lg mb-2  gap-y-9  pl-4 overflow-x-hidden whitespace-nowrap scrollbar-hide wstart -full">
          <Button
            size="icon"
            onClick={scrollLeft}
            className="bg-white hover:bg-white opacity-40 hover:opacity-50 backdrop-blur-2xl  absolute z-20 left-0 text-2xl "
          >
            <FaChevronLeft className="text-black opacity-100" />
          </Button>
          <div
            ref={scrollBarOneRef}
            className="bg-[] flex  mb-2 gap-x-8 gap-y-9 pt-5 pl-4  overflow-x-auto whitespace-nowrap scrollbar-hide "
          >
            {data.map((item, idx) => {
              return <SongCard key={idx + item._id} item={item} idx={idx} />;
            })}{" "}
          </div>
          <Button
            size="icon"
            onClick={scrollRight}
            className="bg-white hover:bg-white opacity-40 hover:opacity-50 backdrop-blur-2xl  absolute z-20 right-0 text-2xl "
          >
            <FaChevronRight className="text-black opacity-100" />
          </Button>
        </div>
        {/* in case new section needed */}
        {/* <div className="bg-purple-500  h-[350px] mb-2">a</div> */}
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
  let response = await axios.get("https://18.119.137.31:443/getmetaData");
  if (response.status == 200) {
    let arrayData: metaDataSchema[] = response.data as metaDataSchema[];
    return { props: { data: arrayData } };
  } else {
    alert("Error fetching data from the db");
  }
  return { props: { data: [] } };
};

const SongCard = ({ item, idx }: { item: metaDataSchema; idx: number }) => {
  const dispatch = useAppDispatch();

  const [handleVisible, setHandleVisible] = useState(false);

  let { src, current, duration, isPlaying, songIndex } = useAppSelector(
    (state) => state.audioController
  );
  return (
    <div className="w-[210px]  bggreen-500 rounded-md">
      <div
        className="relative w-[210px] h-[210px] rounded-lg overflow-hidden"
        onClick={() => {
          let songid = item._id;
          dispatch(acActions.setDuration(item.duration));
          dispatch(acActions.setImage(item.image));
          dispatch(acActions.setSongName(item.attributes[1].value));
          dispatch(acActions.setArtistName(item.attributes[0].value));
          dispatch(acActions.setSrc(`https://18.119.137.31:443/play/${songid}`));
          dispatch(acActions.setIsPlaying(true));
        }}
      >
        <img
          src={item.image}
          className="w-full h-full object-cover"
          alt="Image description"
        />
        <div className="absolute cursor-pointer flex items-center justify-center inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-80 transition-opacity duration-300">
          <FaPlay className="text-5xl text-white" />
        </div>

        {/* <div className="absolute bg-green-500  inset-0 m-auto text-white opacity-0 hover:opacity-100 transition-opacity duration-300 w-[90%] h-[90%]">
          <FaPlay />
        </div> */}
      </div>

      <p className="font-bold text-white truncate mt-3">{item.name}</p>
      <p className="text-gray-500 font-bold text-sm">
        {item.attributes[0].value}
      </p>
    </div>
  );
};

const SongCard2 = ({ item, idx }: { item: metaDataSchema; idx: number }) => {
  const dispatch = useAppDispatch();
  const [handleVisible, setHandleVisible] = useState(false);

  let { src, current, duration, isPlaying, songIndex } = useAppSelector(
    (state) => state.audioController
  );

  return (
    <div className="min-w[220px] min-w-[208px] rounded-2xl overflow-hidden shadow- ">
      <div
        className="relative w220px] w-[208px] h-[216px] rounded-[18%]   overflow-hidden group"
        onClick={() => {
          let songid = item._id;
          dispatch(acActions.setDuration(item.duration));
          dispatch(acActions.setImage(item.image));
          dispatch(acActions.setSongName(item.attributes[1].value));
          dispatch(acActions.setArtistName(item.attributes[0].value));
          dispatch(acActions.setSrc(`https://18.119.137.31:443/play/${songid}`));
          dispatch(acActions.setIsPlaying(true));
        }}
      >
        <img
          src={item.image}
          className="w-full h-full object-cover"
          alt="Album cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <FaPlay className="text-5xl text-white" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 py-2 px-4 mb-2  w-[80%] rounded-2xl mx-auto bg-black backdrop-blur-lg h-[25%] flex flex-col justify-center bg-opacity-[1%]  ">
          <p className="font-bold text-white text-sm truncate mb-[2px]">
            {item.attributes[1].value}
          </p>
          <p className="text-gray-300 text-xs truncate ">
            {item.attributes[0].value}
          </p>
        </div>
      </div>
    </div>
  );
};
