import React from "react";
import ErrorMessage from "./ErrorMessage";
import AddNewButton from "../Buttons/AddNewButton";

const NotAvailable = ({
  userId,
  variant = "video",
}: {
  userId?: string;
  variant?: "video" | "playlist" | "history";
}) => {
  const MESSAGES = {
    video: {
      title: "No videos Uploaded",
      description: userId
        ? "Click to upload new video!"
        : "Check back at a later time",
    },
    playlist: {
      title: "No playlists created",
      description: userId
        ? "Click to check out videos and add to playlists!"
        : "Check back at a later time",
    },
    history: {
      title: "No history to be shown",
      description:
        "Check out our videos first! The homepage is a good staring point!",
    },
  };

  return (
    <div className="flex flex-col items-center">
      <ErrorMessage
        icon="GreenPlay"
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
