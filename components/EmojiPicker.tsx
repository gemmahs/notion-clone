"use client";

import data from "@emoji-mart/data/sets/15/native.json";
import Picker from "@emoji-mart/react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEmojiPopover } from "@/hooks/stores";

type EmojiPickerProps = {
  onChange: (icon: IconProps) => void;
  children: React.ReactNode;
};
export type IconProps = {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
};
export default function EmojiPicker({ onChange, children }: EmojiPickerProps) {
  const isMobile = useIsMobile({ breakpoint: 576 });
  const { resolvedTheme } = useTheme();
  const emojiPopover = useEmojiPopover();

  return (
    <Popover open={emojiPopover.isOpen} onOpenChange={emojiPopover.onClose}>
      {/* Anchor仅用来定位Content，不控制开关 */}
      <PopoverAnchor>{children}</PopoverAnchor>
      <PopoverContent
        side={isMobile ? "bottom" : "right"}
        sideOffset={isMobile ? -28 : 4}
        className="w-auto border-0 p-0"
      >
        <Picker
          data={data}
          onEmojiSelect={(icon: IconProps) => onChange(icon)}
          theme={resolvedTheme}
        />
      </PopoverContent>
    </Popover>
  );
}
