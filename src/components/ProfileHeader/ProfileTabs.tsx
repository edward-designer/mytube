import { cx } from "@/utils/helpers";
import Link from "next/link";
import { type NextRouter } from "next/router";

interface ProfileTabsProps {
  userId: string;
  router: NextRouter;
}

const ProfileTabs = ({ userId, router }: ProfileTabsProps) => {
  const tabs = [
    {
      name: "Videos",
      path: `/${String(userId)}/ProfileVideos`,
    },
    {
      name: "Playlists",
      path: `/${String(userId)}/ProfilePlaylists`,
    },
    {
      name: "Announcements",
      path: `/${String(userId)}/ProfileAnnouncements`,
    },
    {
      name: "Following",
      path: `/${String(userId)}/ProfileFollowing`,
    },
  ];

  return (
    <div className="mb-8 mt-4 overflow-x-auto overflow-y-hidden border-b border-gray-200">
      <nav
        className=" -mb-px flex min-w-max whitespace-nowrap"
        aria-label="Tabs"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.path}
            onClick={(e) => {
              e.preventDefault();
              void router.push(tab.path);
            }}
            className={cx([
              tab.path === router.asPath
                ? "border-primary-500 bg-primary-50 text-primary-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
              " w-full flex-1 flex-shrink-0 basis-40 border-b-4 px-1 py-4 text-center text-sm font-medium ",
            ])}
            aria-current={tab.path === router.asPath ? "page" : false}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default ProfileTabs;
