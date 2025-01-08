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

export default function SearchModal() {
  //尽管没必要，但这里试着用zustand来管理状态
  const { user } = useUser();
  // const [open, setOpen] = useState(false);
  const isOpen = useSearch((store) => store.isOpen);
  const openSearch = useSearch((store) => store.openSearch);
  const closeSearch = useSearch((store) => store.closeSearch);
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

  const router = useRouter();
  function onSelect(documentId: string) {
    router.push(`/documents/${documentId}`);
    closeSearch();
  }

  const searchList = useQuery(api.documents.getSearchList);
  if (searchList == undefined) return <span>Loading</span>;

  return (
    <>
      <SidebarMenuButton onClick={toggleSearch}>
        <Search />
        <span>Search</span>
        <span className="ml-auto text-gray-400">
          <kbd>&#8984;</kbd>+<kbd>K</kbd>
        </span>
      </SidebarMenuButton>

      <CommandDialog open={isOpen} onOpenChange={closeSearch}>
        <CommandInput placeholder={`Search ${user?.firstName}'s Jotion...`} />
        <CommandList>
          <CommandGroup heading="Documents">
            {searchList === undefined &&
              [1, 2, 3].map((n) => (
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
    </>
  );
}
