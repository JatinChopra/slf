import Link from "next/link";
import { NavItems } from "./SideBar";
const NavBarSm = () => {
  return (
    <>
      <div className="fixed bottom-0 bg-[#0c0b0d] border-t-[1px] w-full h-[80px] flex justify-evenly px-5 items-center flex-no-wrap">
        {NavItems.map((item, idx) => {
          if (item.text != "Search")
            return (
              <>
                <Link
                  key={item.text + idx}
                  href={item.link}
                  className={`flex flex-col  text-neutral-400 justify-center items-center`}
                >
                  <div className="text-xl text-puple-600">{item.icon}</div>
                  <p className="text-sm font-bold">{item.text.split(" ")[0]}</p>
                </Link>
              </>
            );
        })}
      </div>
    </>
  );
};

export default NavBarSm;
