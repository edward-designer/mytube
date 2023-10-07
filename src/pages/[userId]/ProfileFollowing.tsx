import FollowButton from "@/components/Buttons/FolllowButton";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NoVideosUploaded from "@/components/ErrorMessage/NotAvailable";
import LoadingMessage from "@/components/Loading/Loading";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import UserCard from "@/components/Video/UserCard";
import VideoGrid from "@/components/Video/VideoGrid";
import { api } from "@/utils/api";
import { assertString } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const ProfileFollowing = () => {
  const router = useRouter();
  const userId = router.query?.userId ?? "";

  const { data: sessionData } = useSession();
  const viewerId = sessionData?.user.id ?? "";

  assertString(userId);

  const { data, isLoading, error, refetch } =
    api.user.getFollowingById.useQuery({
      userId,
      viewerId,
    });

  if (isLoading) return <LoadingMessage />;
  if (!(!error && data))
    return (
      <ErrorMessage
        icon="GreenPeople"
        message="Error Getting Following List"
        description="Sorry the requested profile cannot be found."
      />
    );

  return (
    <div className="flex w-full flex-col">
      <ProfileHeader />

      {data.followingUsers.length > 0 ? (
        <div className="-mt-8 flex flex-col">
          {data.followingUsers.map(
            ({
              id,
              name,
              image,
              handle,
              email,
              followers,
              viewerHasFollowed,
            }) => (
              <div
                key={id}
                className="flex flex-row justify-between border-b p-6 pl-8"
              >
                <UserCard
                  userId={id}
                  userImage={image ?? ""}
                  userName={name}
                  userHandle={handle}
                  userEmail={email}
                  followers={followers}
                />
                <FollowButton
                  followingId={id}
                  viewer={{ hasFollowed: viewerHasFollowed }}
                  refetch={refetch}
                />
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <NoVideosUploaded variant="following" />
        </div>
      )}
    </div>
  );
};

export default ProfileFollowing;
