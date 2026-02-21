import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { FolderHeart, Search } from "lucide-react"

import axios from "axios"
import { useState } from "react"

export interface Bucket {
  _id: string;
  title: string;
  link?: string;
  description?: string;
}

export function Buckets() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuckets = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/buckets/list`, {
        headers: {
          auth: localStorage.getItem("token") || ""
        }
      });
      setBuckets(res.data.contents);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog onOpenChange={(open) => {
      open && fetchBuckets();
    }}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground text-[13px] font-medium transition-colors outline-none cursor-pointer">
          <FolderHeart className="w-4 h-4" strokeWidth={1.5} />
          <span>Explore Buckets</span>
        </button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-xl">
        <div className="relative bg-popover border border-border rounded-lg shadow-vercel overflow-hidden">

          <Command className="bg-transparent rounded-none border-none">
            <div className="flex items-center gap-2 px-3 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
              <CommandInput
                placeholder="Search buckets..."
                className="text-[14px] text-foreground placeholder:text-muted-foreground h-11 border-none focus:ring-0 px-0"
              />
            </div>

            <CommandList className="max-h-[320px] overflow-y-auto p-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <CommandEmpty className="py-8 text-center">
                <div className="text-foreground font-medium text-[14px] mb-0.5">No results found</div>
                <div className="text-[13px] text-muted-foreground">Try a different search term.</div>
              </CommandEmpty>

              {!loading && (
                <CommandGroup heading={<span className="text-[11px] text-muted-foreground font-medium px-1.5 mb-1 block uppercase tracking-wider">Buckets</span>}>
                  {buckets.map((note) => (
                    <CommandItem
                      key={note._id}
                      value={note.title}
                      onSelect={() => console.log("open note:", note._id)}
                      className="group relative flex items-center justify-between px-2.5 py-2 rounded-md aria-selected:bg-accent aria-selected:text-accent-foreground text-foreground transition-colors cursor-pointer text-[13px]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-border group-aria-selected:bg-foreground rounded-full transition-colors shrink-0" />
                        <div>
                          <div className="font-medium text-[14px]">
                            {note.title}
                          </div>
                          {note.link && (
                            <div className="text-[12px] text-muted-foreground truncate max-w-[280px]">
                              {note.link}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="opacity-0 group-aria-selected:opacity-100 transition-opacity">
                        <span className="text-[11px] font-medium bg-background border border-border text-foreground px-2 py-1 rounded">
                          Open
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>

            <div className="px-3 py-2 border-t border-border flex justify-between items-center text-[11px] text-muted-foreground">
              <span>{buckets.length} items</span>
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Connected</span>
            </div>

          </Command>
        </div>
      </DialogContent>
    </Dialog>
  )
}
