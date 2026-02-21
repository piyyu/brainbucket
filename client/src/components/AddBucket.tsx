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
                class: 'min-h-[300px] w-full rounded-md bg-transparent px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose prose-neutral dark:prose-invert max-w-none',
            },
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col h-full w-full relative group border border-border/50 rounded-xl bg-card overflow-hidden transition-colors focus-within:border-primary/50">
            <EditorContent editor={editor} className="flex-1 overflow-y-auto min-h-[300px]" />
            <div className="flex items-center gap-1 border-t border-border/50 bg-secondary/30 p-2 select-none">
                <ToolbarButton
                    isActive={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    icon={<Bold className="h-4 w-4" />}
                />
                <ToolbarButton
                    isActive={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    icon={<Italic className="h-4 w-4" />}
                />
                <div className="w-px h-5 bg-border mx-1" />
                <ToolbarButton
                    isActive={editor.isActive('heading', { level: 1 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    icon={<span className="text-xs font-bold">H1</span>}
                />
                <ToolbarButton
                    isActive={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    icon={<span className="text-xs font-bold">H2</span>}
                />
                <div className="w-px h-5 bg-border mx-1" />
                <ToolbarButton
                    isActive={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    icon={<List className="h-4 w-4" />}
                />
                <ToolbarButton
                    isActive={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    icon={<ListOrdered className="h-4 w-4" />}
                />
            </div>
        </div>
    )
}

const ToolbarButton = ({ isActive, onClick, icon }: { isActive: boolean, onClick: () => void, icon: React.ReactNode }) => (
    <button
        className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary'
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
                <Button
                    size="icon"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all rounded-xl h-12 w-12 flex items-center justify-center"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] md:w-full md:max-w-4xl h-[80vh] md:h-[600px] bg-card border border-border/50 text-foreground p-0 overflow-hidden flex flex-col md:flex-row gap-0 rounded-[2rem] shadow-xl">
                <Tabs defaultValue="title" className="flex flex-col md:flex-row w-full h-full">

                    <div className="w-full md:w-[260px] shrink-0 border-b md:border-b-0 md:border-r border-border/50 bg-secondary/20 p-6 flex flex-col gap-2">
                        <div className="mb-8 pt-2">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                New Entry
                            </h2>
                            <div className="text-2xl font-display font-semibold text-foreground tracking-tight">
                                Create Bucket
                            </div>
                        </div>

                        <TabsList className="flex flex-row md:flex-col h-auto bg-transparent gap-2 p-0 w-full">
                            <TabsTrigger
                                value="title"
                                className="w-full justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all rounded-xl font-medium text-sm gap-3"
                            >
                                <Bold className="w-4 h-4" />
                                <span>Identity</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="link"
                                className="w-full justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all rounded-xl font-medium text-sm gap-3"
                            >
                                <LinkIcon className="w-4 h-4" />
                                <span>Source</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="description"
                                className="w-full justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all rounded-xl font-medium text-sm gap-3"
                            >
                                <List className="w-4 h-4" />
                                <span>Context</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>


                    <div className="flex-1 flex flex-col h-full bg-card relative">
                        <div className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10">
                            <TabsContent value="title" className="h-full mt-0 outline-none flex flex-col justify-center max-w-lg mx-auto">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-display font-semibold text-foreground tracking-tight">Name your bucket</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Give this collection a clear, memorable name.
                                        </p>
                                    </div>
                                    <Input
                                        autoFocus
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="E.g. Project Ideas..."
                                        className="bg-secondary/30 border-transparent rounded-xl px-6 py-8 text-xl font-medium text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-transparent transition-all shadow-sm"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="link" className="h-full mt-0 outline-none flex flex-col justify-center max-w-lg mx-auto">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-display font-semibold text-foreground tracking-tight">Add a source</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Attach an external URL or resource link to this bucket.
                                        </p>
                                    </div>
                                    <Input
                                        autoFocus
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        placeholder="https://..."
                                        className="bg-secondary/30 border-transparent rounded-xl px-6 py-8 text-xl font-medium text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-transparent transition-all shadow-sm"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="description" className="h-full mt-0 outline-none flex flex-col">
                                <div className="mb-6 space-y-2">
                                    <h3 className="text-2xl font-display font-semibold text-foreground tracking-tight">Add context</h3>
                                    <p className="text-muted-foreground text-sm">Write down your initial thoughts and details.</p>
                                </div>
                                <div className="flex-1">
                                    <RichTextEditor content={description} onChange={setDescription} />
                                </div>
                            </TabsContent>
                        </div>

                        <div className="p-6 border-t border-border/50 bg-secondary/10 flex justify-between items-center relative z-20">
                            <DialogClose asChild>
                                <button className="text-muted-foreground hover:text-foreground font-medium text-sm px-6 py-2.5 hover:bg-secondary transition-colors rounded-xl">
                                    Cancel
                                </button>
                            </DialogClose>

                            <Button
                                onClick={saveBucket}
                                disabled={!title}
                                size="lg"
                                className="rounded-xl font-semibold px-8"
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
