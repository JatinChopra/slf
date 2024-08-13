import { useState, useEffect } from "react";
import { IoIosArrowDroprightCircle } from "react-icons/io";

import { useRouter } from "next/router";
import { TiHome } from "react-icons/ti";
import { FaSearch } from "react-icons/fa";
import { PiPlaylistBold } from "react-icons/pi";
import { MdCloudUpload } from "react-icons/md";
import { MdExplore } from "react-icons/md";
import { sideBarActions } from "@/store/SideBarSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { PiWaveformBold } from "react-icons/pi";

import Link from "next/link";
import { motion, useAnimationControls } from "framer-motion";
const containerVariants = {
  close: {
    width: "4.4rem",
    transition: {
      type: "spring",
      damping: 15,
      durations: 0.5,
    },
  },
  open: {
    width: "21rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
};
const svgVariants = {
  close: {
    rotate: 0, // No rotation when closed
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  open: {
    rotate: 180, // 180 degrees rotation when open
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export const NavItems = [
  {
    icon: <PiWaveformBold className="text-2xl ml-[5px] mr-2 min-w-[50px]" />,
    text: "Feed",
    link: "/index",
  },
  {
    icon: <FaSearch className="text-2xl ml-[5px] mr-3  min-w-[50px]" />,
    text: "Search",
    link: "/search",
  },
  {
    icon: <MdExplore className="text-2xl ml-[5px] mr-3  min-w-[50px]" />,
    text: "Browse",
    link: "/browse",
  },
  {
    icon: <PiPlaylistBold className="text-2xl ml-[5px] mr-3  min-w-[50px]" />,
    text: "Favourites",
    link: "/favourites",
  },
  {
    icon: <MdCloudUpload className="text-2xl ml-[5px] mr-3  min-w-[50px]" />,
    text: "Upload",
    link: "/upload",
  },
];
const SideBar = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sideBar.isOpen);
  const router = useRouter();
  const containerControls = useAnimationControls();
  const svgControls = useAnimationControls();
  const [innerWidth, setInnerWidth] = useState(0);
  console.log(router.pathname);

  const handleResize = () => setInnerWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    console.log(innerWidth);

    // dispatch(sideBarActions.openSidebar());
    // if (innerWidth > 990) {
    //   dispatch(sideBarActions.openSidebar());
    //   // setIsOpen(true);
    // }

    // if (innerWidth <= 1400) {
    //   dispatch(sideBarActions.closeSidebar());
    // }
    if (isOpen) {
      containerControls.start("open");
      svgControls.start("open");
    } else {
      containerControls.start("close");
      svgControls.start("close");
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, innerWidth]);

  const handleOpenClose = () => {
    // setIsOpen(!isOpen);
    dispatch(sideBarActions.toggleSidebar());
  };
  return (
    <motion.div
      variants={containerVariants}
      animate={containerControls}
      initial={"close"}
      // className={`fixed top-0 left-0 h-full w-64 bg-[#0c0b0d] backdrop-blur-lg bg-opacity-50 shadow shadow-neutral-400 md:static md:flex md:w-64 md:block transition-transform duration-300 ease-in-out  md:translate-x-0`}

      // className="ml-5 max-w-[15rem]    rounded-lg bgpink-501 bg-pink500 bg-[#1b1b1b]  backdrop-blur-lg bg-opacity50 h-[99%] mdflex flex-col z-10 gap-5 py-5 max-sm:absolute sm:  top-0 left-0 shadow shadow-neutral400 "
      className=" absolute ml-0 max-w-[15rem] border-r-purple-600 border-r-2   bgpink-501 bg-pink500 bg-[#1b1b1b]  backdrop-blur-lg bg-opacity-50 h-full mdflex flex-col z-30 gap-5 py-5 max-sm:absolute sm:  top-0 left-0 shadow shadow-neutral400 "
    >
      <div
        className="flex flex-row w-full justify-between place-items-center"
        onClick={handleOpenClose}
      >
        <img src="/shadyLogo.svg" className=" max-w-[50px] mx-auto mb-5 ml-2" />
      </div>
      <div className="flex flex-col gap-2 bgyellow-500 w-full">
        {NavItems.map((item, idx) => {
          return (
            <Link
              key={item.link + idx}
              href={item.link}
              className={`bggreen-500 w-full textwhite  transition-colors duration-100  flex text-3xl   items-center  h-[49px]  overflow-hidden hover:text-neutral-300  ${
                router.pathname == item.link
                  ? "text-white bg-ink-500 border-l-[5px]  "
                  : "text-neutral-500 border-l-[5px] border-l-transparent"
              }`}
            >
              <div className=" bg-yellow500 ">{item.icon}</div>
              <p className=" bg-pink500  font-old text-xl whitespace-nowrap overflow-hidden bg-gree-500 w-full  align-baseline pt-1 ">
                {item.text}
              </p>
            </Link>
          );
        })}{" "}
      </div>
    </motion.div>
  );
};

export default SideBar;
