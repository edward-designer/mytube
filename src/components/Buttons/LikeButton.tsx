import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { api } from "@/utils/api";
import Lottie from "react-lottie-player";

import Like from "@/components/Icons/thumb-up.json";
import DisLike from "@/components/Icons/thumb-down.json";

import { ThumbsDown, ThumbsUp } from "@/components/Icons/Icons";
import { cx } from "@/utils/helpers";

import Button from "./Button";
import { EngagementType } from "@prisma/client";

interface LikeButton {
  videoId?: string;
  announcementId?: string;
  engagement: {
    likes: number;
    dislikes: number;
  };
  viewer: {
    hasLiked: boolean;
    hasDisliked: boolean;
  };
}
export default function LikeButton({
  videoId,
  engagement,
  announcementId,
  viewer,
}: LikeButton) {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id ?? "";

  const [userChoice, setUserChoice] = useState({
    userEngagement: viewer.hasLiked
      ? EngagementType.LIKE
      : viewer.hasDisliked
      ? EngagementType.DISLIKE
      : null,
    likes: engagement.likes,
    dislikes: engagement.dislikes,
  });
  const [clickLike, setClickLike] = useState(false);
  const [clickDislike, setClickDislike] = useState(false);

  const likeDislikeMutation = api.user.handleLikeDislike.useMutation();

  const handleLikeDislike = (input: {
    userId: string;
    videoId?: string;
    announcementId?: string;
    type: EngagementType;
  }) => {
    const nextUserChoice = { ...userChoice };
    if (
      input.type === EngagementType.LIKE &&
      userChoice.userEngagement === null
    ) {
      setClickLike(true);
      nextUserChoice.userEngagement = EngagementType.LIKE;
      nextUserChoice.likes = userChoice.likes + 1;
    }

    if (
      input.type === EngagementType.DISLIKE &&
      userChoice.userEngagement === null
    ) {
      setClickDislike(true);
      nextUserChoice.userEngagement = EngagementType.DISLIKE;
      nextUserChoice.dislikes = userChoice.dislikes + 1;
    }

    if (
      input.type === EngagementType.LIKE &&
      userChoice.userEngagement === EngagementType.LIKE
    ) {
      setClickLike(false);
      nextUserChoice.userEngagement = null;
      nextUserChoice.likes = userChoice.likes - 1;
    }

    if (
      input.type === EngagementType.LIKE &&
      userChoice.userEngagement === EngagementType.DISLIKE
    ) {
      setClickLike(true);
      setClickDislike(false);
      nextUserChoice.userEngagement = EngagementType.LIKE;
      nextUserChoice.likes = userChoice.likes + 1;
      nextUserChoice.dislikes = userChoice.dislikes - 1;
    }

    if (
      input.type === EngagementType.DISLIKE &&
      userChoice.userEngagement === EngagementType.DISLIKE
    ) {
      setClickDislike(false);
      nextUserChoice.userEngagement = null;
      nextUserChoice.dislikes = userChoice.dislikes - 1;
    }

    if (
      input.type === EngagementType.DISLIKE &&
      userChoice.userEngagement === EngagementType.LIKE
    ) {
      setClickDislike(true);
      setClickLike(false);
      nextUserChoice.userEngagement = EngagementType.DISLIKE;
      nextUserChoice.likes = userChoice.likes - 1;
      nextUserChoice.dislikes = userChoice.dislikes + 1;
    }

    setUserChoice(nextUserChoice);
    likeDislikeMutation.mutate(input);
  };
  if (!videoId && !announcementId) return;
  return (
    <>
      <Button
        variant={
          userChoice.userEngagement === EngagementType.LIKE
            ? "secondary-gray"
            : "tertiary-gray"
        }
        size="xl"
        onClick={
          sessionData
            ? () => {
                handleLikeDislike({
                  userId,
                  videoId,
                  announcementId,
                  type: EngagementType.LIKE,
                });
              }
            : () => void signIn()
        }
        className={cx([
          "group flex items-center rounded-none rounded-l-lg border bg-white !py-0 !ring-0 hover:bg-white hover:text-primary-700",
          userChoice.userEngagement === EngagementType.LIKE
            ? "bg-primary-50 text-primary-700"
            : "",
        ])}
      >
        <Lottie
          animationData={Like}
          play={clickLike}
          loop={false}
          className="h-8 w-8"
          goTo={0}
        />
        {/* <ThumbsUp
          className={cx([
            `mr-2 h-5 w-5 shrink-0`,
            userChoice.userEngagement === EngagementType.LIKE
              ? "stroke-primary-700 "
              : "stroke-gray-900 group-hover:stroke-primary-700",
          ])}
        /> */}
        <span className="sr-only">
          {userChoice.userEngagement === EngagementType.LIKE
            ? "Like"
            : "Cancel like"}
        </span>
        <span aria-label="number of likes">{userChoice.likes}</span>
      </Button>
      <Button
        variant={
          userChoice.userEngagement === EngagementType.DISLIKE
            ? "secondary-gray"
            : "tertiary-gray"
        }
        size="xl"
        onClick={
          sessionData
            ? () => {
                handleLikeDislike({
                  userId,
                  videoId,
                  announcementId,
                  type: EngagementType.DISLIKE,
                });
              }
            : () => void signIn()
        }
        className={cx([
          "group flex items-center rounded-none rounded-r-lg border border-l-0 bg-white !py-0 !ring-0 hover:bg-white hover:text-primary-700",
          userChoice.userEngagement === EngagementType.DISLIKE
            ? "bg-primary-50 text-primary-700"
            : "",
        ])}
      >
        <Lottie
          animationData={DisLike}
          play={clickDislike}
          loop={false}
          className="h-8 w-8"
          goTo={0}
        />
        {/*         <ThumbsDown
          className={cx([
            `mr-2 h-5 w-5 shrink-0`,
            userChoice.userEngagement === EngagementType.DISLIKE
              ? "stroke-primary-700 "
              : "stroke-gray-900 group-hover:stroke-primary-700",
          ])}
        /> */}
        <span className="sr-only">
          {userChoice.userEngagement === EngagementType.DISLIKE
            ? "Dislike"
            : "Cancel dislike"}
        </span>
        <span aria-label="number of dislikes">{userChoice.dislikes}</span>
      </Button>
    </>
  );
}
