import { useState } from "react";
import Head from "next/head";

import { Button, Navbar, Sidebar } from "@/components";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const setSidebarOpen = () => setIsOpen(true);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <Sidebar isOpen={isOpen} setSidebarOpen={setSidebarOpen} />
        <h1>Hello World</h1>
        <Button>Hello</Button>
      </main>
    </>
  );
}
