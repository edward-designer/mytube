import Link from "next/link";
import { Thumbnail } from "./Thumbnail";
import Image from "next/image";
import moment from "moment";
import { cx } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "../Icons/Chevron";
import { Button } from "../Buttons";

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
    <div className="w-full">
      <div
        className={cx([
          "w-full gap-8",
          variant === "aside" ? "grid grid-cols-1 gap-y-4" : "",
          variant === "home"
            ? "grid grid-cols-1 gap-y-12 p-12 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            : "",
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
        "flex flex-col items-start hover:bg-gray-100",
        variant === "home" ? "flex-1 lg:basis-1/4" : "",
        variant === "aside" ? "flex-1 basis-full" : "",
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
      className={`font-semibold leading-6 text-gray-900 group-hover:text-gray-600 ${
        limitSize ? "text-base" : "text-lg"
      } ${
        limitHeight
          ? "line-clamp-2 max-h-12 w-full max-w-md overflow-hidden"
          : ""
      }`}
    >
      {title}
    </h1>
  );
};

export const VideoDescription = ({
  description,
  linesToShow = 3,
}: {
  description: string;
  linesToShow?: number;
}) => {
  const divRef = useRef<null | HTMLParagraphElement>(null);
  const [isAllVisible, setIsAllVisible] = useState(false);

  const maxHeight = (linesToShow ?? 5) * 1.7;

  useEffect(() => {
    if (!divRef.current) return;
    if (divRef.current.clientHeight < divRef.current.scrollHeight) {
      setIsAllVisible(false);
    } else {
      setIsAllVisible(true);
    }
  }, [linesToShow]);

  return (
    <div
      ref={divRef}
      className="relative mt-2
        overflow-hidden pb-[3em] text-sm leading-6 text-gray-600"
      style={{
        maxHeight: isAllVisible
          ? divRef.current?.scrollHeight
          : `${maxHeight}em`,
        transition: "max-height 0.5s cubic-bezier(0, 1, 0, 1)",
      }}
    >
      {description}

      <div
        aria-hidden={true}
        className={cx([
          "absolute bottom-0 flex h-[4em] w-full items-end justify-center bg-gradient-to-t  to-transparent text-center",
          !isAllVisible ? "from-white" : "from-transparent",
        ])}
      >
        <Button
          variant="tertiary-gray"
          onClick={() => setIsAllVisible(!isAllVisible)}
          className={`transition-all ${
            !isAllVisible ? "rotate-0" : "rotate-180"
          }`}
        >
          <ChevronDown />
          <span className="sr-only">
            {isAllVisible ? "Show Less" : "Show More"}
          </span>
        </Button>
      </div>
    </div>
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
