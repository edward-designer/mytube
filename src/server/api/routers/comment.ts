import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({
  addComment: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        userId: z.string(),
        message: z.string().max(300).min(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.comment.create({
        data: {
          videoId: input.videoId,
          userId: input.userId,
          message: input.message,
        },
      });
      const getAllComments = await ctx.db.comment.findMany({
        where: {
          videoId: input.videoId,
        },
        orderBy: [{ createdAt: "desc" }],
      });
      return getAllComments;
    }),
});
