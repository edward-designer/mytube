import AnnouncementCard from "@/components/Announcement/AnnouncementCard";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NoVideosUploaded from "@/components/ErrorMessage/NotAvailable";
import InputBox from "@/components/Input/InputBox";
import LoadingMessage from "@/components/Loading/Loading";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import { api } from "@/utils/api";
import { assertString } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const ProfileAnnouncement = () => {
  const router = useRouter();
  const userId = router.query?.userId ?? "";

  const { data: sessionData } = useSession();
  const viewerId = sessionData?.user.id ?? "";

  assertString(userId);

  const { data, isLoading, error, refetch } =
    api.announcement.allAnnouncements.useQuery({
      userId,
    });

  const addAnnouncementMutation =
    api.announcement.addAnnouncement.useMutation();
  const addAnnouncement = ({
    message,
    successHandler,
  }: {
    message: string;
    successHandler: () => void;
  }) => {
    const input = {
      userId: viewerId,
      message,
    };
    addAnnouncementMutation.mutate(input, {
      onSuccess: successHandler,
    });
  };

  if (isLoading) return <LoadingMessage />;
  if (!(!error && data))
    return (
      <ErrorMessage
        icon="GreenHorn"
        message="Error Getting Announcements"
        description="Sorry the requested announcements cannot be found."
      />
    );

  return (
    <div className="flex w-full flex-col">
      <ProfileHeader />
      {viewerId === userId && (
        <div className="mx-8 m-4 ">
          <InputBox
            addHandler={addAnnouncement}
            refetch={refetch}
            placeholderText="Announcement"
          />
        </div>
      )}
      {data.length > 0 ? (
        <div className="-mt-8 flex flex-col p-8">
          {data.map(({ user, ...message }) => (
            <AnnouncementCard
              user={user}
              announcement={message}
              key={message.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <NoVideosUploaded variant="announcement" />
        </div>
      )}
    </div>
  );
};

export default ProfileAnnouncement;
