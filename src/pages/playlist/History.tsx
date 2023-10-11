import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NotAvailable from "@/components/ErrorMessage/NotAvailable";
import ClockRewind from "@/components/Icons/ClockRewind";
import LoadingMessage from "@/components/Loading/Loading";
import VideoGrid from "@/components/Video/VideoGrid";
import { api } from "@/utils/api";
import { assertString } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";

const History = () => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id ?? "";

  assertString(userId);

  const { data, isLoading, isFetching, error, refetch } =
    api.user.getVideosHistoryById.useQuery(
      {
        userId,
      },
      { enabled: false },
    );

  useEffect(() => {
    if (userId) void refetch();
  }, [userId]);

  if (isLoading && isFetching) return <LoadingMessage />;
  if (!(!error && data))
    return (
      <ErrorMessage
        icon="GreenPlay"
        message="Error Getting Profile"
        description="Sorry the requested profile cannot be found."
      />
    );

  const videos = data.videosWithCounts.map(({ user, ...video }) => video);
  const users = data.videosWithCounts.map(({ user }) => user);
  return (
    <>
      <Head>
        <title>History</title>
      </Head>
      <div className="flex w-full flex-col">
        {data && data.videosWithCounts.length > 0 ? (
          <div className="flex w-full flex-col p-6">
            <section className="mb-4 ">
              <h2 className="-mb-6 pl-8 text-xl font-semibold">
                <ClockRewind className="mr-2 inline h-5 w-5 shrink-0 stroke-gray-900" />
                History
              </h2>
              <VideoGrid data={{ videos, users }} />
            </section>
          </div>
        ) : (
          <div className="-mt-16 flex flex-1 self-center">
            <NotAvailable variant="history" />
          </div>
        )}
      </div>
    </>
  );
};

export default History;
