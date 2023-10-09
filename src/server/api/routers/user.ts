import { EngagementType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getVideosHistoryById: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const viewedVideoIds = await ctx.db.videoEngagement.findMany({
        select: {
          videoId: true,
        },
        where: {
          engagementType: EngagementType.VIEW,
          userId: input.userId,
        },
        orderBy: {
          updatedAt: "desc",
        },
        distinct: ["videoId"],
      });
      const videoIds = viewedVideoIds.map(({ videoId }) => videoId);
      const videosWithUser = await Promise.all(
        videoIds.map(
          async (videoId) =>
            await ctx.db.video.findFirstOrThrow({
              where: {
                id: videoId,
              },
              include: {
                user: true,
              },
            }),
        ),
      );

      const videosWithCounts = await Promise.all(
        videosWithUser.map(async (video) => {
          const views = await ctx.db.videoEngagement.count({
            where: {
              videoId: video.id,
              engagementType: EngagementType.VIEW,
            },
          });
          return {
            ...video,
            views,
          };
        }),
      );
      return { videosWithCounts };
    }),

  getChannelById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        viewerId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
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

  getFollowingById: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        viewerId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const followingIds = await ctx.db.followEngagement.findMany({
        where: {
          engagementType: EngagementType.FOLLOW,
          followerId: input.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const followingUsers = await Promise.all(
        followingIds.map(async ({ followingId }) => {
          const followingUser = await ctx.db.user.findUniqueOrThrow({
            where: {
              id: followingId,
            },
          });
          const followers = await ctx.db.followEngagement.count({
            where: {
              followingId: followingId,
            },
          });
          const viewerHasFollowed = !!(await ctx.db.followEngagement.count({
            where: {
              followingId: followingId,
              followerId: input.viewerId,
            },
          }));
          return { ...followingUser, followers, viewerHasFollowed };
        }),
      );
      return { followingUsers };
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
        videoId: z.string().optional(),
        announcementId: z.string().optional(),
        type: z.custom<EngagementType>(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.videoId) {
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
      } else if (input.announcementId) {
        const existingLikeDislike =
          await ctx.db.announcementEngagement.findMany({
            where: {
              userId: input.userId,
              announcementId: input.announcementId,
              engagementType: {
                in: [EngagementType.DISLIKE, EngagementType.LIKE],
              },
            },
          });
        if (existingLikeDislike.length > 0) {
          const likeOrDislike = existingLikeDislike[0]?.engagementType;
          const deleteLikeDisklike =
            await ctx.db.announcementEngagement.deleteMany({
              where: {
                userId: input.userId,
                announcementId: input.announcementId,
                engagementType: {
                  in: [EngagementType.DISLIKE, EngagementType.LIKE],
                },
              },
            });
          if (likeOrDislike !== input.type) {
            const addLiskDislike = await ctx.db.announcementEngagement.create({
              data: {
                userId: input.userId,
                announcementId: input.announcementId,
                engagementType: input.type,
              },
            });
            return addLiskDislike;
          }
          return deleteLikeDisklike;
        } else {
          const createLike = await ctx.db.announcementEngagement.create({
            data: {
              userId: input.userId,
              announcementId: input.announcementId,
              engagementType: input.type,
            },
          });
          return createLike;
        }
      }
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
        image: z.string().optional(),
        backgroundImage: z.string().optional(),
        handle: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, ...updateData } = input;
      const result = await ctx.db.user.update({
        where: { id: userId },
        data: { ...updateData },
      });
      return result;
    }),
});
