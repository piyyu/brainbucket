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
import { BookMarked } from "lucide-react"
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
          className="p-3 rounded-lg bg-[#111] border border-[#333] text-[#666] hover:text-[#e5e5e5] hover:border-[#666] hover:bg-[#1a1a1a] transition-all relative group shadow-[2px_2px_0px_#000] h-10 w-10"
        >
          <BookMarked className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-2xl">
        <div className="relative bg-[#0f1012] border border-[#333] rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">

          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#333] to-transparent" />

          <Command className="bg-transparent rounded-none border-none">
            <div className="flex items-center px-4 border-b border-[#222]">
              <BookMarked className="w-4 h-4 text-[#555] mr-3" />
              <CommandInput
                placeholder="SEARCH DATABASE..."
                className="font-mono text-xs uppercase tracking-widest text-white placeholder:text-[#333] h-14"
              />
            </div>

            <CommandList className="max-h-[400px] overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <CommandEmpty className="py-12 text-center">
                <div className="text-[#333] font-mono text-xs uppercase tracking-widest mb-2">No Data Found</div>
                <div className="text-[10px] text-[#222] font-mono">ERR_NULL_RESULT</div>
              </CommandEmpty>

              {!loading && (
                <CommandGroup heading={<span className="text-[10px] text-[#444] font-mono uppercase tracking-widest pl-2 mb-2 block">Available Buckets</span>}>
                  {buckets.map((note) => (
                    <CommandItem
                      key={note._id}
                      value={note.title}
                      onSelect={() => console.log("open note:", note._id)}
                      className="group relative flex items-center justify-between p-3 mb-1 rounded-sm aria-selected:bg-[#1a1a1a] aria-selected:text-white text-[#888] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-1 h-1 bg-[#333] group-aria-selected:bg-white rounded-full transition-colors" />
                        <div>
                          <div className="font-display font-medium text-sm tracking-wide text-white group-aria-selected:text-white/100 text-white/80 transition-colors">
                            {note.title}
                          </div>
                          {note.link && (
                            <div className="text-[10px] font-mono text-[#444] group-aria-selected:text-[#666] transition-colors truncate max-w-[200px]">
                              {note.link}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="opacity-0 group-aria-selected:opacity-100 transition-opacity">
                        <span className="text-[9px] font-mono bg-white text-black px-2 py-1 rounded-sm uppercase tracking-wider">
                          Open
                        </span>
                      </div>


                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>


            <div className="px-4 py-2 border-t border-[#222] bg-[#0c0c0c] flex justify-between items-center text-[9px] font-mono text-[#333] uppercase">
              <span>Total Items: {buckets.length}</span>
              <span>DB_STATUS: ONLINE</span>
            </div>

          </Command>
        </div>
      </DialogContent>
    </Dialog>
  )
}
