import { cx } from "@/utils/helpers";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../Buttons";
import Search from "../Icons/Search";

interface PlaylistCardProps {
  video: {
    id: string;
    title: string | null;
    thumbnailUrl: string | null;
    description: string | null;
    videoUrl: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    publish: boolean;
  };
  playlist: {
    id: string;
    title: string;
    description: string | null;
    count: number;
  };
  variant?: "poster" | "link";
}

const PlaylistCard = ({
  video,
  playlist,
  variant = "link",
}: PlaylistCardProps) => {
  if (variant === "link")
    return (
      <Link
        href={`/playlist/${playlist.id}`}
        className={cx(["flex flex-col items-start hover:bg-gray-100"])}
      >
        <div className="group relative w-full">
          <Image
            alt=""
            src={video.thumbnailUrl ?? ""}
            width={400}
            height={200}
            className="aspect-video w-full  rounded-xl object-cover"
          />
          <div className="absolute bottom-0 flex w-full justify-between rounded-b-xl bg-gray-500/50 p-4 text-white backdrop-blur-lg group-hover:h-full group-hover:rounded-xl">
            <div className="py-1 text-xl font-semibold">Playlist</div>
            <div>{playlist.count} videos</div>
          </div>
          <Button
            className="absolute bottom-1/2 left-1/2 hidden -translate-x-1/2 translate-y-1/2 items-center px-6 py-4 group-hover:flex"
            variant="primary"
            size="2xl"
            href={`/playlist/${playlist.id}`}
          >
            <Search className="mr-2 h-6 w-6" />
            View Playlist
          </Button>
        </div>

        <h2 className="py-1 text-2xl font-semibold">{playlist.title}</h2>
        <p>{playlist.description}</p>
      </Link>
    );
  return (
    <div className={cx(["flex flex-1 flex-col items-start"])}>
      <div className="relative w-full">
        <Image
          alt=""
          src={video.thumbnailUrl ?? ""}
          width={400}
          height={200}
          className="aspect-video w-full  rounded-xl object-cover"
        />
        <div className="absolute bottom-0 flex w-full justify-between rounded-b-xl bg-gray-500/50 p-4 text-white backdrop-blur-lg">
          <div className="py-1 text-xl font-semibold">Playlist</div>
          <div>{playlist.count} videos</div>
        </div>
      </div>

      <h2 className="py-1 text-2xl font-semibold">{playlist.title}</h2>
      <p>{playlist.description}</p>
    </div>
  );
};

export default PlaylistCard;
