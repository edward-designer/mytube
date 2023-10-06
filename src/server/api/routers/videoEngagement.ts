import { EngagementType, type PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

type Context = {
  db: PrismaClient;
};

const getOrCreatePlaylist = async (
  ctx: Context,
  title: string,
  userId: string,
) => {
  let playlist = await ctx.db.playlist.findFirst({
    where: { title, userId },
  });

  if (playlist === null || playlist === undefined) {
    playlist = await ctx.db.playlist.create({
      data: { title, userId },
    });
  }
  console.log(playlist);
  return playlist;
};

const createEngagement = async (
  ctx: Context,
  id: string,
  userId: string,
  type: EngagementType,
) => {
  return await ctx.db.videoEngagement.create({
    data: { videoId: id, userId, engagementType: type },
  });
};

export const videoEngagementRouter = createTRPCRouter({
  addViewCount: publicProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId && input.userId !== "") {
        const playlist = await getOrCreatePlaylist(
          ctx,
          "History",
          input.userId,
        );
        await ctx.db.playlistHasVideo.create({
          data: { playlistId: playlist.id, videoId: input.id },
        });
      }
      const view = await createEngagement(
        ctx,
        input.id,
        input.userId,
        EngagementType.VIEW,
      );
      return view;
    }),
});
