import { signIn, useSession } from "next-auth/react";
import { type NextRouter, useRouter } from "next/router";
import Link from "next/link";

import { cx } from "@/utils/helpers";
import {
  getDesktopNavigation,
  getMobileNavigation,
  type NavigationItem,
} from "@/utils/getData";

interface SidebarProps {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  closeSidebar?: boolean;
}

const Sidebar = ({ isOpen, setSidebarOpen, closeSidebar }: SidebarProps) => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  const DesktopNavigation = getDesktopNavigation(userId);
  const mobileNavigation = getMobileNavigation(userId);

  return (
    <>
      <div
        className={cx([
          closeSidebar ? "lg:w-20" : "lg:w-56",
          "lg: bottom-0 top-16 -translate-x-full bg-red-400 transition-all lg:fixed lg:z-40 lg:flex lg:translate-x-0 lg:flex-col",
        ])}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border border-gray-200 bg-white px-6 pb-4">
          <nav className="flex flex-1 flex-col pt-8">
            <ul role="list" className="flex flex-1 flex-col justify-between">
              <li>
                <ul role="list" className="-mx-2 space-y-1 ">
                  {DesktopNavigation.filter(
                    (item) => item.name !== "Settings" && item.name !== "Help",
                  ).map((item) => (
                    <NavItem key={item.name} item={item} router={router} />
                  ))}
                </ul>
              </li>

              <li>
                <ul role="list" className="-mx-2 space-y-1 ">
                  {DesktopNavigation.filter(
                    (item) => item.name === "Settings" || item.name === "Help",
                  ).map((item) => (
                    <NavItem key={item.name} item={item} router={router} />
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

/* NavItem Componenet*/

interface NavItemProps {
  item: NavigationItem;
  router: NextRouter;
  closeSidebar?: boolean;
}

const NavItem = ({ item, router, closeSidebar }: NavItemProps) => {
  const currentPath = router.asPath;
  const isCurrentPage = item.path === currentPath;
  return (
    <li>
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (item.path === "sign-in") {
            void signIn();
          } else {
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
          ? item.icon("h-5 w-5 shrink-0 stroke-primary-600 ")
          : item.icon(
              "h-5 w-5 shrink-0  stroke-gray-500  group-hover:stroke-primary-600",
            )}
        <p className={cx([closeSidebar ? "hidden" : ""])}>{item.name}</p>
      </Link>
    </li>
  );
};
