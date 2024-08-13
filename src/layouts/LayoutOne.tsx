import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import AudioControlBar from "@/features/AudioControlBar";
import SideBar from "@/features/SideBar";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/router";
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
      <div
        className="bgyellow-500 bgblack bg-[#242431 bg[#1A1A1E] bg[url(/bg.png)] bgcover
        bg-gradient-to-br from-black via-[#1a001a] to-[#661066]
      backdrop-blur-md pt-5 pb-24 flex h-[100vh] justify-start overflow-hidden pr-10 "
      >
        {/* serch bar container */}

        <SideBar />
        {/* box 1  */}
        <div
          className={`bgorange-500 w-[95%] mx-auto ml-[80px] px-5 md:px-0 flex flex-col duration-150 ${
            isOpen && "  "
          }`}
        >
          {/* Box 1.1 */}
          <TopBar />
          {/* box 1.2 */}
          <div className="bgpink-500 pt-5 px-5 gap-5 flex flex-auto w-full h-[110%] ">
            {/* box1.2.1*/}
            {children}

            {/* box1.2.2*/}
            {router.pathname == "/home" && <RightBar />}
          </div>
        </div>
        <div className="bg-orsange-500 ">{/* top bar */}</div>
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

const TopBar = () => {
  return (
    <div className="flex pl-[30px] flex-nowrap items-center justify-between top-0 h-[80px] bggreen-500 pr-[40px] opacity20 z-100   content-center w-[95%] lg:w-full">
      {/* Searchbox */}
      <div className="relative flex items-center  md:min-w-[600px] ">
        <FaSearch className="text-neutral-600 absolute left-5  " />
        <Input
          className="rounded-lg border-purple-500 border-2 bg-neutral-900 pl-12  placeholder:text-neutral-600  h-[50px] placeholder:text-xl  max-w-[650px]  text-gray-300 text-xl "
          placeholder="Search by artist, song or album"
        />
      </div>
      <div>
        {/* <Button
                size="lg"
                className="bg-purple-pink bg-gradient-to-r from-purple-600 to-[90%] to-indigo-800 font-bold rounded-full ring ring-white ring-offset-1 ring-offset-black border-4 border-black text-lg  hover:from-purple-400 hover:to-indigo-700"
              >
                Join as Artist
              </Button> */}

        <Button className="relative inline-block px-6 py-2.5 font-bold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent rounded-full overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-background"></span>
          <span className="relative text-white">Sign In</span>
        </Button>
      </div>
    </div>
  );
};

export default LayoutOne;
