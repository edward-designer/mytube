import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { EngagementType } from "@prisma/client";

export const playlistRouter = createTRPCRouter({
  getPlaylistsById: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        isHistory: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const playlists = input.isHistory
        ? await ctx.db.playlist.findMany({
            where: {
              userId: input.userId,
              title: "History",
            },
            take: 1,
          })
        : await ctx.db.playlist.findMany({
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
            orderBy: {
              createdAt: "desc",
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

      const playlistData = playlists.map((playlist, index) => {
        const videos =
          videosWithCounts[index]?.map(({ user, ...video }) => video) ?? [];
        const users = videosWithCounts[index]?.map(({ user }) => user) ?? [];
        return { playlist, users, videos };
      });

      return { playlistData };
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
        await ctx.db.playlistHasVideo.create({
          data: {
            playlistId: input.addPlaylistId,
            videoId: input.videoId,
          },
        });
      }
    }),
});
