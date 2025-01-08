"use client";

import { ConvexError } from "convex/values";

// 三种情况:
// 1. path name（也就是documentId）不对：
// “ArgumentValidationError: Value does not match validator.”不属于ConvexError，暂时不知道怎么处理
// 2. 被软删除，不对游客开放（但其实用户自己依然可以查看）
// 3. 数据库里查不到
export default function PreviewError({ error }: { error: ConvexError<any> }) {
  console.log(error);
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4 p-4">
      <img src="/error.svg" alt="error" className="max-w-40" />

      <p className="text-lg">The page is not accessible</p>
      <p>{error?.data}</p>
    </div>
  );
}
