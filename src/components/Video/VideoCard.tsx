import Link from "next/link";
import { Thumbnail } from "./Thumbnail";
import { cx } from "@/utils/helpers";
import { VideoTitle } from "./VideoTitle";
import { VideoInfo } from "./VideoInfo";
import UserImage from "./UserImage";
import { UserName } from "./UserName";
import { Video, User } from "./VideoGrid";

export const VideoCard = ({
  video,
  user,
  variant,
  priority,
}: {
  video: Video;
  user: User;
  variant: string;
  priority?: boolean;
}) => {
  return (
    <Link
      href={`/video/${video.id}`}
      className={cx([
        "flex flex-col items-start hover:bg-gray-100",
        variant === "home" ? "flex-1 lg:basis-1/4" : "",
        variant === "aside" ? "flex-1 basis-1/2" : "",
      ])}
      key={video.id}
    >
      <div
        className={cx([
          variant === "home"
            ? "relative"
            : variant === "aside"
            ? "flex items-center gap-4"
            : "",
          "w-full",
        ])}
      >
        <div className={cx([variant === "aside" ? " basis-1/2" : "w-full"])}>
          <Thumbnail
            priority={variant !== "aside" && priority}
            thumbnailUrl={video.thumbnailUrl ?? ""}
            description={`Thumbnail image for the video ${video.title ?? ""}`}
          />
        </div>
        <div
          className={cx([
            variant === "aside" ? "flex-shrink-0 basis-1/2" : "max-w-xl",
            "-mt-3 lg:mt-0",
          ])}
        >
          <div
            className={cx([
              variant === "home" ? "mt-4 " : "",
              "items-top relative flex gap-x-4",
            ])}
          >
            {variant === "home" && (
              <UserImage priority={priority} image={user.image ?? ""} />
            )}
            <div className="w-full">
              <VideoTitle
                title={video.title ?? ""}
                limitHeight={true}
                limitSize={true}
              />
              <VideoInfo views={video.views} createdAt={video.createdAt} />
              <UserName name={user.name ?? ""} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
