import { useEffect, useRef } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

import ReactPlayer from "react-player";

import { api } from "@/utils/api";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import RecommendedVideos from "@/components/Video/RecommendedVideos";
import { VideoDescription } from "@/components/Video/VideoDescription";
import { VideoInfo } from "@/components/Video/VideoInfo";
import { VideoTitle } from "@/components/Video/VideoTitle";
import { assertString } from "@/utils/helpers";
import FollowButton from "@/components/Buttons/FolllowButton";
import LikeButton from "@/components/Buttons/LikeButton";
import Comments from "@/components/Comment/Comments";
import SaveButton from "@/components/Buttons/SaveButton";
import UserCard from "@/components/Video/UserCard";
import VideoLoadingPlaceholder from "@/components/Loading/VideoLoadingPlaceholder";

const VideoPage: NextPage = () => {
  const router = useRouter();
  const videoId = router.query?.videoId ?? "";
  const { data: sessionData } = useSession();
  const viewerId = sessionData?.user?.id ?? "";
  const playerRef = useRef<null | HTMLElement>(null);
  assertString(videoId);

  const {
    data: videoData,
    isLoading,
    error,
    refetch,
  } = api.video.getVideoById.useQuery(
    { id: videoId, viewerId },
    {
      enabled: false,
      onSuccess: () => {
        addView({
          id: videoId,
          userId: viewerId,
        });
      },
    },
  );

  const addViewMutation = api.videoEngagement.addViewCount.useMutation();
  const addView = (input: { id: string; userId: string }) => {
    addViewMutation.mutate(input);
  };

  useEffect(() => {
    if (videoId !== "") void refetch();
  }, [videoId, viewerId]);

  useEffect(() => {
    if (playerRef.current) playerRef.current.scrollIntoView();
  }, [videoId]);

  if (isLoading) return <VideoLoadingPlaceholder />;
  if (
    !(
      typeof videoId === "string" &&
      typeof viewerId === "string" &&
      !error &&
      videoData?.video &&
      videoData?.viewer
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
  const { video, user, viewer } = videoData;

  return (
    <>
      <Head>
        <title>{videoData?.video.title ?? "Video"}</title>
        <meta name="description" content={video.description ?? ""} />
      </Head>
      <section
        ref={playerRef}
        className="flex w-full flex-wrap content-start gap-8 overflow-y-auto p-6 lg:p-12"
      >
        <div className="flex-1 grow-[3] basis-[640px]">
          <ReactPlayer
            url={videoURL}
            controls={true}
            playing={true}
            style={{ borderRadius: "1em", overflow: "hidden" }}
            width="100%"
            height="auto"
            muted={true}
          />
          <div className="mt-4 flex space-x-3 rounded-2xl border border-gray-200 p-4 shadow-sm">
            <div className="min-w-0 flex-1 space-y-3 ">
              <div className="xs:flex-wrap flex flex-row justify-between gap-4 max-md:flex-wrap">
                <div className="flex flex-col items-start justify-center gap-1 self-stretch ">
                  <VideoTitle
                    title={video.title ?? ""}
                    limitHeight={false}
                    limitSize={false}
                  />
                  <VideoInfo views={video.views} createdAt={video.createdAt} />
                </div>
                <div className="flex-inline flex items-end justify-start self-start">
                  <LikeButton
                    videoId={video.id}
                    engagement={{
                      likes: video.likes,
                      dislikes: video.dislikes,
                    }}
                    viewer={{
                      hasLiked: viewer.hasLiked,
                      hasDisliked: viewer.hasDisliked,
                    }}
                  />
                  <SaveButton videoId={videoId} hasSaved={viewer.hasSaved} />
                </div>
              </div>

              <div className="flex flex-row place-content-between items-center gap-x-4 ">
                <UserCard
                  userId={video.userId}
                  userName={user.name}
                  userImage={user.image ?? ""}
                  followers={user.followers}
                  userHandle={user.handle}
                  userEmail={user.email}
                />
                <FollowButton
                  followingId={video.userId}
                  viewer={{
                    hasFollowed: viewer.hasFollowed,
                  }}
                  refetch={refetch}
                />
              </div>
              <VideoDescription description={video.description ?? ""} />
            </div>
          </div>
          <Comments
            videoId={videoId}
            comments={videoData.comments}
            refetch={refetch}
          />
        </div>
        <aside className="flex-1 basis-96">
          <RecommendedVideos />
        </aside>
      </section>
    </>
  );
};

export default VideoPage;
