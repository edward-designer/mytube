import React from "react";
import ErrorMessage from "./ErrorMessage";
import AddNewButton from "../Buttons/AddNewButton";

const NotAvailable = ({
  userId,
  variant = "video",
}: {
  userId?: string;
  variant?:
    | "video"
    | "playlist"
    | "history"
    | "liked"
    | "following"
    | "announcement"
    | "page";
}) => {
  const MESSAGES = {
    video: {
      title: "No videos Uploaded",
      description: userId
        ? "Click to upload new video!"
        : "Check back at a later time",
      icon: "GreenPlay",
    },
    page: {
      title: "The page is currently unavailable",
      description: "Check back at a later time",
      icon: "GreenEye",
    },
    playlist: {
      title: "No playlists created",
      description: userId
        ? "Click to check out videos and add to playlists!"
        : "Check back at a later time",
      icon: "GreenHorn",
    },
    history: {
      title: "No history to be shown",
      description: "Viewing history will be shown once available.",
      icon: "GreenEye",
    },
    liked: {
      title: "No video likes yet",
      description: "Videos will be shown here once liked.",
      icon: "GreenHeart",
    },
    following: {
      title: "Have not followed anyone yet",
      description: "Followed creators will be shown here.",
      icon: "GreenPeople",
    },
    announcement: {
      title: "No announcements yet",
      description: "Published announcements will be shown here",
      icon: "GreenHorn",
    },
  };

  return (
    <div className="flex flex-col items-center">
      <ErrorMessage
        icon={MESSAGES[variant]?.icon}
        message={MESSAGES[variant].title}
        description={MESSAGES[variant].description}
      />
      {userId ? (
        <div className="mt-5">
          <AddNewButton variant={variant} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NotAvailable;
