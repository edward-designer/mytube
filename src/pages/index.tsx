import { type NextPage } from "next";

import { api } from "@/utils/api";
import LoadingMessage from "@/components/Loading/Loading";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import VideoGrid from "@/components/Video/VideoGrid";

const Home: NextPage = () => {
  const { data, isLoading, error } = api.video.getRandomVideos.useQuery(40);

  const Message = () => {
    if (isLoading) return <LoadingMessage />;
    if (!data)
      return (
        <ErrorMessage
          icon="GreenPlay"
          message="No Videos"
          description="Sorry there are no videos to show at the moment."
        />
      );
    if (error)
      return (
        <ErrorMessage
          icon="GreenPlay"
          message="Error"
          description={error.message}
        />
      );
  };

  return data?.videos && data?.users ? (
    <VideoGrid data={data} />
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <Message />
    </div>
  );
};

export default Home;
