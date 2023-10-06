import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { api } from "@/utils/api";

import { assertString } from "@/utils/helpers";

import LoadingMessage from "../Loading/Loading";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import UserImage from "../Video/UserImage";
import { Button } from "../Buttons";
import Edit from "../Icons/Edit";

import FollowButton from "../Buttons/FolllowButton";
import ProfileTabs from "./ProfileTabs";

const ProfileHeader = () => {
  const router = useRouter();
  const userId = router.query?.userId ?? "";
  const { data: sessionData } = useSession();

  let isOwnProfilePage = false;
  assertString(userId);

  if (userId === sessionData?.user.id) {
    isOwnProfilePage = true;
  }

  const { data, isLoading, error, refetch } = api.user.getChannelById.useQuery({
    id: userId,
    viewerId: sessionData?.user.id ?? "",
  });

  if (isLoading) return <LoadingMessage />;
  if (!(!error && data))
    return (
      <ErrorMessage
        icon="GreenPeople"
        message="Error Getting Profile"
        description="Sorry the requested profile cannot be found."
      />
    );

  const { user: channel, viewer } = data;

  const profileTabsProps = {
    userId,
    router,
  };

  return (
    <>
      <Head>
        <title>Export {channel.name ?? "Video"} Channel</title>
        <meta name="description" content={channel.description ?? ""} />
      </Head>
      <div className="flex w-full flex-col">
        <Image
          className="h-32 w-full object-cover lg:h-64"
          src={channel.backgroundImage ?? "/background.jpg"}
          width={2000}
          height={2000}
          alt="error"
        />
        <div className="mx-auto w-full  px-4 sm:px-6 lg:px-8">
          <div className="!-mt-6 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <UserImage
                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                image={channel.image ?? ""}
              />
            </div>
            <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="sm: mt-6 min-w-0 flex-1 md:block">
                <h1 className="truncate text-2xl font-bold text-gray-900">
                  {channel.name}
                </h1>
                <p className="text-regular text-gray-600">{channel.handle}</p>
                <div className="mt-1 flex items-start text-xs">
                  <p className="text-sm text-gray-600">
                    {channel.followerCount} Followers
                  </p>
                  <li className="pl-2 text-sm text-gray-500"></li>
                  <p className="text-sm text-gray-600">
                    {channel.followingCount} Following
                  </p>
                </div>
              </div>
              <div className=" mt-6 flex justify-stretch space-y-3 sm:space-x-4 sm:space-y-0">
                {userId == sessionData?.user.id ? (
                  <Button
                    variant="primary"
                    size="2xl"
                    href="/Settings"
                    className="!-5 ml-2 flex"
                  >
                    <Edit className="mr-2 h-5 w-5 shrink-0 stroke-white" />
                    Edit
                  </Button>
                ) : (
                  <FollowButton
                    followingId={userId}
                    viewer={viewer}
                    refetch={refetch}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <ProfileTabs {...profileTabsProps} />
      </div>
    </>
  );
};

export default ProfileHeader;
