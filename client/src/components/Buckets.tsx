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
import { useEffect, useState } from "react"

export function Buckets() {
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBuckets = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/buckets/list", {
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
      <DialogTrigger className="p-2 rounded">
        <Button variant="default" size="icon" className="bg-[#0f1012] text-white hover:bg-white/10">
          <BookMarked className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0">
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput placeholder="search buckets..." />

          <CommandList>
            <CommandList>
              {loading && (
                <div className="space-y-2 p-4">
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                </div>
              )}

              {!loading && <CommandEmpty>No bucket found.</CommandEmpty>}

              {!loading && (
                <CommandGroup heading="Your Notes">
                  {buckets.map((note) => (
                    <CommandItem
                      key={note._id}
                      value={note.title}
                      onSelect={() => console.log("open note:", note._id)}
                    >
                      <div>
                        {note.title}
                        {note.link && (
                          <div className="text-xs text-gray-500">
                            {note.link}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          {note.description}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>

          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
