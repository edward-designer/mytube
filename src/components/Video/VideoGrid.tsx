import Link from "next/link";
import { Thumbnail } from "./Thumbnail";
import Image from "next/image";
import moment from "moment";
import { cx } from "@/utils/helpers";

interface VideoGridProps {
  data: {
    videos: (
      | {
          views: number;
          id: string;
          title: string | null;
          thumbnailUrl: string | null;
          description: string | null;
          videoUrl: string | null;
          userId: string;
          createdAt: Date;
          updatedAt: Date;
          publish: boolean;
        }
      | undefined
    )[];
    users: (
      | {
          id: string;
          name: string | null;
          email: string;
          emailVerified: Date | null;
          image: string | null;
          backgroundImage: string | null;
          handle: string | null;
          description: string | null;
        }
      | undefined
    )[];
  };
  variant?: string;
}

const VideoGrid = ({
  data: { videos, users },
  variant = "home",
}: VideoGridProps) => {
  const videosToShow = videos.filter((video) => Boolean);
  return (
    <div className="mb-40">
      <div
        className={cx([
          "flex flex-wrap items-start justify-start gap-6 gap-y-12",
          variant === "home" ? "p-12" : "",
        ])}
      >
        {videosToShow.map((video, index) => {
          const user = users[index];
          if (video === undefined || user === undefined) return;
          return (
            <VideoCard
              key={video.id}
              video={video}
              user={user}
              variant={variant}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VideoGrid;

const VideoCard = ({
  video,
  user,
  variant,
}: {
  video: NonNullable<VideoGridProps["data"]["videos"][0]>;
  user: NonNullable<VideoGridProps["data"]["users"][0]>;
  variant: string;
}) => {
  return (
    <Link
      href={`/video/${video.id}`}
      className={cx([
        "flex flex-1 basis-96 flex-col items-start  hover:bg-gray-100",
        variant === "home" ? "lg:basis-1/4" : "",
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
          <Thumbnail thumbnailUrl={video.thumbnailUrl ?? ""} />
        </div>
        <div
          className={cx([
            variant === "aside" ? "flex-shrink-0 basis-1/2" : "max-w-xl",
          ])}
        >
          <div
            className={cx([
              variant === "home" ? "mt-4 " : "",
              "items-top relative flex gap-x-4",
            ])}
          >
            {variant === "home" && <UserImage image={user.image ?? ""} />}
            <div className="w-full">
              <VideoTitle title={video.title ?? ""} limitHeight={true} />
              <VideoInfo views={video.views} createdAt={video.createdAt} />
              <UserName name={user.name ?? ""} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const VideoTitle = ({
  title,
  limitHeight,
  limitSize,
}: {
  title: string;
  limitHeight?: boolean;
  limitSize?: boolean;
}) => {
  return (
    <h1
      className={`max-w-md font-semibold leading-6 text-gray-900 group-hover:text-gray-600 ${
        limitSize ? "text-base" : "text-lg"
      } ${limitHeight ? "max-h-12 w-full overflow-hidden" : ""}`}
    >
      {title}
    </h1>
  );
};

export const VideoDescription = ({ description }: { description: string }) => {
  return (
    <p className="mt-2 h-5 max-w-md overflow-hidden text-sm leading-6 text-gray-600">
      {description}
    </p>
  );
};

export const VideoInfo = ({
  views,
  createdAt,
}: {
  createdAt: Date | string;
  views: number;
}) => {
  return (
    <div className="mt-1 flex max-h-6 items-start overflow-hidden text-sm">
      <p className=" text-gray-600">
        {views}
        <span> Views</span>
      </p>
      <li className="pl-2 text-sm text-gray-500"></li>
      <p className=" text-gray-600">{moment(createdAt).fromNow()}</p>
    </div>
  );
};

export const UserImage = ({
  image,
  className = "",
}: {
  image: string;
  className?: string;
}) => {
  return (
    <div className={`relative aspect-square h-10 w-10 ${className}`}>
      <Image
        src={image || "/profile.jpg"}
        alt=""
        className="absolute rounded-full"
        fill
      />
    </div>
  );
};

export const UserName = ({ name }: { name: string }) => {
  return (
    <p className="max-h-6 overflow-hidden text-sm font-semibold leading-6 text-gray-900">
      {name}
    </p>
  );
};
