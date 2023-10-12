import Link from "next/link";
import { Thumbnail } from "./Thumbnail";
import Image from "next/image";
import moment from "moment";
import { cx } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "../Icons/Chevron";
import { Button } from "../Buttons";

interface Video {
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

interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  backgroundImage: string | null;
  handle: string | null;
  description: string | null;
}

interface VideoGridProps {
  data?: {
    videos: (Video | undefined)[];
    users: (User | undefined)[];
  };
  variant?: string;
  isLoading?: boolean;
}

const VideoGrid = ({
  data,
  variant = "home",
  isLoading = false,
}: VideoGridProps) => {
  if (isLoading) {
    return (
      <div
        className={cx([
          "w-full content-start gap-8",
          variant === "aside"
            ? "flex flex-wrap content-start gap-y-4 [&>*]:flex-1 [&>*]:basis-[350px]"
            : "",
          variant === "home"
            ? "grid grid-cols-1 gap-y-6 p-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-12 lg:p-12 2xl:grid-cols-4"
            : "",
        ])}
      >
        {[...Array(12).keys()].map((i) => (
          <SkeletonVideoCard key={i} />
        ))}
      </div>
    );
  }
  if (data) {
    const { videos, users } = data;
    const videosToShow = videos.filter((video) => Boolean);
    return (
      <div
        className={cx([
          "w-full content-start gap-8",
          variant === "aside"
            ? "flex flex-wrap content-start gap-y-4 [&>*]:flex-1 [&>*]:basis-[350px]"
            : "",
          variant === "home"
            ? "grid grid-cols-1 gap-y-6 p-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-12 lg:p-12 2xl:grid-cols-4"
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
        {/* hack to prevent the last odd element to grow to full width */}
        {videosToShow.length % 2 !== 0 && <i className="h-0 grow-[100000]" />}
      </div>
    );
  }
};

export default VideoGrid;

const SkeletonVideoCard = () => (
  <div className="flex flex-1 flex-col items-start hover:bg-gray-100 lg:basis-1/4">
    <div className="relative w-full">
      <div className="w-full">
        <div className="relative inset-0 h-0 w-full animate-pulse rounded-xl  bg-slate-200 pb-[50%]"></div>
      </div>
      <div className="-mt-3 max-w-xl lg:mt-0">
        <div className="items-top  relative mt-4 flex gap-x-4">
          <div className="relative aspect-square h-10 w-10 animate-pulse rounded-full  bg-slate-200"></div>
          <div className="w-full">
            <h1 className="line-clamp-2 max-h-12 w-full  max-w-md animate-pulse overflow-hidden bg-slate-200 text-base font-semibold leading-4 text-gray-900 group-hover:text-gray-600 lg:leading-6">
              &nbsp;
            </h1>
            <div className="mt-1 flex max-h-6 items-start overflow-hidden text-sm">
              <p className="animate-pulse  bg-slate-200 text-gray-600">
                &nbsp;<span> &nbsp;</span>
              </p>
              <li className="animate-pulse pl-2 text-sm text-slate-200"></li>
              <p className="w-full animate-pulse bg-slate-200 text-gray-600">
                &nbsp;
              </p>
            </div>
            <p className=" max-h-6 overflow-hidden text-left text-sm font-semibold leading-6 text-gray-900">
              &nbsp;
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const VideoCard = ({
  video,
  user,
  variant,
}: {
  video: Video;
  user: User;
  variant: string;
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
          <Thumbnail thumbnailUrl={video.thumbnailUrl ?? ""} />
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
      className={`font-semibold leading-4 text-gray-900 group-hover:text-gray-600 lg:leading-6 ${
        limitSize ? "text-base" : "text-base lg:text-lg"
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
  const [alreadyAllShow, setAlreadyAllShow] = useState(false);
  const maxHeight = (linesToShow ?? 5) * 1.7;

  useEffect(() => {
    if (!divRef.current) return;
    if (divRef.current.clientHeight < divRef.current.scrollHeight) {
      setAlreadyAllShow(false);
    } else {
      setAlreadyAllShow(true);
    }
  }, [linesToShow, description]);

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
          alreadyAllShow ? "hidden" : "",
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
    <p className=" max-h-6 overflow-hidden text-left text-sm font-semibold leading-6 text-gray-900">
      {name}
    </p>
  );
};
