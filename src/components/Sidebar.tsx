import { signIn, signOut, useSession } from "next-auth/react";
import { type NextRouter, useRouter } from "next/router";
import Link from "next/link";

import { Transition } from "@headlessui/react";

import { cx } from "@/utils/helpers";
import {
  getDesktopNavigation,
  getMobileNavigation,
  type NavigationItem,
} from "@/utils/getData";
import { Button } from "./Buttons";
import { Logo } from "./Icons/Logo";
import UserImage from "./Video/UserImage";
import LogOut from "./Icons/LogOut";
import { useEffect, useRef } from "react";

interface SidebarProps {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  closeSidebar: () => void;
  expandSideBar: boolean;
  setExpandSideBar: (state: boolean) => void;
}

const Sidebar = ({
  isOpen,
  setSidebarOpen,
  closeSidebar,
  expandSideBar,
  setExpandSideBar,
}: SidebarProps) => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  const desktopNavigation = getDesktopNavigation(userId);

  return (
    <>
      <div
        className={cx([
          expandSideBar ? "-ml-56 w-56 " : "-ml-[4em] w-[4em]",
          "top-0 shrink-0 -translate-x-full transition-all lg:sticky lg:bottom-0 lg:z-40 lg:ml-0 lg:mr-0 lg:flex lg:translate-x-0 lg:flex-col",
        ])}
      >
        <div
          onMouseEnter={() => setExpandSideBar(true)}
          onMouseLeave={() => setExpandSideBar(false)}
          className="flex grow flex-col gap-y-5 overflow-y-auto border border-t-0 border-gray-200 bg-white px-6 pb-4"
        >
          <nav className="flex flex-1 flex-col pt-8">
            <ul role="list" className="flex flex-1 flex-col justify-between">
              <li>
                <ul role="list" className="-mx-2 space-y-1 ">
                  {desktopNavigation
                    .filter(
                      (item) =>
                        item.name !== "Settings" && item.name !== "Help",
                    )
                    .map((item) => (
                      <NavItem
                        key={item.name}
                        item={item}
                        router={router}
                        expandSideBar={expandSideBar}
                        setExpandSideBar={setExpandSideBar}
                      />
                    ))}
                </ul>
              </li>

              <li>
                <ul role="list" className="-mx-2 space-y-1 ">
                  {desktopNavigation
                    .filter(
                      (item) =>
                        item.name === "Settings" || item.name === "Help",
                    )
                    .map((item) => (
                      <NavItem
                        key={item.name}
                        item={item}
                        router={router}
                        expandSideBar={expandSideBar}
                        setExpandSideBar={setExpandSideBar}
                      />
                    ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <MobileMenu isOpen={isOpen} closeSidebar={closeSidebar} />
    </>
  );
};

export default Sidebar;

const MobileMenu = ({
  isOpen,
  closeSidebar,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
}) => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  const mobileMenuRef = useRef<null | HTMLDivElement>(null);
  const mobileNavigation = getMobileNavigation(userId);

  useEffect(() => {
    const handleMouseDown = (e: Event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("touchdown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("touchdown", handleMouseDown);
    };
  }, [closeSidebar]);

  return (
    <Transition show={isOpen} className="absolute inset-0 z-50 lg:hidden">
      <Transition.Child
        enter="transition-opacity ease-in-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-slate-500/50" aria-hidden="true"></div>
      </Transition.Child>
      <Transition.Child
        enter="transition ease-in-out duration-500 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div
          ref={mobileMenuRef}
          className="fixed flex h-screen w-80 bg-white px-4"
        >
          <Button
            onClick={closeSidebar}
            className="absolute right-0 translate-x-full rounded-none"
          >
            X
          </Button>
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white">
            <div className="flex flex-shrink-0 items-center border-b border-gray-200 p-4">
              <Link href="/" aria-label="home">
                <Logo className="h-10" />
              </Link>
            </div>
            <nav className="mx-4 flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col justify-between">
                <li>
                  <ul role="list" className="-mx-2 space-y-1 ">
                    {mobileNavigation
                      .filter(
                        (item) =>
                          item.name !== "Terms of Service" &&
                          item.name !== "Privacy",
                      )
                      .map((item) => (
                        <NavItem
                          onClick={closeSidebar}
                          key={item.name}
                          item={item}
                          router={router}
                        />
                      ))}
                  </ul>
                </li>

                <li>
                  <ul role="list" className="-mx-2 space-y-1 ">
                    {mobileNavigation
                      .filter(
                        (item) =>
                          item.name === "Terms of Service" ||
                          item.name === "Privacy",
                      )
                      .map((item) => (
                        <NavItem
                          onClick={closeSidebar}
                          key={item.name}
                          item={item}
                          router={router}
                        />
                      ))}
                  </ul>
                </li>
              </ul>
            </nav>
            <div className="flex flex-col gap-2 border-t border-gray-200 py-4">
              {sessionData ? (
                <>
                  <div className="flex px-4 py-3">
                    <UserImage
                      image={sessionData?.user?.image ?? ""}
                      className="aspect-square"
                    />
                    <div className="ml-2 flex w-full flex-col justify-center truncate">
                      {sessionData?.user?.name && (
                        <p className="truncate text-sm font-semibold text-gray-700">
                          <span>{sessionData?.user?.name}</span>
                        </p>
                      )}
                      <p className="truncate text-sm text-gray-600">
                        <span>{sessionData?.user?.email}</span>
                      </p>
                    </div>

                    <Button
                      variant="tertiary-gray"
                      onClick={() => void signOut()}
                    >
                      <LogOut className="w-6 stroke-primary-500" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="2xl"
                    onClick={() => void signIn()}
                    className="rounded-md"
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="tertiary-gray"
                    size="2xl"
                    onClick={() => void signIn()}
                    className="rounded-md border border-gray-200"
                  >
                    Log In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
};

interface NavItemProps {
  item: NavigationItem;
  router: NextRouter;
  expandSideBar?: boolean;
  setExpandSideBar?: (state: boolean) => void;
  onClick?: (state: boolean) => void;
}

const NavItem = ({
  item,
  router,
  expandSideBar = true,
  setExpandSideBar,
  onClick,
}: NavItemProps) => {
  const currentPath = router.asPath;
  const isCurrentPage = item.path === currentPath;
  return (
    <li>
      <Link
        href={item.path ?? "/"}
        onFocus={() => setExpandSideBar?.(true)}
        onClick={(e) => {
          e.preventDefault();
          if (item.path === "sign-in") {
            void signIn();
          } else {
            if (onClick) onClick(false);
            void router.push(item.path ?? "/");
          }
        }}
        className={cx([
          isCurrentPage
            ? " bg-gray-50 text-primary-600"
            : " text-gray-700 hover:bg-gray-50 hover:text-primary-600",
          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
        ])}
      >
        {isCurrentPage
          ? item.icon("m-1 h-5 w-5 shrink-0 stroke-primary-600 ")
          : item.icon(
              "m-1 h-5 w-5 shrink-0 stroke-gray-500  group-hover:stroke-primary-600",
            )}
        <p className={cx([expandSideBar ? "" : "hidden", "whitespace-nowrap"])}>
          {item.name}
        </p>
      </Link>
    </li>
  );
};
