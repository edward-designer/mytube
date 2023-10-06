import { EngagementType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getChannelById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        viewerId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      const followerCount = await ctx.db.followEngagement.count({
        where: {
          engagementType: EngagementType.FOLLOW,
          followingId: input.id,
        },
      });
      const followingCount = await ctx.db.followEngagement.count({
        where: {
          engagementType: EngagementType.FOLLOW,
          followerId: input.id,
        },
      });

      let hasFollowed = false;
      if (input.viewerId) {
        hasFollowed = !!(await ctx.db.followEngagement.findFirst({
          where: {
            followerId: input.viewerId,
            followingId: input.id,
          },
        }));
      }
      return {
        user: {
          ...user,
          followerCount,
          followingCount,
        },
        viewer: {
          hasFollowed,
        },
      };
    }),
  addFollow: publicProcedure
    .input(
      z.object({
        followerId: z.string(),
        followingId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingFollow = await ctx.db.followEngagement.findMany({
        where: {
          followingId: input.followingId,
          followerId: input.followerId,
          engagementType: EngagementType.FOLLOW,
        },
      });
      if (existingFollow.length > 0) {
        const deleteFollow = await ctx.db.followEngagement.deleteMany({
          where: {
            followingId: input.followingId,
            followerId: input.followerId,
            engagementType: EngagementType.FOLLOW,
          },
        });
        return deleteFollow;
      } else {
        const createFollow = await ctx.db.followEngagement.create({
          data: {
            followingId: input.followingId,
            followerId: input.followerId,
            engagementType: EngagementType.FOLLOW,
          },
        });
        return createFollow;
      }
    }),
  handleLikeDislike: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        videoId: z.string(),
        type: z.custom<EngagementType>(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingLikeDislike = await ctx.db.videoEngagement.findMany({
        where: {
          userId: input.userId,
          videoId: input.videoId,
          engagementType: {
            in: [EngagementType.DISLIKE, EngagementType.LIKE],
          },
        },
      });
      if (existingLikeDislike.length > 0) {
        const likeOrDislike = existingLikeDislike[0]?.engagementType;
        const deleteLikeDisklike = await ctx.db.videoEngagement.deleteMany({
          where: {
            userId: input.userId,
            videoId: input.videoId,
            engagementType: {
              in: [EngagementType.DISLIKE, EngagementType.LIKE],
            },
          },
        });
        if (likeOrDislike !== input.type) {
          const addLiskDislike = await ctx.db.videoEngagement.create({
            data: {
              userId: input.userId,
              videoId: input.videoId,
              engagementType: input.type,
            },
          });
          return addLiskDislike;
        }
        return deleteLikeDisklike;
      } else {
        const createLike = await ctx.db.videoEngagement.create({
          data: {
            userId: input.userId,
            videoId: input.videoId,
            engagementType: input.type,
          },
        });
        return createLike;
      }
    }),
});
