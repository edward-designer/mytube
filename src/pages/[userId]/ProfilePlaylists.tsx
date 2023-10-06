import { Button } from "@/components";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NotAvailable from "@/components/ErrorMessage/NotAvailable";
import Folder from "@/components/Icons/Folder";
import LoadingMessage from "@/components/Loading/Loading";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import VideoGrid from "@/components/Video/VideoGrid";
import { api } from "@/utils/api";
import { assertString } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Lottie from "react-lottie-player";

import List from "@/components/Icons/list.json";

const ProfilePlaylists = () => {
  const router = useRouter();
  const userId = router.query?.userId ?? "";
  const { data: sessionData } = useSession();

  const [isExpanded, setIsExpanded] = useState(false);

  let isOwnProfilePage = false;
  assertString(userId);

  if (userId === sessionData?.user.id) {
    isOwnProfilePage = true;
  }

  const { data, isLoading, error, refetch } =
    api.playlist.getPlaylistsById.useQuery({
      userId,
    });

  if (isLoading) return <LoadingMessage />;
  if (!(!error && data))
    return (
      <ErrorMessage
        icon="GreenPlay"
        message="Error Getting Profile"
        description="Sorry the requested profile cannot be found."
      />
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
          className="aspect-square rounded-r-lg rounded-l-none"
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
      {data ? (
        isExpanded ? (
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
                  <VideoGrid data={{ videos, users }} />
                </section>
              );
            })}
          </div>
        ) : (
          <div>hello</div>
        )
      ) : (
        <div className="flex h-full items-center justify-center">
          <NotAvailable
            variant="playlist"
            userId={isOwnProfilePage ? userId : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePlaylists;
