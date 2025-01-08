import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

//删除头图
export const removeCoverImage = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const userId = identity.subject;

    const existingDoc = await ctx.db.get(args.id);
    if (!existingDoc) throw new ConvexError("Not found");
    if (existingDoc.userId !== userId) throw new ConvexError("Unauthorized");

    const document = await ctx.db.patch(args.id, { coverImage: undefined });
    return document; //返回的是null
  },
});

//删除emoji
export const removeIcon = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const userId = identity.subject;

    const existingDoc = await ctx.db.get(args.id);
    if (!existingDoc) throw new ConvexError("Not found");
    if (existingDoc.userId !== userId) throw new ConvexError("Unauthorized");

    const document = await ctx.db.patch(args.id, { icon: undefined });
    return document;
  },
});

//根据一个文件的id获取其所有上级文件id，并返回一个array
//此函数用于优化侧边栏的显示：根据active doc展开其所在的文件列表
export const getAllParentDocs = query({
  args: {
    id: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    //验证身份
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const userId = identity.subject;

    if (!args.id) return [];
    const existingDoc = await ctx.db.get(args.id);
    // if (!existingDoc) throw new ConvexError("Not found");
    if (!existingDoc) return [];
    if (existingDoc.userId !== userId) throw new ConvexError("Unauthorized");

    const parentDocs = [];
    //如果此文件已经archived或者没有上级文件，那么侧边栏的文件列表不需要调整
    if (existingDoc.isArchived || !existingDoc.parentDocument) return [];
    //如果此文件有上级文件，则需要找到并返回所有上级文件
    let childDoc = existingDoc;
    while (true) {
      const parentDocId = childDoc.parentDocument;
      if (!parentDocId) break;
      const parentDoc = await ctx.db.get(parentDocId);
      if (!parentDoc || parentDoc.isArchived) break;
      parentDocs.push(parentDoc._id);
      childDoc = parentDoc;
    }
    return parentDocs;
  },
});

//供游客预览用，不需要任何身份验证
export const getForPreview = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const existingDoc = await ctx.db.get(args.id);
    if (!existingDoc) throw new ConvexError("Not found");
    if (!existingDoc.isPublished || existingDoc.isArchived)
      throw new ConvexError("Not accessible");
    //如果已经published且未删除，则可以访问
    if (existingDoc.isPublished && !existingDoc.isArchived) return existingDoc;
  },
});

//获取某个document，仅供用户本人调用
//为了避免混乱，给预览游客另设一个函数
export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    //验证身份
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const userId = identity.subject;
    //查找文件
    const existingDoc = await ctx.db.get(args.id);
    if (!existingDoc) throw new ConvexError("Not found");
    if (existingDoc.userId !== userId) throw new ConvexError("Unauthorized");

    return existingDoc;
  },
});

//修改某个document
export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    icon: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const userId = identity.subject;

    const existingDoc = await ctx.db.get(args.id);
    if (!existingDoc) throw new ConvexError("Not found");
    if (existingDoc.userId !== userId) throw new ConvexError("Unauthorized");

    //把需要更新的字段放在rest对象中。id字段不可修改
    const { id, ...rest } = args;
    const document = await ctx.db.patch(id, { ...rest });
    return document;
  },
});

//获取搜索页面的文件列表
export const getSearchList = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Not authenticated");
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

//彻底删除archived的文件。跟软删除不同的是，这里一次只删一条
export const remove = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const userId = identity.subject;

    const existingDoc = await ctx.db.get(args.id);
    if (!existingDoc) throw new ConvexError("Not found");
    if (existingDoc.userId !== userId) throw new ConvexError("Unauthorized");

    const document = await ctx.db.delete(args.id);
    return document;
  },
});

//获取全部被软删除archived的文件
export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return documents;
  },
});

//恢复被软删除的文件。需要用到递归
//恢复parendDoc之后，它下面所有的子文件也会自动恢复
export const restore = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const userId = identity.subject;

    const existingDoc = await ctx.db.get(args.id);

    if (!existingDoc) throw new ConvexError("Not found");
    if (existingDoc.userId !== userId) throw new ConvexError("Unauthorized");

    //验证完毕后，用递归函数恢复该文件下属的所有子文件
    //定义递归函数
    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect();

      for (let child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });

        await recursiveRestore(child._id);
      }
    };

    // 对于用户点击恢复的文件来说：
    //case 1：没有parentDocId，那么只修改isArchived就行
    //case 2：有parentDocId，但是数据库里查不到该parentDoc（说明已被彻底删除）。不仅要修改isArchived，还要改parenDocId
    //case 3：有parentDocId + parentDoc存在但已被archived。不仅要修改isArchived，还要改parenDocId
    //case 4：有parentDocId + parentDoc存在且没被archived。只改isArchived
    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };
    //case 2, 3 & 4
    if (existingDoc.parentDocument) {
      const doc = await ctx.db.get(existingDoc.parentDocument);
      //case 2 & case 3
      if (!doc || doc.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const document = await ctx.db.patch(args.id, options);
    // 调用递归函数
    recursiveRestore(args.id);

    return document;
  },
});

//archive（软删除）当前文件的同时，archive其所有子文件
//更改isArchived的同时，把isPublished改为false
export const archive = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    // 查找身份
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const userId = identity.subject;
    // 查找文件
    const existingDoc = await ctx.db.get(args.id);
    if (!existingDoc) throw new ConvexError("Not Found");
    // 验证身份
    if (existingDoc.userId !== userId) throw new ConvexError("Unauthorized");

    //定义函数
    //验证完毕后，查找所有直接子文件，并修改isArchived和isPublished属性。然后递归
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect();

      for (let child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
          isPublished: false,
        });

        await recursiveArchive(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
      isPublished: false,
    });
    //调用函数
    recursiveArchive(args.id);

    return document;
  },
});

export const getDocumentList = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument),
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });
    return document;
  },
});
