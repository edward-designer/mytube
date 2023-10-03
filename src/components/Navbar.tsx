import Link from "next/link";
import router from "next/router";

import { Menu, Transition } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";

import { DotsVertical, Logo } from "./Icons/Icons";
import UserImage from "./Video/UserImage";
import Button from "./Buttons/Button";
import { cx } from "@/utils/helpers";
import { type NavigationItem, getHeaderNavigation } from "@/utils/getData";
import SearchBar from "./SearchBar/SearchBar";

interface NavbarProps {
  children?: JSX.Element;
}

const Navbar = ({ children }: NavbarProps) => {
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
                <SearchBar />
                <div className="flex items-center lg:hidden">{children}</div>
              </div>
            </div>
          </div>
          <div className="m-0 hidden w-max px-0 lg:flex lg:items-center lg:justify-end xl:col-span-2">
            <HeaderMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

const HeaderMenu = () => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;
  const Navigation = getHeaderNavigation(userId);
  return (
    <>
      <Menu as="div" className="relative mx-2 flex-shrink-0">
        <div>
          <Menu.Button className="flex rounded-full focus:outline-none focus:ring-primary-500 focus:ring-offset-2">
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
              <p className="border-gray:200 flex border-b px-4 py-2 text-center text-sm font-semibold text-gray-700">
                Menu
              </p>
            )}
            {Navigation.map((item) => (
              <MenuItem key={item.name} item={item} />
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
          <Button variant="primary" size="md" onClick={() => void signIn()}>
            Sign Up
          </Button>
        </div>
      )}
    </>
  );
};

const MenuItem = ({ item }: { item: NavigationItem }) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <Link
          onClick={(e) => {
            e.preventDefault();
            if (item.path === "sign-out") {
              void signOut();
            } else {
              void router.push(item.path ?? "/");
            }
          }}
          href={item.path ?? "/"}
          className={cx([
            active ? "bg-gray-100" : "",
            item.name === "Terms of Service" ? "border-gray:200 border-t" : "",
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
  );
};
