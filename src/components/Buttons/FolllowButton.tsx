import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { UserPlus } from "@/components/Icons/Icons";
import { cx } from "@/utils/helpers";

import Button from "./Button";

interface FollowButton {
  followingId: string;
  hideIcon?: boolean;
  viewer: {
    hasFollowed: boolean;
  };
  refetch: () => Promise<unknown>;
}
export default function FollowButton({
  followingId,
  hideIcon,
  viewer,
  refetch,
}: FollowButton) {
  const { data: sessionData } = useSession();
  const [userChoice, setUserChoice] = useState({
    following: viewer.hasFollowed,
  });
  const addFollowMutation = api.user.addFollow.useMutation();
  const handleFollow = (input: { followingId: string; followerId: string }) => {
    if (userChoice.following) {
      setUserChoice({ following: false });
    } else {
      setUserChoice({ following: true });
    }
    addFollowMutation.mutate(input, {
      onSuccess: () => {
        void refetch();
      },
    });
  };
  return (
    <>
      <Button
        variant={userChoice.following ? "secondary-gray" : "primary"}
        size="xl"
        onClick={
          sessionData
            ? () =>
                handleFollow({
                  followingId: followingId ? followingId : "",
                  followerId: sessionData ? sessionData.user.id : "",
                })
            : () => void signIn()
        }
        className="flex rounded-lg"
      >
        <UserPlus
          className={cx([
            hideIcon
              ? "hidden"
              : `mr-2 h-5 w-5 shrink-0
              ${userChoice.following ? "stroke-gray-400 " : "stroke-white "}
              `,
          ])}
        />
        {userChoice.following ? "Following" : "Follow"}
      </Button>
    </>
  );
}
