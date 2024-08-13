import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ReactNode, FC, useRef } from "react";
import { Provider } from "react-redux"; // Import Provider from react-redux or the relevant library
import { makeStore, AppStore } from "../lib/store";

// Define a type for pages that can optionally include a getLayout function
type NextPageWithLayout = FC & {
  getLayout?: (page: ReactNode) => ReactNode;
};

// Extend AppProps to include pages that might have the getLayout function
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Provider store={storeRef.current}>
      {getLayout(<Component {...pageProps} />)}
    </Provider>
  );
}
