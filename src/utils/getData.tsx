import {
  ClockRewind,
  Folder,
  HelpCircle,
  Home,
  Lock,
  MessagePlusSquare,
  Settings,
  ThumbsUp,
  UserCheck,
  File,
  VideoRecorder,
  User,
  Brush,
  LogOut,
  Close,
} from "@/components/Icons/Icons";

export interface NavigationItem {
  name: string;
  path?: string;
  icon: (className: string) => JSX.Element;
}
export const getDesktopNavigation = (
  userId: string | undefined,
): NavigationItem[] => [
  {
    name: "Home",
    path: `/`,
    icon: (className) => <Home className={className} />,
  },
  {
    name: "Liked Videos",
    path: userId ? `/playlist/LikedVideos` : "sign-in",
    icon: (className) => <ThumbsUp className={className} />,
  },
  {
    name: "History",
    path: userId ? `/playlist/History` : "sign-in",
    icon: (className) => <ClockRewind className={className} />,
  },
  {
    name: "Your Videos",
    path: userId ? `/${String(userId)}/ProfileVideos` : "sign-in",
    icon: (className) => <VideoRecorder className={className} />,
  },
  {
    name: "Library",
    path: userId ? `/${String(userId)}/ProfilePlaylists` : "sign-in",
    icon: (className) => <Folder className={className} />,
  },
  {
    name: "Following",
    path: userId ? `/${String(userId)}/ProfileFollowing` : "sign-in",
    icon: (className) => <UserCheck className={className} />,
  },
  {
    name: "Settings",
    path: userId ? `/Settings` : "sign-in",
    icon: (className) => <Settings className={className} />,
  },
  {
    name: "Help",
    path: `/Blog/Help`,
    icon: (className) => <HelpCircle className={className} />,
  },
];

export const getMobileNavigation = (
  userId: string | undefined,
): NavigationItem[] => {
  if (userId)
    return [
      {
        name: "Profile",
        path: `/${String(userId)}/ProfileVideos`,
        icon: (className) => <User className={className} />,
      },
      {
        name: "Creator Studio",
        path: `/Dashboard`,
        icon: (className) => <Brush className={className} />,
      },
      {
        name: "Help",
        path: `/Blog/Help`,
        icon: (className) => <HelpCircle className={className} />,
      },
      {
        name: "Settings",
        path: `/Settings`,
        icon: (className) => <Settings className={className} />,
      },
      {
        name: "Feedback",
        path: `mailto:vidchill@vidchill.com`,
        icon: (className) => <MessagePlusSquare className={className} />,
      },
    ];
  return [
    {
      name: "Help",
      path: `/Blog/Help`,
      icon: (className) => <HelpCircle className={className} />,
    },

    {
      name: "Feedback",
      path: `mailto:vidchill@vidchill.com`,
      icon: (className) => <MessagePlusSquare className={className} />,
    },
  ];
};
