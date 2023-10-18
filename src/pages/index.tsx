import { type NextPage } from "next";

import { api } from "@/utils/api";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import VideoGrid from "@/components/Video/VideoGrid";
import { Fragment, useEffect, useRef } from "react";

const Home: NextPage = () => {
  const intersectionRef = useRef(null);
  const { data, isLoading, error, fetchNextPage, hasNextPage } =
    api.video.getRandomVideos.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => {
          if (lastPage.videos.length < 10) return;
          return lastPage.nextCursor;
        },
        initialCursor: 1,
      },
    );
  console.log(hasNextPage);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0]?.isIntersecting) void fetchNextPage();
      },
      { threshold: 1.0 },
    );
    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const Message = () => {
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

  return (
    <>
      {isLoading ? (
        <VideoGrid isLoading={isLoading} />
      ) : data?.pageParams ? (
        <div className="grid w-full grid-cols-1 content-start gap-8 gap-y-6 p-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-12 lg:p-12 2xl:grid-cols-4">
          {data.pages.map((p) => (
            <Fragment key={`${p.nextCursor}`}>
              {<VideoGrid cardsOnly={true} data={p} />}
            </Fragment>
          ))}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Message />
        </div>
      )}
      <div
        ref={intersectionRef}
        className={`${hasNextPage ? "" : "hidden"} mb-1 h-20 w-full`}
      />
    </>
  );
};

export default Home;
