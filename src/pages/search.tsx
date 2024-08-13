import React, { ReactNode, useState } from "react";

import LayoutOne from "@/layouts/LayoutOne";

const Search = () => {
  const [handleVisible, setHandleVisible] = useState(false);
  return (
    <>
      <p className="text-xl text-white bg-green-500 h-[500px] w-[800px] mt-10 ml-40">
        Hello this is search page
      </p>
    </>
  );
};

export default Search;

Search.getLayout = function getLayout(page: ReactNode) {
  return <LayoutOne>{page}</LayoutOne>;
};
