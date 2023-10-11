import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import LoadingMessage from "@/components/Loading/Loading";
import VideoGrid from "@/components/Video/VideoGrid";
import { api } from "@/utils/api";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("q") ?? "";

  const { data, isLoading, refetch, error } =
    api.video.getVideoByKeyword.useQuery(search);

  const Message = () => {
    if (isLoading) return <LoadingMessage />;
    if (!data || data.videos.length === 0)
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
  return data?.videos && data?.users && data.videos.length !== 0 ? (
    <div className="p-8">
      <h2 className="text-lg font-bold">
        Search results for &quot;
        <span className="text-2xl text-primary-800">{search}</span>&quot;
      </h2>
      <VideoGrid data={data} />
    </div>
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <Message />
    </div>
  );
};

export default SearchPage;
