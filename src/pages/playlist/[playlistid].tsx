import { api } from "@/utils/api";
import { assertString } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import NotAvailable from "@/components/ErrorMessage/NotAvailable";
import LoadingMessage from "@/components/Loading/Loading";
import PlaylistCard from "@/components/Playlist/PlaylistCard";
import VideoGrid from "@/components/Video/VideoGrid";

const Playlist = () => {
  const router = useRouter();
  const playlistId = router.query?.playlistId ?? "";
  const { data: sessionData } = useSession();

  assertString(playlistId);
  console.log(router.query);
  const { data, isLoading, error, refetch } =
    api.playlist.getVideosByPlaylistId.useQuery({
      playlistId,
    });

  if (isLoading) return <LoadingMessage />;
  if (!(!error && data))
    return (
      <div className="flex h-full w-full items-center justify-center">
        <NotAvailable variant="playlist" />
      </div>
    );

  const listData = {
    videos: data.videos.map(({ user, ...video }) => video),
    users: data.videos.map(({ user }) => user),
  };
  return (
    <div className="flex w-full flex-row flex-wrap gap-10 overflow-y-scroll p-10">
      <div className="flex flex-1 basis-[400px]">
        {data.videos[0] && (
          <PlaylistCard
            playlist={data.playlist}
            video={data.videos[0]}
            variant="poster"
          />
        )}
      </div>
      <div className="flex flex-1 basis-[400px] content-start rounded-2xl border p-4">
        <VideoGrid data={listData} variant="aside" />
      </div>
    </div>
  );
};

export default Playlist;
