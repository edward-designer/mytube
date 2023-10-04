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
    path: userId !== undefined ? `/playlist/LikedVideos` : "sign-in",
    icon: (className) => <ThumbsUp className={className} />,
  },
  {
    name: "History",
    path: userId !== undefined ? `/playlist/History` : "sign-in",
    icon: (className) => <ClockRewind className={className} />,
  },
  {
    name: "Your Videos",
    path: userId !== undefined ? `/${String(userId)}/ProfileVideos` : "sign-in",
    icon: (className) => <VideoRecorder className={className} />,
  },
  {
    name: "Library",
    path:
      userId !== undefined ? `/${String(userId)}/ProfilePlaylists` : "sign-in",
    icon: (className) => <Folder className={className} />,
  },
  {
    name: "Following",
    path:
      userId !== undefined ? `/${String(userId)}/ProfileFollowing` : "sign-in",
    icon: (className) => <UserCheck className={className} />,
  },
  {
    name: "Settings",
    path: userId !== undefined ? `/Settings` : "sign-in",
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
  if (userId !== undefined)
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
      {
        icon: (className) => <File className={className} />,
        name: "Terms of Service",
        path: "/Blog/TOS",
      },
      {
        icon: (className) => <Lock className={className} />,
        name: "Privacy",
        path: "/Blog/Privacy",
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
    {
      icon: (className) => <File className={className} />,
      name: "Terms of Service",
      path: "/Blog/TOS",
    },
    {
      icon: (className) => <Lock className={className} />,
      name: "Privacy",
      path: "/Blog/Privacy",
    },
  ];
};

export const getHeaderNavigation = (
  userId: string | undefined,
): NavigationItem[] => {
  if (userId !== undefined)
    return [
      {
        icon: (className) => <User className={className} />,
        name: "View Profile",
        path: `/${String(userId)}/ProfileVideos`,
      },
      {
        icon: (className) => <Brush className={className} />,
        name: "Creator Studio",
        path: `/Dashboard`,
      },
      {
        icon: (className) => <HelpCircle className={className} />,
        name: "Help",
        path: `/Blog/Help`,
      },
      {
        icon: (className) => <Settings className={className} />,
        name: "Settings",
        path: `/Settings`,
      },
      {
        icon: (className) => <MessagePlusSquare className={className} />,
        name: "Feedback",
        path: `/`,
      },
      {
        icon: (className) => <File className={className} />,
        name: "Terms of Service",
        path: `/Blog/TOS`,
      },
      {
        icon: (className) => <Lock className={className} />,
        name: "Privacy",
        path: "/Blog/Privacy",
      },
      {
        icon: (className) => <LogOut className={className} />,
        name: "Log Out",
        path: "sign-out",
      },
    ];
  return [
    {
      icon: (className) => <HelpCircle className={className} />,
      name: "Help",
      path: `/Blog/Help`,
    },
    {
      icon: (className) => <MessagePlusSquare className={className} />,
      name: "Feedback",
      path: `mailto:info@mytube.com`,
    },
    {
      icon: (className) => <File className={className} />,
      name: "Terms of Service",
      path: "/Blog/TOS",
    },
    {
      icon: (className) => <Lock className={className} />,
      name: "Privacy",
      path: "/Blog/Privacy",
    },
  ];
};

export const getFooterNavigation = (
  userId: string | undefined,
): NavigationItem[] => [
  {
    name: "Home",
    path: `/`,
    icon: (className) => <Home className={className} />,
  },
  {
    name: "History",
    path: userId !== undefined ? `/playlist/History` : "sign-in",
    icon: (className) => <ClockRewind className={className} />,
  },
  {
    name: "Library",
    path:
      userId !== undefined ? `/${String(userId)}/ProfilePlaylists` : "sign-in",
    icon: (className) => <Folder className={className} />,
  },
  {
    name: "Following",
    path:
      userId !== undefined ? `/${String(userId)}/ProfileFollowing` : "sign-in",
    icon: (className) => <UserCheck className={className} />,
  },
];
