"use client";

import { File, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useSearch } from "@/hooks/stores";
import { Doc } from "@/convex/_generated/dataModel";

export default function SearchModal() {
  //尽管没必要，但这里试着用zustand来管理状态
  // const [open, setOpen] = useState(false);
  // const openSearch = useSearch((store) => store.openSearch);
  const toggleSearch = useSearch((store) => store.toggleSearch);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const searchList = useQuery(api.documents.getSearchList);

  return (
    <>
      <SidebarMenuButton onClick={toggleSearch}>
        <Search />
        <span>Search</span>
        <span className="ml-auto text-gray-400">
          <kbd>&#8984;</kbd>+<kbd>K</kbd>
        </span>
      </SidebarMenuButton>
      <SearchPanel searchList={searchList} />
    </>
  );
}

function SearchPanel({ searchList }: { searchList?: Doc<"documents">[] }) {
  const { user } = useUser();
  const isOpen = useSearch((store) => store.isOpen);
  const closeSearch = useSearch((store) => store.closeSearch);
  const router = useRouter();
  function onSelect(documentId: string) {
    router.push(`/documents/${documentId}`);
    closeSearch();
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={closeSearch}>
      {/* 一直报错Type '{ placeholder: string; }' is not assignable to type 'IntrinsicAttributes & RefAttributes<unknown>'，烦了先删了 */}
      <CommandInput placeholder={`Search ${user?.firstName}'s Jotion...`} />
      <CommandList>
        <CommandGroup heading="Documents">
          {searchList === undefined &&
            Array(3)
              .fill(0)
              .map((n) => (
                <CommandItem key={n} disabled>
                  <Skeleton className="h-8 w-full" />
                </CommandItem>
              ))}

          {searchList?.map((doc) => (
            <CommandItem
              key={doc._id}
              value={`${doc._id}-${doc.title}`}
              title={doc.title}
              onSelect={() => onSelect(doc._id)}
            >
              {doc.icon ? (
                <span>{doc.icon}</span>
              ) : (
                <div className="flex items-center justify-center">
                  <File size={16} />
                </div>
              )}
              <span>{doc.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
}
