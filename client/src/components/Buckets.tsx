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
import { FolderHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      <DialogTrigger className="rounded">
        <Button
          variant="default"
          size="icon"
          className="p-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all relative group shadow-sm h-12 w-12"
        >
          <FolderHeart className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-2xl">
        <div className="relative bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden">

          <Command className="bg-transparent rounded-none border-none">
            <div className="flex items-center px-4 border-b border-border/30">
              <FolderHeart className="w-4 h-4 text-muted-foreground mr-3" />
              <CommandInput
                placeholder="Search Knowledge Base..."
                className="text-base text-foreground placeholder:text-muted-foreground h-16"
              />
            </div>

            <CommandList className="max-h-[400px] overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <CommandEmpty className="py-12 text-center">
                <div className="text-foreground font-medium mb-1">No Results found</div>
                <div className="text-sm text-muted-foreground">We couldn't find anything matching your search.</div>
              </CommandEmpty>

              {!loading && (
                <CommandGroup heading={<span className="text-xs text-muted-foreground font-semibold pl-2 mb-2 block uppercase tracking-wider">Available Buckets</span>}>
                  {buckets.map((note) => (
                    <CommandItem
                      key={note._id}
                      value={note.title}
                      onSelect={() => console.log("open note:", note._id)}
                      className="group relative flex items-center justify-between p-3 mb-1 rounded-xl aria-selected:bg-secondary aria-selected:text-foreground text-muted-foreground transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-border group-aria-selected:bg-primary rounded-full transition-colors" />
                        <div>
                          <div className="font-medium text-base text-foreground transition-colors">
                            {note.title}
                          </div>
                          {note.link && (
                            <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                              {note.link}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="opacity-0 group-aria-selected:opacity-100 transition-opacity">
                        <span className="text-xs font-semibold bg-background text-foreground px-3 py-1.5 rounded-full shadow-sm">
                          Open
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>

            <div className="px-6 py-3 border-t border-border/30 bg-secondary/30 flex justify-between items-center text-xs font-medium text-muted-foreground">
              <span>Total Items: {buckets.length}</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Connected</span>
            </div>

          </Command>
        </div>
      </DialogContent>
    </Dialog>
  )
}
