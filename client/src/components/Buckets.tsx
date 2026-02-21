import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Search, ExternalLink, FileText } from "lucide-react"

import axios from "axios"
import { useState, useEffect } from "react"

export interface Bucket {
  _id: string;
  title: string;
  link?: string;
  description?: string;
}

export function Buckets({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
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

  useEffect(() => {
    if (open) fetchBuckets();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-xl [&>button]:hidden">
        <div className="bg-popover border border-border/50 rounded-xl shadow-2xl overflow-hidden">
          <Command className="bg-transparent rounded-none border-none">
            {/* Search header */}
            <div className="flex items-center gap-2.5 px-4 border-b border-border/50 bg-secondary/10">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
              <CommandInput
                placeholder="Search buckets..."
                className="text-[14px] text-foreground placeholder:text-muted-foreground h-12 border-none focus:ring-0 px-0 bg-transparent"
              />
            </div>

            {/* Results */}
            <CommandList className="max-h-[360px] overflow-y-auto p-2">
              <CommandEmpty className="py-12 text-center">
                <FileText className="w-8 h-8 mx-auto text-muted-foreground/30 mb-3" strokeWidth={1} />
                <div className="text-foreground font-medium text-[14px] mb-0.5">No buckets found</div>
                <div className="text-[13px] text-muted-foreground">Try a different search or create a new bucket.</div>
              </CommandEmpty>

              {!loading && buckets.length > 0 && (
                <CommandGroup heading={
                  <span className="text-[11px] text-muted-foreground font-medium px-1 mb-1 block uppercase tracking-wider">
                    {buckets.length} Bucket{buckets.length !== 1 ? "s" : ""}
                  </span>
                }>
                  {buckets.map((note) => (
                    <CommandItem
                      key={note._id}
                      value={note.title}
                      onSelect={() => console.log("open note:", note._id)}
                      className="group relative flex items-center gap-3 px-3 py-3 rounded-lg aria-selected:bg-accent/60 text-foreground transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-secondary border border-border/50 flex items-center justify-center shrink-0 group-aria-selected:border-white/10 transition-colors">
                        <FileText className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[14px] truncate">
                          {note.title}
                        </div>
                        {note.link && (
                          <div className="text-[12px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                            <ExternalLink className="w-3 h-3 shrink-0" strokeWidth={1.5} />
                            <span className="truncate">{note.link}</span>
                          </div>
                        )}
                      </div>
                      <div className="opacity-0 group-aria-selected:opacity-100 transition-opacity">
                        <span className="text-[11px] font-medium bg-background border border-border/50 text-foreground px-2 py-1 rounded-md">
                          Open
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>

            {/* Status bar */}
            <div className="px-4 py-2.5 border-t border-border/50 flex justify-between items-center text-[11px] text-muted-foreground bg-secondary/10">
              <span>{buckets.length} item{buckets.length !== 1 ? "s" : ""}</span>
              <span className="flex items-center gap-1.5">
                <span className="text-muted-foreground/50">↵ to select</span>
                <span className="mx-1 text-border">·</span>
                <span className="text-muted-foreground/50">esc to close</span>
              </span>
            </div>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  )
}
