import { type NextPage } from "next";

import { api } from "@/utils/api";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import VideoGrid from "@/components/Video/VideoGrid";
import { Fragment, useEffect, useRef } from "react";
import { Button } from "@/components";

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
        <div
          role="feed"
          aria-live="assertive"
          aria-label="A list of recommended videos"
          className="grid w-full grid-cols-1 content-start gap-8 gap-y-6 p-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-12 lg:p-12 2xl:grid-cols-4"
        >
          {data.pages.map((p, index) => (
            <Fragment key={`${p.nextCursor}`}>
              {
                <VideoGrid
                  cardsOnly={true}
                  data={p}
                  refocus={index === data.pages.length - 1 && index !== 0}
                />
              }
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
      >
        <Button
          variant="primary"
          className="sr-only"
          onClick={() => {
            void fetchNextPage();
          }}
        >
          Load more
        </Button>
      </div>
    </>
  );
};

export default Home;
