import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NotAvailable from "@/components/ErrorMessage/NotAvailable";
import ClockRewind from "@/components/Icons/ClockRewind";
import LoadingMessage from "@/components/Loading/Loading";
import VideoGrid from "@/components/Video/VideoGrid";
import { api } from "@/utils/api";
import { assertString } from "@/utils/helpers";
import { useSession } from "next-auth/react";

const History = () => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id ?? "";

  assertString(userId);

  const { data, isLoading, error, refetch } =
    api.playlist.getPlaylistsById.useQuery({
      userId,
      isHistory: true,
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
      {data && data.playlistData.length > 0 ? (
        <div className="flex w-full flex-col p-6">
          {data.playlistData.map(({ playlist, videos, users }) => {
            return (
              <section key={playlist.id} className="mb-4 ">
                <h2 className="pl-8 text-xl font-semibold -mb-6">
                  <ClockRewind className="mr-2 inline h-5 w-5 shrink-0 stroke-gray-900" />
                  {playlist.title}
                </h2>
                <VideoGrid data={{ videos, users }} />
              </section>
            );
          })}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <NotAvailable variant="history" />
        </div>
      )}
    </div>
  );
};

export default History;
