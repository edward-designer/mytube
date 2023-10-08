import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { EngagementType, type PrismaClient } from "@prisma/client";

type Context = {
  db: PrismaClient;
};

const getAllAnnouncementsWithCounts = async (ctx: Context, userId: string) => {
  const announcements = await ctx.db.announcement.findMany({
    where: {
      userId,
    },
    orderBy: { createdAt: "desc" },
    include: { announcementEngagements: true, user: true },
  });
  const announcementsWithCounts = announcements.map(
    ({ announcementEngagements, ...announcement }) => {
      let like = 0;
      let dislike = 0;
      let hasLiked = false;
      let hasDisliked = false;
      announcementEngagements.forEach(
        ({ engagementType, userId: announcementUserId }) => {
          if (engagementType === EngagementType.LIKE) {
            like++;
            if (userId === announcementUserId) hasLiked = true;
          }
          if (engagementType === EngagementType.DISLIKE) {
            dislike++;
            if (userId === announcementUserId) hasDisliked = true;
          }
        },
      );
      return { ...announcement, like, dislike, hasLiked, hasDisliked };
    },
  );
  return announcementsWithCounts;
};

export const announcementRouter = createTRPCRouter({
  addAnnouncement: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        message: z.string().max(300).min(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.announcement.create({
        data: { userId: input.userId, message: input.message },
      });
      return await getAllAnnouncementsWithCounts(ctx, input.userId);
    }),

  allAnnouncements: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await getAllAnnouncementsWithCounts(ctx, input.userId);
    }),
});
