/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 */

import { z } from "zod";
import { EngagementType } from "@prisma/client";
import { type User, type Video } from "@prisma/client";

interface VideoWithUser extends Video {
  user: User;
}

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const videoRouter = createTRPCRouter({
  addVideo: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        description: z.string().optional(),
        videoUrl: z.string().optional(),
        publish: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const videoUrl = input.videoUrl;
      const thumbnailUrl =
        videoUrl?.substring(0, videoUrl?.lastIndexOf(".")) + ".jpg";
      const publish = false;
      const video = await ctx.db.video.create({
        data: { userId, videoUrl, thumbnailUrl, publish },
      });
      return video;
    }),

  updateVideoById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        description: z.string().optional(),
        videoUrl: z.string().optional(),
        publish: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id, ...updateData } = input;
      await ctx.db.video.update({
        data: { ...updateData },
        where: {
          id,
          userId,
        },
      });
    }),

  deleteVideoById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const video = await ctx.db.video.delete({
        where: {
          id: input.id,
          userId,
        },
      });
      if (video) {
        await ctx.db.videoEngagement.deleteMany({
          where: {
            videoId: input.id,
          },
        });
        await ctx.db.playlistHasVideo.deleteMany({
          where: {
            videoId: input.id,
          },
        });
        await ctx.db.comment.deleteMany({
          where: {
            videoId: input.id,
          },
        });
      }
    }),
  getVideoByKeyword: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const videosWithUser = await ctx.db.video.findMany({
        where: {
          AND: [
            { publish: true },
            {
              OR: [
                {
                  description: {
                    contains: input,
                  },
                },
                {
                  title: {
                    contains: input,
                  },
                },
              ],
            },
          ],
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const videos = videosWithUser.map(({ user, ...video }) => video);
      const users = videosWithUser.map(({ user }) => user);

      const videosWithCounts = await Promise.all(
        videos.map(async (video) => {
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

      return { videos: videosWithCounts, users };
    }),
  getVideoById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        viewerId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const rawVideo = await ctx.db.video.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: true,
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              user: true,
            },
          },
        },
      });

      if (!rawVideo) {
        throw new Error("Video not found");
      }

      const { user, comments, ...video } = rawVideo;

      const followers = await ctx.db.followEngagement.count({
        where: {
          followingId: video.userId,
        },
      });
      const likes = await ctx.db.videoEngagement.count({
        where: {
          videoId: video.id,
          engagementType: EngagementType.LIKE,
        },
      });
      const dislikes = await ctx.db.videoEngagement.count({
        where: {
          videoId: video.id,
          engagementType: EngagementType.DISLIKE,
        },
      });
      const views = await ctx.db.videoEngagement.count({
        where: {
          videoId: video.id,
          engagementType: EngagementType.VIEW,
        },
      });

      const userWithFollowers = { ...user, followers };
      const videoWithLikesDislikesViews = { ...video, likes, dislikes, views };
      const commentsWithUsers = comments.map(({ user, ...comment }) => ({
        user,
        comment,
      }));
      let viewerHasSaved = false;
      let viewerHasLiked = false;
      let viewerHasDisliked = false;
      let viewerHasFollowed = false;

      const viewerPlaylist = await ctx.db.playlist.findMany({
        where: { userId: input.viewerId, title: { not: "History" } },
      });

      if (input.viewerId && input.viewerId !== "") {
        viewerHasLiked = !!(await ctx.db.videoEngagement.findFirst({
          where: {
            videoId: input.id,
            userId: input.viewerId,
            engagementType: EngagementType.LIKE,
          },
        }));

        viewerHasDisliked = !!(await ctx.db.videoEngagement.findFirst({
          where: {
            videoId: input.id,
            userId: input.viewerId,
            engagementType: EngagementType.DISLIKE,
          },
        }));

        viewerHasFollowed = !!(await ctx.db.followEngagement.findFirst({
          where: {
            followingId: rawVideo.userId,
            followerId: input.viewerId,
          },
        }));
        viewerHasSaved = !!(await ctx.db.playlistHasVideo.findFirst({
          where: {
            videoId: input.id,
            playlistId: {
              in: viewerPlaylist.map((list) => list.id),
            },
          },
        }));
      } else {
        viewerHasLiked = false;
        viewerHasDisliked = false;
        viewerHasFollowed = false;
        viewerHasSaved = false;
      }
      const viewer = {
        hasLiked: viewerHasLiked,
        hasDisliked: viewerHasDisliked,
        hasFollowed: viewerHasFollowed,
        hasSaved: viewerHasSaved,
        viewerPlaylist,
      };
      return {
        video: videoWithLikesDislikesViews,
        user: userWithFollowers,
        comments: commentsWithUsers,
        viewer,
      };
    }),

  getRandomVideos: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.number(),
        excludeId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let limit = 10;
      if (input.limit && input.limit > 0) limit = input.limit;
      let offset = 1;
      if (input.cursor) offset = (input.cursor - 1) * limit;

      const videosWithUser: VideoWithUser[] = await ctx.db.$queryRawUnsafe(
        `SELECT Video.*, JSON_OBJECT("handle", User.handle, "name", User.name, "id",User.id , "image", User.image) as user FROM Video LEFT JOIN User ON Video.userId = User.id ORDER BY Video.createdAt DESC LIMIT ${limit} OFFSET ${offset}`,
      );

      const videos = videosWithUser.map(({ user, ...video }) => video);
      const users = videosWithUser.map(({ user }) => user);

      const videosWithCounts = await Promise.all(
        videos.map(async (video) => {
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

      return { videos: videosWithCounts, users, nextCursor: input.cursor + 1 };
    }),

  getVideosByUploader: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const videosWithUser = await ctx.db.video.findMany({
        where: {
          publish: true,
          userId: input.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      });

      const videos = videosWithUser.map(({ user, ...video }) => video);
      const users = videosWithUser.map(({ user }) => user);

      const videosWithCounts = await Promise.all(
        videos.map(async (video) => {
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
      return { videos: videosWithCounts, users };
    }),
});
