"use client";

import data from "@emoji-mart/data/sets/15/native.json";
import Picker from "@emoji-mart/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

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

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={isMobile ? -118 : 4}
        // align="center" //center is default value
        // alignOffset={200} 这行根本不起作用，不懂
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
