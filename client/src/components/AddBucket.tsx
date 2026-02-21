import { useState } from "react"
import { toast } from "sonner"
import axios from "axios";
import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, Bold, Italic, List, ListOrdered, LinkIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const RichTextEditor = ({ content, onChange }: { content: string, onChange: (content: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write a description...',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'min-h-[300px] w-full rounded-md bg-transparent px-4 py-3 text-[14px] placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose prose-neutral dark:prose-invert max-w-none',
            },
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col h-full w-full relative group border border-border rounded-lg bg-background overflow-hidden transition-colors focus-within:border-ring">
            <EditorContent editor={editor} className="flex-1 overflow-y-auto min-h-[300px]" />
            <div className="flex items-center gap-0.5 border-t border-border bg-muted/50 p-1.5 select-none">
                <ToolbarButton
                    isActive={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    icon={<Bold className="h-3.5 w-3.5" strokeWidth={1.75} />}
                />
                <ToolbarButton
                    isActive={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    icon={<Italic className="h-3.5 w-3.5" strokeWidth={1.75} />}
                />
                <div className="w-px h-4 bg-border mx-0.5" />
                <ToolbarButton
                    isActive={editor.isActive('heading', { level: 1 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    icon={<span className="text-[10px] font-bold leading-none">H1</span>}
                />
                <ToolbarButton
                    isActive={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    icon={<span className="text-[10px] font-bold leading-none">H2</span>}
                />
                <div className="w-px h-4 bg-border mx-0.5" />
                <ToolbarButton
                    isActive={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    icon={<List className="h-3.5 w-3.5" strokeWidth={1.75} />}
                />
                <ToolbarButton
                    isActive={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    icon={<ListOrdered className="h-3.5 w-3.5" strokeWidth={1.75} />}
                />
            </div>
        </div>
    )
}

const ToolbarButton = ({ isActive, onClick, icon }: { isActive: boolean, onClick: () => void, icon: React.ReactNode }) => (
    <button
        className={`h-7 w-7 flex items-center justify-center rounded transition-colors cursor-pointer ${isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
        onClick={(e) => { e.preventDefault(); onClick() }}
    >
        {icon}
    </button>
)

export function AddBucket() {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false)

    const saveBucket = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/bucket/create`, {
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
            <DialogTrigger asChild>
                <button className="w-full flex items-center gap-2.5 px-2.5 py-[7px] bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md font-medium text-[13px] cursor-pointer">
                    <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>New Bucket</span>
                </button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] md:w-full md:max-w-4xl h-[80vh] md:h-[600px] bg-background border border-border text-foreground p-0 overflow-hidden flex flex-col md:flex-row gap-0 rounded-lg shadow-vercel">
                <Tabs defaultValue="title" className="flex flex-col md:flex-row w-full h-full">

                    <div className="w-full md:w-[240px] shrink-0 border-b md:border-b-0 md:border-r border-border bg-muted/30 p-5 flex flex-col gap-1">
                        <div className="mb-6 pt-1">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                                New Entry
                            </p>
                            <h2 className="text-xl font-semibold text-foreground tracking-[-0.02em]">
                                Create Bucket
                            </h2>
                        </div>

                        <TabsList className="flex flex-row md:flex-col h-auto bg-transparent gap-0.5 p-0 w-full">
                            <TabsTrigger
                                value="title"
                                className="w-full justify-start px-3 py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors rounded-md font-medium text-[13px] gap-2.5 cursor-pointer"
                            >
                                <Bold className="w-3.5 h-3.5" strokeWidth={1.75} />
                                <span>Identity</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="link"
                                className="w-full justify-start px-3 py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors rounded-md font-medium text-[13px] gap-2.5 cursor-pointer"
                            >
                                <LinkIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                                <span>Source</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="description"
                                className="w-full justify-start px-3 py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors rounded-md font-medium text-[13px] gap-2.5 cursor-pointer"
                            >
                                <List className="w-3.5 h-3.5" strokeWidth={1.75} />
                                <span>Context</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>


                    <div className="flex-1 flex flex-col h-full bg-background relative">
                        <div className="flex-1 p-8 md:p-10 overflow-y-auto relative z-10">
                            <TabsContent value="title" className="h-full mt-0 outline-none flex flex-col justify-center max-w-lg mx-auto">
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <h3 className="text-2xl font-semibold text-foreground tracking-[-0.02em]">Name your bucket</h3>
                                        <p className="text-muted-foreground text-[13px]">
                                            Give this collection a clear, memorable name.
                                        </p>
                                    </div>
                                    <Input
                                        autoFocus
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="E.g. Project Ideas..."
                                        className="bg-background border border-border rounded-md h-10 px-3 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 transition-shadow"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="link" className="h-full mt-0 outline-none flex flex-col justify-center max-w-lg mx-auto">
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <h3 className="text-2xl font-semibold text-foreground tracking-[-0.02em]">Add a source</h3>
                                        <p className="text-muted-foreground text-[13px]">
                                            Attach an external URL or resource link to this bucket.
                                        </p>
                                    </div>
                                    <Input
                                        autoFocus
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        placeholder="https://..."
                                        className="bg-background border border-border rounded-md h-10 px-3 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 transition-shadow"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="description" className="h-full mt-0 outline-none flex flex-col">
                                <div className="mb-5 space-y-1.5">
                                    <h3 className="text-xl font-semibold text-foreground tracking-[-0.02em]">Add context</h3>
                                    <p className="text-muted-foreground text-[13px]">Write down your initial thoughts and details.</p>
                                </div>
                                <div className="flex-1">
                                    <RichTextEditor content={description} onChange={setDescription} />
                                </div>
                            </TabsContent>
                        </div>

                        <div className="px-5 py-4 border-t border-border flex justify-between items-center relative z-20">
                            <DialogClose asChild>
                                <button className="text-muted-foreground hover:text-foreground font-medium text-[13px] px-3 py-1.5 hover:bg-accent transition-colors rounded-md cursor-pointer">
                                    Cancel
                                </button>
                            </DialogClose>

                            <Button
                                onClick={saveBucket}
                                disabled={!title}
                                className="rounded-md font-medium px-4 text-[13px] h-9 cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-40"
                            >
                                Create Bucket
                            </Button>
                        </div>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
