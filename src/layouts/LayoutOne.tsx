import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import AudioControlBar from "@/features/AudioControlBar";
import SideBar from "@/features/SideBar";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/router";
import genres from "../staticData/generes.json";

const LayoutOne = ({ children }: { children: ReactNode }) => {
  let isOpen = useAppSelector((state) => state.sideBar.isOpen);
  let router = useRouter();
  return (
    <>
      {/* <div className="custom-bg pt-5 pb-24 flex h-[100vh] justify-start overflow-hidden pr-10 custom-moving-gradient"> */}
      {/* <div
        className="bgyellow-500 bgblack bg-[#242431] bg[#1A1A1E] bg[url(/bg.png)] bgcover
  bg-gradient-to-br from-black via-[#1a001a] to-[#661066]
  backdrop-blur-md pt-5 pb-24 flex h-[100vh] justify-start overflow-hidden pr-10
  moving-gradient"
      > */}
      {/* <div
        className="bgyellow-500 bgblack bg-[#242431 bg[#1A1A1E] bg[url(/bg.png)] bgcover
        bg-gradient-to-br from-black via-[#1a001a] to-[#661066]
      backdrop-blur-md pt-5 pb-24 flex h-[100vh] justify-start overflow-hidden pr-10 "
      > */}
      <div
        className="bg-ellow-500 bgblack bg-[#242431 bg[#1A1A1E] bg[url(/bg.png)] bgcover
      bg-black
      backdrop-blur-md pt-5 pb-24 flex h-[100vh] justify-start overflow-hidden pr-10 "
      >
        {/* serch bar container */}

        <SideBar />
        <TopBar />
        {/* box 1  */}
        <div
          className={`bgorange-500 w-full mx-auto ml-[70px] mt-[37px] px px-0 flex flex-col duration-150 ${
            isOpen && " opacity-40 "
          }`}
        >
          {/* Box 1.1 */}
          {/* this will work like heading cool */}
          {router.pathname == "/" && <GenresHorizontalScroller />}
          {/* box 1.2 */}
          <div className="bgcyan-500  px-5 gap-5 flex flex-auto w-[99%] h-[110%] ">
            {/* box1.2.1*/}
            {children}

            {/* box1.2.2*/}
            {router.pathname == "/index" && <RightBar />}
          </div>
        </div>
        <div className="bgorange-500 ">{/* top bar */}</div>
        {/* right bar */}
      </div>

      {/* Audio : lg */}

      <AudioControlBar />

      <Toaster />
    </>
  );
};
const RightBar = () => {
  return (
    <div className="bg-[#1b1b1b] h-full  mr-5 mb-5 z-50 lg:min-w-[340px] rounded-lg"></div>
  );
};

const GenresHorizontalScroller = () => {
  return (
    // <div className="bg-pink500 px-7 pr-10 min-h-[57px] duration-700 gap-3 items-center flex overflow-x-scroll scrollbar-custom scrollbar-hide">
    //   <div className="bg-[#161A1F] border-[1px] font-bold px-2 border-purple-500 min-w-[70px] h-[30px] rounded-md text-gray-300 text-center content-center text-sm">
    //     All
    //   </div>
    //   {genres.genres.map((item: string, idx) => {
    //     return (
    //       <>
    //         <div
    //           key={idx}
    //           className="bg-[#161A1F] border-[1px] font-bold px-2 border-gray-400  h-[30px] rounded-md text-gray-300 text-center content-center text-sm"
    //         >
    //           {item.charAt(0).toUpperCase() + item.substring(1)}
    //         </div>
    //       </>
    //     );
    //   })}
    // </div>
    <div className="bg-pink500 px-7 bg-[#161A1F] pr-10 min-h-[57px] duration-700 gap-3 items-center flex mr-12 overflow-x-scroll scrollbar-custom scrollbar-hide">
      <div className="bg-[#161A1F] border-[1px] font-bold px-2 py-1 border-purple-500 h-[30px] rounded-md text-gray-300 text-center text-sm flex-shrink-0">
        All
      </div>
      {genres.genres.map((item: string, idx) => {
        return (
          <p
            key={idx}
            className="bg-[#161A1F] border-[1px] font-bold px-2 py-1 border-gray-400 h-[30px] rounded-md text-gray-300 text-center text-sm flex-shrink-0"
          >
            {item.charAt(0).toUpperCase() + item.substring(1)}
          </p>
        );
      })}
    </div>
  );
};

const TopBar = () => {
  return (
    <div className="fixed  flex pl-[80px] flex-nowrap items-center justify-between top-0 h-[56px] bggreen-500 pr-[40px] opacity20 z-40 border-b-[1px] border-neutral-700  content-center w-full  lg:w-full">
      <div className="flex item-center gap-2">
        <div className="bgyellow-200 content-center">
          <p className="bgpink-500 text-xl font-bold text-purple-600 poppins-extrabold">
            ShadyLabs
          </p>
        </div>
        {/* Searchbox */}
        <div className="relative flex items-center  md:min-w-[320px] h-[35px] ml-5 ">
          <FaSearch className="text-neutral-600 absolute left-5  " />
          <Input
            className="rounded-lg border-transparent focus:border-1 focus:border-purple-500 bg-neutral-900 pl-12  placeholder:text-neutral-600  h-[35px] placeholder:text-sm  max-w-[650px]  text-gray-300 text-sm "
            placeholder="Search by artist, song or album"
          />
        </div>
      </div>
      <div>
        {/* <Button
                size="lg"
                className="bg-purple-pink bg-gradient-to-r from-purple-600 to-[90%] to-indigo-800 font-bold rounded-full ring ring-white ring-offset-1 ring-offset-black border-4 border-black text-lg  hover:from-purple-400 hover:to-indigo-700"
              >
                Join as Artist
              </Button> */}

        <Button
          size="sm"
          className="relative inline-block h-[30px] font-bold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent rounded-md overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-background"></span>
          <span className="relative text-white">Sign In</span>
        </Button>
      </div>
    </div>
  );
};

export default LayoutOne;
