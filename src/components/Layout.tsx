import { useState, type ReactElement, useCallback } from "react";
import Head from "next/head";

import { Navbar, Sidebar } from "@/components";
import Menu from "./Icons/Menu";
import Footer from "./Footer";
import { SeoHeaders } from "./SeoHeader";

const Layout = ({ children }: { children: ReactElement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandSideBar, setExpandSideBar] = useState(false);
  const closeSidebar = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <Head>
        <title>MyTube UK</title>
        <meta name="description" content="A Youtube Clone" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <SeoHeaders
          title="MyTube UK"
          description="A Youtube Clone"
          author="Edward Chung"
          twitterAuthor=""
          twitterSite=""
          url="https://mytubeuk.vercel.app/"
          imageUrl="https://mytubeuk.vercel.app/mytube.jpg"
        />
      </Head>
      <main className="relative flex min-h-[100dvh] max-w-[100dvw] flex-col">
        <Navbar>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-2 inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <Menu className="h-6 w-6 stroke-gray-400" aria-hidden="true" />
            <span className="sr-only">Open Menu</span>
          </button>
        </Navbar>

        <div className="relative flex flex-1">
          <Sidebar
            isOpen={isOpen}
            closeSidebar={closeSidebar}
            expandSideBar={expandSideBar}
            setExpandSideBar={setExpandSideBar}
          />
          <section
            className="relative flex-1 items-center justify-center lg:ml-[4em]"
            id="main"
          >
            {children}
          </section>
        </div>
        <div className="sticky bottom-0 z-40 w-full bg-white lg:hidden">
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Layout;
