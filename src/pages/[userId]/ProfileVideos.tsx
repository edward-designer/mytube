import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NoVideosUploaded from "@/components/ErrorMessage/NotAvailable";
import LoadingMessage from "@/components/Loading/Loading";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import VideoGrid from "@/components/Video/VideoGrid";
import { api } from "@/utils/api";
import { assertString } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const ProfileVideos = () => {
  const router = useRouter();
  const userId = router.query?.userId ?? "";
  const { data: sessionData } = useSession();

  let isOwnProfilePage = false;
  assertString(userId);

  if (userId === sessionData?.user.id) {
    isOwnProfilePage = true;
  }

  const { data, isLoading, error } = api.video.getVideosByUploader.useQuery({
    userId,
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
      <ProfileHeader />

      {data.videos.length > 0 ? (
        <VideoGrid data={data} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <NoVideosUploaded userId={isOwnProfilePage ? userId : undefined} />
        </div>
      )}
    </div>
  );
};

export default ProfileVideos;
