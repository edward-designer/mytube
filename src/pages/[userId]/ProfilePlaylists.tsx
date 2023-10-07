import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Lottie from "react-lottie-player";

import { api } from "@/utils/api";
import { assertString } from "@/utils/helpers";

import { Button } from "@/components";
import NotAvailable from "@/components/ErrorMessage/NotAvailable";
import LoadingMessage from "@/components/Loading/Loading";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import VideoGrid from "@/components/Video/VideoGrid";
import PlaylistCard from "@/components/Playlist/PlaylistCard";

import Folder from "@/components/Icons/Folder";
import List from "@/components/Icons/list.json";

const ProfilePlaylists = () => {
  const router = useRouter();
  const userId = router.query?.userId ?? "";
  const { data: sessionData } = useSession();

  const [isExpanded, setIsExpanded] = useState(true);

  let isOwnProfilePage = false;
  assertString(userId);

  if (userId === sessionData?.user.id) {
    isOwnProfilePage = true;
  }

  const { data, isLoading, error, refetch } =
    api.playlist.getPlaylistsById.useQuery({
      userId,
      isExpanded,
    });

  if (isLoading) return <LoadingMessage />;
  if (!(!error && data))
    return (
      <div className="flex h-full w-full items-center justify-center">
        <NotAvailable variant="playlist" />
      </div>
    );

  return (
    <div className="flex w-full flex-col">
      <ProfileHeader />
      <div className="px-8">
        <Button
          variant="secondary-gray"
          className="aspect-square rounded-l-lg rounded-r-none"
          disabled={isExpanded}
          onClick={() => setIsExpanded(true)}
        >
          <span className="sr-only">Expanded</span>
          <Lottie
            animationData={List}
            play={false}
            loop={false}
            className="h-8 w-8"
            goTo={30}
          />
        </Button>
        <Button
          variant="secondary-gray"
          className="aspect-square rounded-l-none rounded-r-lg"
          disabled={!isExpanded}
          onClick={() => setIsExpanded(false)}
        >
          <Lottie
            animationData={List}
            play={false}
            loop={false}
            className="h-8 w-8"
            goTo={0}
          />
          <span className="sr-only">Condensed</span>
        </Button>
      </div>
      {isExpanded ? (
        <div className="flex w-full flex-col p-6">
          {data.playlistData.map(({ playlist, videos, users }) => {
            return (
              <section
                key={playlist.id}
                className="mb-4 max-h-[350px] overflow-hidden border-b pb-4"
              >
                <h2 className="-mb-6 pl-8 text-xl font-semibold">
                  <Link href={`/playlist/${playlist.id}`}>
                    <Folder className="mr-2 inline h-5 w-5 shrink-0 stroke-gray-900" />{" "}
                    {playlist.title}
                  </Link>
                </h2>
                {videos !== undefined && users !== undefined && (
                  <VideoGrid data={{ videos, users }} />
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 gap-y-10 p-8 md:grid-cols-2 2xl:grid-cols-3">
          {data.playlistData.map(({ playlist, videos }) => {
            if (videos[0] !== undefined && playlist !== undefined)
              return (
                <PlaylistCard
                  key={playlist.id}
                  video={videos[0]}
                  playlist={playlist}
                />
              );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfilePlaylists;
