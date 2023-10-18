import { api } from "@/utils/api";
import { useEffect } from "react";
import VideoGrid from "./VideoGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useRouter } from "next/router";
import { assertString } from "@/utils/helpers";
import { AsidePlaceholder } from "../Loading/VideoLoadingPlaceholder";

const RecommendedVideos = () => {
  const router = useRouter();
  const { videoId } = router.query;
  assertString(videoId);

  const { data, isLoading, isFetching, error, refetch } =
    api.video.getRandomVideos.useQuery(
      { limit: 12, excludeId: videoId, cursor: 1 },
      {
        enabled: false,
      },
    );

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
        <div className="flex h-full w-full place-content-center">
          <div className="flex w-full flex-wrap content-start gap-8 gap-y-4 [&>*]:flex-1 [&>*]:basis-[350px]">
            <AsidePlaceholder />
            <AsidePlaceholder />
            <AsidePlaceholder />
            <AsidePlaceholder />
            <AsidePlaceholder />
            <AsidePlaceholder />
            <AsidePlaceholder />
            <AsidePlaceholder />
          </div>
        </div>
      ) : (
        <VideoGrid data={data} variant="aside" />
      )}
    </div>
  );
};

export default RecommendedVideos;
