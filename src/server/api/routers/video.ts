/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 */

import { z } from "zod";
import { EngagementType } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const videoRouter = createTRPCRouter({
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
        count: z.number(),
        excludeId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const videosWithUser = await ctx.db.video.findMany({
        where: {
          publish: true,
          NOT: {
            id: input.excludeId,
          },
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
            take: input.count,
          });
          return {
            ...video,
            views,
          };
        }),
      );

      const indices = Array.from({ length: input.count }, (_, i) => i);

      for (let i = indices.length - 1; i > 0; i--) {
        if (indices[i] !== undefined) {
          const j = Math.floor(Math.random() * (i + 1));
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
      }

      const shuffledVideosWithCounts = indices.map((i) => videosWithCounts[i]);
      const shuffledUsers = indices.map((i) => users[i]);

      const randomVideos = shuffledVideosWithCounts.slice(0, input.count);
      const randomUsers = shuffledUsers.slice(0, input.count);
      return { videos: randomVideos, users: randomUsers };
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
