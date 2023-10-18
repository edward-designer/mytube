import { cx } from "@/utils/helpers";
import { VideoCard } from "./VideoCard";
import { SkeletonVideoCard } from "./SkeletonVideoCard";

export interface Video {
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

export interface User {
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
  cardsOnly?: boolean;
}

const VideoGrid = ({
  data,
  variant = "home",
  isLoading = false,
  cardsOnly = false,
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
    return !cardsOnly ? (
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
              priority={index <= 9}
            />
          );
        })}
        {/* hack to prevent the last odd element to grow to full width */}
        {videosToShow.length % 2 !== 0 && <i className="h-0 grow-[100000]" />}
      </div>
    ) : (
      <>
        {videosToShow.map((video, index) => {
          const user = users[index];
          if (video === undefined || user === undefined) return;
          return (
            <VideoCard
              key={video.id}
              video={video}
              user={user}
              variant={variant}
              priority={index <= 9}
            />
          );
        })}
        {/* hack to prevent the last odd element to grow to full width */}
        {videosToShow.length % 2 !== 0 && <i className="h-0 grow-[100000]" />}
      </>
    );
  }
};

export default VideoGrid;
