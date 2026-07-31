"use client";

import Aos from "aos";
import "aos/dist/aos.css";
import "../styles/index.scss";
import { useEffect } from "react";
import ScrollToTop from "../components/common/ScrollTop";
import { Provider } from "react-redux";
import { store } from "../store/store";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import SessionWrapper from "../components/SessionWrapper";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

export default function RootLayout({ children }) {
  useEffect(() => {
    Aos.init({
      duration: 1400,
      once: true,
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800;900&display=swap"
        />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="keywords"
          content="job board, job listing, job search, recruiters"
        />
        <meta
          name="description"
          content="Superio - Job Board React NextJS Template"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body id="root">
        <SessionProvider>
          <Provider store={store}>
            <SessionWrapper>
              <div className="page-wrapper">
                {children}
                <ToastContainer
                  position="bottom-right"
                  autoClose={500}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
                <ScrollToTop />
              </div>
            </SessionWrapper>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
