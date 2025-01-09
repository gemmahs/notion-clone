"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Smile, Image, X } from "lucide-react";
import { useCoverImage } from "@/hooks/stores";
import { useRef, useState } from "react";
import EmojiPicker, { IconProps } from "./EmojiPicker";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";

function Toolbar({ document }: { document: Doc<"documents"> }) {
  const coverImage = useCoverImage();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value === title) return;
    const value = e.target.value;
    // console.log(`Typing Starts: ${value}`);
    setTitle(value);
    // const t0 = window.performance.now();
    update({
      id: document._id,
      title: e.target.value || "Untitled",
    });
    // .then(() => {
    //   console.log(`Processing ends: ${value}`);
    //   console.log(`Time taken: ${window.performance.now() - t0}ms`); //平均400ms，造成严重的延迟和显示错乱
    //   console.log("\n");
    // });
  }

  function enableInput() {
    setIsEditing(true);
    const value = document.title;
    setTitle(value); //async operation
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(
        value.length, //这里不能用title state（由于延迟），不然光标没法选中
        value.length,
      );
    }, 0);
  }

  function disableInput() {
    setIsEditing(false);
    setTitle(document.title);
  }

  //confirm the new title by pressing Enter
  function handlePressEnter(e: React.KeyboardEvent) {
    if (textareaRef.current && e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
  }

  //上传emoji或者更改emoji
  function handleUpdateIcon(icon: IconProps) {
    update({ id: document._id, icon: icon.native });
  }

  //删除emoji
  function handleRemoveIcon(e: React.MouseEvent) {
    e.stopPropagation();
    removeIcon({ id: document._id });
  }

  //如果已经有emoji，那么不显示 Add emoji，显示 change emoji
  //如果已经有cover image，那么不显示 Add cover
  return (
    <div className="px-[54px] pt-2">
      {document.icon && (
        <div className="group/icon relative -mt-[52px] mb-1 flex h-20 w-20 items-center bg-transparent transition-colors hover:bg-foreground/10">
          <span className="text-6xl">{document.icon}</span>

          <div
            className="absolute top-0 z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-accent p-1 opacity-0 transition-opacity group-hover/icon:opacity-100"
            onClick={handleRemoveIcon}
          >
            <X />
          </div>
        </div>
      )}

      <div className="h-7"></div>

      <div className="group/actions relative">
        {isEditing ? (
          <TextareaAutosize
            ref={textareaRef}
            value={title}
            onBlur={disableInput}
            onChange={handleChange}
            onKeyDown={handlePressEnter}
            placeholder="Untitled"
            className="mb-[27px] max-w-full resize-none overflow-y-hidden text-5xl font-semibold placeholder:text-muted focus-visible:outline-0"
          />
        ) : (
          <div
            className="mb-10 cursor-pointer whitespace-pre-wrap break-words text-5xl font-semibold focus-visible:ring-transparent"
            onClick={enableInput}
          >
            {document.title}
          </div>
        )}

        <div className="absolute top-0 z-10 flex -translate-y-full gap-x-2 opacity-0 transition-opacity group-hover/actions:opacity-100">
          <EmojiPicker onChange={handleUpdateIcon}>
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-0 p-1 text-sm font-normal text-muted-foreground shadow-none hover:bg-accent hover:text-muted-foreground"
            >
              <Smile size={16} />
              {document.icon ? (
                <span>Change emoji</span>
              ) : (
                <span>Add emoji</span>
              )}
            </Button>
          </EmojiPicker>

          {!document.coverImage && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-7 border-0 p-1 text-sm font-normal text-muted-foreground shadow-none hover:bg-accent hover:text-muted-foreground"
                onClick={coverImage.onOpen}
              >
                <Image size={16} />
                <span>Add cover</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
