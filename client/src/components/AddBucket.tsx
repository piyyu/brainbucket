import { useState } from "react"
import { toast } from "sonner"

import axios from "axios";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export function AddBucket() {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false)


    const saveBucket = async () => {

        try {
            await axios.post("http://localhost:3000/api/v1/bucket/create", {
                title,
                link,
                description
            }, {
                headers: {
                    auth: localStorage.getItem("token") || ""
                }
            });
            toast.success("Bucket created successfully!");
                setTitle("");
                setLink("");
                setDescription("");
                setOpen(false);
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to create bucket. Please try again.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button className="flex gap-2">
                        <Plus className="h-4 w-4" />
                        add bucket
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] sm:min-h-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add a new bucket</DialogTitle>
                        <DialogDescription>
                            Enter the details below to create a new bucket.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="title">title</Label>
                            <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="link">link</Label>
                            <Input id="link" name="link" value={link} onChange={(e) => setLink(e.target.value)} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">description</Label>
                            <Input id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={saveBucket}>save bucket</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
