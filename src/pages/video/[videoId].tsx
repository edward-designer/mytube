import { type NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import ReactPlayer from "react-player";

import { api } from "@/utils/api";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import LoadingMessage from "@/components/Loading/Loading";
import RecommendedVideos from "@/components/Video/RecommendedVideos";
import {
  UserName,
  VideoDescription,
  VideoInfo,
  VideoTitle,
} from "@/components/Video/VideoGrid";
import Link from "next/link";
import UserImage from "@/components/Video/UserImage";

const VideoPage: NextPage = () => {
  const router = useRouter();
  const { videoId } = router.query;
  const { data: sessionData } = useSession();
  const viewerId = sessionData?.user?.id ?? "";

  const {
    data: videoData,
    isLoading: videoLoading,
    error: videoError,
    refetch: refetchVideoData,
  } = api.video.getVideoById.useQuery({ id: videoId as string, viewerId });

  if (videoLoading) return <LoadingMessage />;
  if (
    !(
      typeof videoId === "string" &&
      typeof viewerId === "string" &&
      !videoError
    )
  )
    return (
      <ErrorMessage
        icon="GreenPlay"
        message="Error Getting Video"
        description="Sorry the requested video cannot be found."
      />
    );

  const videoURL = videoData?.video.videoUrl ?? "";
  const { video, user } = videoData;

  return (
    <>
      <Head>
        <title>{videoData?.video.title ?? "Video"}</title>
        <meta name="description" content={video.description ?? ""} />
      </Head>
      <section className="flex w-full flex-wrap content-start gap-8 p-6 lg:p-12">
        <div className="flex-1 grow-[3] basis-[640px]">
          <ReactPlayer
            url={videoURL}
            controls={true}
            playing={true}
            style={{ borderRadius: "1em", overflow: "hidden" }}
            width="100%"
            height="auto"
          />
          <div className="mt-4 flex space-x-3 rounded-2xl border border-gray-200 p-4 shadow-sm">
            <div className="min-w-0 flex-1 space-y-3 ">
              <div className="xs:flex-wrap flex flex-row justify-between gap-4 max-md:flex-wrap">
                <div className="flex flex-col items-start justify-center gap-1 self-stretch ">
                  <VideoTitle title={video.title ?? ""} />
                  <VideoInfo views={video.views} createdAt={video.createdAt} />
                </div>
                <div className="flex-inline flex items-end justify-start  gap-4 self-start  "></div>
              </div>

              <div className="flex flex-row  place-content-between gap-x-4 ">
                <Link
                  href={`/${video.userId}/ProfileVideos`}
                  key={video.userId}
                >
                  <div className="flex flex-row gap-2">
                    <UserImage image={user.image ?? ""} />
                    <button className="flex flex-col">
                      <UserName name={user.name ?? ""} />
                      <p className=" text-sm text-gray-600">
                        {user.followers}
                        <span> Followers</span>
                      </p>
                    </button>
                  </div>
                </Link>
              </div>
              <VideoDescription description={video.description ?? ""} />
            </div>
          </div>
        </div>
        <aside className="flex-1 basis-96">
          <RecommendedVideos />
        </aside>
      </section>
    </>
  );
};

export default VideoPage;
