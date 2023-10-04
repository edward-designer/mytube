import { api } from "@/utils/api";
import { useEffect } from "react";
import VideoGrid from "./VideoGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import LoadingMessage from "../Loading/Loading";
import { useRouter } from "next/router";

const RecommendedVideos = () => {
  const router = useRouter();
  const { videoId } = router.query;
  const { data, isLoading, isFetching, error, refetch } =
    api.video.getRandomVideos.useQuery(10, {
      enabled: false,
    });

  useEffect(() => {
    void refetch();
  }, [videoId]);

  if (error)
    return (
      <div className="flex h-full w-full place-content-center">
        <ErrorMessage
          icon="GreenPlay"
          message="Error Getting Recommended Video"
          description="Sorry the requested videos cannot be found."
        />
      </div>
    );

  return (
    <div className="flex h-full w-full place-content-center">
      {isFetching || isLoading ? (
        <LoadingMessage />
      ) : (
        <VideoGrid data={data} variant="aside" />
      )}
    </div>
  );
};

export default RecommendedVideos;
