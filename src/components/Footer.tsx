import { useSession } from "next-auth/react";
import Link from "next/link";
import { type NextRouter, useRouter } from "next/router";

import { cx } from "@/utils/helpers";
import { type NavigationItem, getFooterNavigation } from "@/utils/getData";

const Footer = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  if (userId === undefined) return;

  const footerNavigation = getFooterNavigation(userId);
  return (
    <ul className="flex w-full flex-row border-t shadow-xl text-xs">
      {footerNavigation.map((item) => (
        <FooterItem key={item.name} item={item} router={router} />
      ))}
    </ul>
  );
};

export default Footer;

interface NavItemProps {
  item: NavigationItem;
  router: NextRouter;
}

const FooterItem = ({ item, router }: NavItemProps) => {
  const currentPath = router.asPath;
  const isCurrentPage = item.path === currentPath;
  return (
    <li className="flex-1 p-4">
      <Link
        href="#"
        onClick={() => {
          void router.push(item.path ?? "/");
        }}
        className={cx([
          isCurrentPage
            ? " text-primary-600"
            : " text-gray-700 hover:text-primary-600",
          "group flex flex-1 flex-col items-center",
        ])}
      >
        {isCurrentPage
          ? item.icon("h-5 w-5 shrink-0 stroke-primary-600 ")
          : item.icon(
              "h-5 w-5 shrink-0  stroke-gray-500  group-hover:stroke-primary-600",
            )}
        <p>{item.name}</p>
      </Link>
    </li>
  );
};
