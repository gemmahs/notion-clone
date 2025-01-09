"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

function Title({ document }: { document: Doc<"documents"> }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const update = useMutation(api.documents.update);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === title) return;
    const value = e.target.value;
    setTitle(value);
    update({
      id: document?._id,
      title: e.target.value || "Untitled",
    });
  }

  function enableInput() {
    setIsEditing(true);
    const value = document.title;
    setTitle(value);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, value.length); //这里不能用title state（由于延迟），不然光标没法选中
    }, 0);
  }

  function disableInput() {
    setIsEditing(false);
    setTitle(document.title);
  }

  function handlePressEnter(e: React.KeyboardEvent) {
    if (inputRef.current && e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
  }

  return (
    <div className="flex">
      {!!document?.icon && <span>{document.icon}</span>}
      {isEditing ? (
        <Input
          ref={inputRef}
          value={title}
          onChange={handleChange}
          onBlur={disableInput}
          onKeyDown={handlePressEnter}
          className="h-7 w-52 px-1 focus-visible:ring-transparent"
        />
      ) : (
        <div
          className="flex h-7 max-w-52 cursor-pointer items-center overflow-hidden whitespace-nowrap rounded-sm px-1 text-[14px] transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={enableInput}
        >
          <span className="truncate">{document.title}</span>
        </div>
      )}
    </div>
  );
}

export default Title;
