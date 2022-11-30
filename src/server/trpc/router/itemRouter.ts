import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const itemRouter = router({
  addItem: publicProcedure
    .input(
      z.object({
        text: z.string({
          required_error: "Text Required",
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const item = await ctx.prisma.shoppingItem.create({
        data: {
          name: input.text,
        },
      });
      return item;
    }),
  getItems: publicProcedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.shoppingItem.findMany();
    return items;
  }),
  deleteItem: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const item = await ctx.prisma.shoppingItem.delete({
        where: { id: input.text },
      });
      return item;
    }),
  checkItem: publicProcedure
    .input(z.object({ text: z.string(), check: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const item = await ctx.prisma.shoppingItem.update({
        where: { id: input.text },
        data: { checked: input.check },
      });
      return item;
    }),
  getSpecificItem: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.shoppingItem.findUnique({
        where: { id: input.text },
      });
      return item;
    }),
  editItem: publicProcedure
    .input(z.object({ text: z.string(), newName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.shoppingItem.update({
        where: { id: input.text },
        data: { name: input.newName },
      });
      return item;
    }),
});
