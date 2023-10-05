import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { ThumbsDown, ThumbsUp } from "@/components/Icons/Icons";
import { cx } from "@/utils/helpers";

import Button from "./Button";
import { EngagementType } from "@prisma/client";

interface LikeButton {
  videoId: string;
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

  const likeDislikeMutation = api.user.handleLikeDislike.useMutation();

  const handleLikeDislike = (input: {
    userId: string;
    videoId: string;
    type: EngagementType;
  }) => {
    const nextUserChoice = { ...userChoice };
    if (
      input.type === EngagementType.LIKE &&
      userChoice.userEngagement === null
    ) {
      nextUserChoice.userEngagement = EngagementType.LIKE;
      nextUserChoice.likes = userChoice.likes + 1;
    }

    if (
      input.type === EngagementType.DISLIKE &&
      userChoice.userEngagement === null
    ) {
      nextUserChoice.userEngagement = EngagementType.DISLIKE;
      nextUserChoice.dislikes = userChoice.dislikes + 1;
    }

    if (
      input.type === EngagementType.LIKE &&
      userChoice.userEngagement === EngagementType.LIKE
    ) {
      nextUserChoice.userEngagement = null;
      nextUserChoice.likes = userChoice.likes - 1;
    }

    if (
      input.type === EngagementType.LIKE &&
      userChoice.userEngagement === EngagementType.DISLIKE
    ) {
      nextUserChoice.userEngagement = EngagementType.LIKE;
      nextUserChoice.likes = userChoice.likes + 1;
      nextUserChoice.dislikes = userChoice.dislikes - 1;
    }

    if (
      input.type === EngagementType.DISLIKE &&
      userChoice.userEngagement === EngagementType.DISLIKE
    ) {
      nextUserChoice.userEngagement = null;
      nextUserChoice.dislikes = userChoice.dislikes - 1;
    }

    if (
      input.type === EngagementType.DISLIKE &&
      userChoice.userEngagement === EngagementType.LIKE
    ) {
      nextUserChoice.userEngagement = EngagementType.DISLIKE;
      nextUserChoice.likes = userChoice.likes - 1;
      nextUserChoice.dislikes = userChoice.dislikes + 1;
    }

    setUserChoice(nextUserChoice);
    likeDislikeMutation.mutate(input);
  };

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
            ? () =>
                handleLikeDislike({
                  userId,
                  videoId,
                  type: EngagementType.LIKE,
                })
            : () => void signIn()
        }
        className={cx([
          "group flex rounded-none rounded-l-lg border bg-white hover:bg-white hover:text-primary-700",
          userChoice.userEngagement === EngagementType.LIKE
            ? "text-primary-700"
            : "",
        ])}
      >
        <ThumbsUp
          className={cx([
            `mr-2 h-5 w-5 shrink-0`,
            userChoice.userEngagement === EngagementType.LIKE
              ? "stroke-primary-700 "
              : "stroke-gray-900 group-hover:stroke-primary-700",
          ])}
        />
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
            ? () =>
                handleLikeDislike({
                  userId,
                  videoId,
                  type: EngagementType.DISLIKE,
                })
            : () => void signIn()
        }
        className={cx([
          "group flex rounded-none rounded-r-lg border border-l-0 bg-white hover:bg-white hover:text-primary-700",
          userChoice.userEngagement === EngagementType.DISLIKE
            ? "text-primary-700"
            : "",
        ])}
      >
        <ThumbsDown
          className={cx([
            `mr-2 h-5 w-5 shrink-0`,
            userChoice.userEngagement === EngagementType.DISLIKE
              ? "stroke-primary-700 "
              : "stroke-gray-900 group-hover:stroke-primary-700",
          ])}
        />
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
