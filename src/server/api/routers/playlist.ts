import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { EngagementType } from "@prisma/client";

export const playlistRouter = createTRPCRouter({
  getPlaylistsById: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        isExpanded: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const playlists = await ctx.db.playlist.findMany({
        where: {
          userId: input.userId,
          title: {
            not: "History",
          },
        },
      });
      const videoIdsArray = await Promise.all(
        playlists.map(async (playlist) => {
          return await ctx.db.playlistHasVideo.findMany({
            where: {
              playlistId: playlist.id,
            },
            take: input.isExpanded ? 6 : 1,
          });
        }),
      );

      const videosWithUser = await Promise.all(
        videoIdsArray.map(async (videoIds) => {
          const videoIdsonly = videoIds.map((videoId) => videoId.videoId);
          return await ctx.db.video.findMany({
            where: {
              id: {
                in: videoIdsonly,
              },
            },
            include: {
              user: true,
            },
          });
        }),
      );

      const videosWithCounts = await Promise.all(
        videosWithUser.map(async (videoArray) => {
          return await Promise.all(
            videoArray.map(async (video) => {
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
        }),
      );

      const playlistsWithCount = await Promise.all(
        playlists.map(async (playlist) => {
          const count = await ctx.db.playlistHasVideo.count({
            where: {
              playlistId: playlist.id,
            },
          });
          return { ...playlist, count };
        }),
      );

      const playlistData = playlistsWithCount.map((playlist, index) => {
        const videos =
          videosWithCounts[index]?.map(({ user, ...video }) => video) ?? [];
        const users = videosWithCounts[index]?.map(({ user }) => user) ?? [];
        return { playlist, users, videos };
      });
      return { playlistData };
    }),
  getVideosByPlaylistId: publicProcedure
    .input(
      z.object({
        playlistId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const playlist = await ctx.db.playlist.findFirstOrThrow({
        where: {
          id: input.playlistId,
        },
      });
      const count = await ctx.db.playlistHasVideo.count({
        where: {
          playlistId: playlist.id,
        },
      });

      const user = await ctx.db.user.findFirstOrThrow({
        where: {
          id: playlist.userId,
        },
      });

      const followers = await ctx.db.followEngagement.count({
        where: {
          followingId: playlist.userId,
        },
      });

      const videosInPlaylist = await ctx.db.playlistHasVideo.findMany({
        where: {
          playlistId: input.playlistId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const videosWithUser = await Promise.all(
        videosInPlaylist.map(async ({ videoId }) => {
          return await ctx.db.video.findFirstOrThrow({
            where: {
              id: videoId,
            },
            include: {
              user: true,
            },
          });
        }),
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

      return {
        playlist: { ...playlist, count },
        user: { ...user, followers },
        videos: videosWithCounts,
      };
    }),
  getLikedVideos: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const likedVideoId = await ctx.db.videoEngagement.findMany({
        where: {
          engagementType: EngagementType.LIKE,
          userId: input.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const videosWithUser = await Promise.all(
        likedVideoId.map(async ({ videoId }) => {
          return await ctx.db.video.findFirstOrThrow({
            where: {
              id: videoId,
            },
            include: {
              user: true,
            },
          });
        }),
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
      const videos = videosWithCounts.map(({ user, ...video }) => video);
      const users = videosWithCounts.map(({ user, ...video }) => user);
      return {
        videos,
        users,
      };
    }),
  getPlaylists: protectedProcedure
    .input(z.object({ userId: z.string(), videoId: z.string() }))
    .query(async ({ ctx, input }) => {
      const playlists = await ctx.db.playlist.findMany({
        where: {
          userId: input.userId,
          title: {
            not: "History",
          },
        },
      });
      const currentVideoInViewerPlaylist =
        await ctx.db.playlistHasVideo.findMany({
          where: {
            videoId: input.videoId,
            playlistId: {
              in: playlists.map((playlist) => playlist.id),
            },
          },
        });
      const playlistIdArray = currentVideoInViewerPlaylist.map(
        (playlist) => playlist.playlistId,
      );

      return { playlists, playlistIdArray };
    }),
  createPlaylist: protectedProcedure
    .input(
      z.object({
        newPlaylistName: z.string(),
        userId: z.string(),
        videoId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newPlaylist = await ctx.db.playlist.create({
        data: {
          title: input.newPlaylistName,
          userId: input.userId,
        },
      });
      if (input.videoId) {
        await ctx.db.playlistHasVideo.create({
          data: {
            playlistId: newPlaylist.id,
            videoId: input.videoId,
          },
        });
      }
    }),
  updatePlaylists: protectedProcedure
    .input(
      z.object({
        deletePlaylistId: z.string(),
        addPlaylistId: z.string(),
        videoId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.deletePlaylistId) {
        await ctx.db.playlistHasVideo.deleteMany({
          where: {
            playlistId: input.deletePlaylistId,
            videoId: input.videoId,
          },
        });
      }
      if (input.addPlaylistId) {
        const alreadyPresent = await ctx.db.playlistHasVideo.findFirst({
          where: {
            playlistId: input.addPlaylistId,
            videoId: input.videoId,
          },
        });
        if (!alreadyPresent) {
          await ctx.db.playlistHasVideo.create({
            data: {
              playlistId: input.addPlaylistId,
              videoId: input.videoId,
            },
          });
        }
      }
    }),
});
