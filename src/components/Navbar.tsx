import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import router from "next/router";

import { Menu, Transition } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";

import {
  Brush,
  DotsVertical,
  File,
  HelpCircle,
  Lock,
  LogOut,
  Logo,
  MessagePlusSquare,
  Search,
  Settings,
  User,
} from "./Icons/Icons";
import UserImage from "./Video/UserImage";
import Button from "./Buttons/Button";
import { cx } from "@/utils/helpers";

interface NavbarProps {
  children?: JSX.Element;
}

interface NavigationItem {
  icon: (className: string) => JSX.Element;
  name: string;
  path: string;
  lineAbove: boolean;
}

const Navbar = ({ children }: NavbarProps) => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  const signedInNavigation: NavigationItem[] = [
    {
      icon: (className) => <User className={className} />,
      name: "View Profile",
      path: `/${String(userId)}/ProfileVideos`,
      lineAbove: true,
    },
    {
      icon: (className) => <Brush className={className} />,
      name: "Creator Studio",
      path: `/Dashboard`,
      lineAbove: false,
    },
    {
      icon: (className) => <HelpCircle className={className} />,
      name: "Help",
      path: `/Blog/Help`,
      lineAbove: true,
    },
    {
      icon: (className) => <Settings className={className} />,
      name: "Settings",
      path: `/Settings`,
      lineAbove: false,
    },
    {
      icon: (className) => <MessagePlusSquare className={className} />,
      name: "Feedback",
      path: `/`,
      lineAbove: false,
    },
    {
      icon: (className) => <File className={className} />,
      name: "Terms of Service",
      path: `/Blog/TOS`,
      lineAbove: true,
    },
    {
      icon: (className) => <Lock className={className} />,
      name: "Privacy",
      path: "/Blog/Privacy",
      lineAbove: false,
    },
    {
      icon: (className) => <LogOut className={className} />,
      name: "Log Out",
      path: "sign-out",
      lineAbove: true,
    },
  ];

  const signedOutNavigation: NavigationItem[] = [
    {
      icon: (className) => <HelpCircle className={className} />,
      name: "Help",
      path: `/Blog/Help`,
      lineAbove: true,
    },
    {
      icon: (className) => <MessagePlusSquare className={className} />,
      name: "Feedback",
      path: `mailto:info@mytube.com`,
      lineAbove: false,
    },
    {
      icon: (className) => <File className={className} />,
      name: "Terms of Service",
      path: "/Blog/TOS",
      lineAbove: true,
    },
    {
      icon: (className) => <Lock className={className} />,
      name: "Privacy",
      path: "/Blog/Privacy",
      lineAbove: false,
    },
  ];

  const Navigation = sessionData ? signedInNavigation : signedOutNavigation;

  const [searchInput, setSearchInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") void handleSearch();
  };
  const handleSearch = async () => {
    try {
      await router.push({
        pathname: "/SearchPage",
        query: { q: searchInput },
      });
    } catch (error) {
      console.log("Error searching:", error);
    }
  };

  return (
    <>
      <div className=" fixed z-50 w-full border border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-full px-6 lg:px-16 xl:grid xl:grid-cols-12">
          <div className="flex flex-shrink-0 items-center lg:static xl:col-span-2">
            <Link href="/" aria-label="home">
              <Logo className="h-10" />
            </Link>
          </div>
          <div className="w-full min-w-0 flex-1 lg:px-0 xl:col-span-8">
            <div className=" g:mx-0 flex items-center px-6 py-4 lg:max-w-none xl:mx-0 xl:px-0">
              <div className="w-full">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative ">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-50 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="focus:ring-primary-500 block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 "
                    placeholder="Search"
                    type="search"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSearchInput(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="flex items-center lg:hidden">{children}</div>
              </div>
            </div>
          </div>

          <div className="m-0 hidden w-max px-0 lg:flex lg:items-center lg:justify-end xl:col-span-2">
            <Menu as="div" className="relative ml-5 flex-shrink-0">
              <div>
                <Menu.Button className="focus:ring-primary-500 flex rounded-full focus:outline-none focus:ring-offset-2">
                  {sessionData ? (
                    <UserImage image={sessionData?.user.image ?? ""} />
                  ) : (
                    <DotsVertical className="w-5 stroke-gray-700" />
                  )}
                </Menu.Button>
              </div>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1">
                  {sessionData ? (
                    <div className="mx-4 my-2 flex">
                      <UserImage
                        image={sessionData?.user?.image ?? ""}
                        className="aspect-square"
                      />
                      <div className="ml-2 flex w-full flex-col justify-start truncate">
                        <p className="truncate text-sm font-semibold text-gray-700">
                          <span>{sessionData?.user?.name}</span>
                        </p>
                        <p className="truncate text-sm text-gray-600">
                          <span>{sessionData?.user?.email}</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mx-4 my-2 flex text-center text-sm font-semibold text-gray-700">
                      Menu
                    </p>
                  )}
                  {Navigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          onClick={(e) => {
                            e.preventDefault();
                            if (item.path === "sign-out") {
                              void signOut();
                            } else {
                              void router.push(item.path || "/");
                            }
                          }}
                          href={item.path || "/"}
                          className={cx([
                            active ? "bg-gray-100" : "",
                            item.lineAbove ? "border-gray:200 border-t" : "",
                            "block px-4 py-2 text-sm text-gray-700",
                          ])}
                        >
                          <div className="flex items-center">
                            {item.icon("h-4 w-4 stroke-gray-700")}
                            <div className="pl-2">{item.name}</div>
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
            {!sessionData && (
              <div className="flex flex-row space-x-3">
                <Button
                  variant="tertiary-gray"
                  size="md"
                  onClick={() => void signIn()}
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => void signIn()}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
