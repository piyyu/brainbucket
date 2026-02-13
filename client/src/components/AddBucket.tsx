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
import { Plus, Bold, Italic, List, ListOrdered } from "lucide-react"
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
                class: 'min-h-[300px] w-full rounded-md bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose prose-invert text-white max-w-none',
            },
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col h-full w-full relative group border border-[#333] rounded-sm bg-[#050505] overflow-hidden transition-colors focus-within:border-white/30">
            <EditorContent editor={editor} className="flex-1 overflow-y-auto min-h-[300px]" />
            <div className="flex items-center gap-1 border-t border-[#222] bg-[#0c0c0c] p-1.5 select-none">
                <ToolbarButton
                    isActive={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    icon={<Bold className="h-3 w-3 stroke-[1.5]" />}
                />
                <ToolbarButton
                    isActive={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    icon={<Italic className="h-3 w-3 stroke-[1.5]" />}
                />
                <div className="w-px h-4 bg-[#222] mx-1" />
                <ToolbarButton
                    isActive={editor.isActive('heading', { level: 1 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    icon={<span className="text-[10px] font-bold font-mono">H1</span>}
                />
                <ToolbarButton
                    isActive={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    icon={<span className="text-[10px] font-bold font-mono">H2</span>}
                />
                <div className="w-px h-4 bg-[#222] mx-1" />
                <ToolbarButton
                    isActive={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    icon={<List className="h-3 w-3 stroke-[1.5]" />}
                />
                <ToolbarButton
                    isActive={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    icon={<ListOrdered className="h-3 w-3 stroke-[1.5]" />}
                />
            </div>
        </div>
    )
}

const ToolbarButton = ({ isActive, onClick, icon }: { isActive: boolean, onClick: () => void, icon: React.ReactNode }) => (
    <button
        className={`h-7 w-7 flex items-center justify-center rounded-[2px] transition-all border ${isActive
            ? 'bg-[#1a1a1a] border-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
            : 'bg-transparent border-transparent text-[#555] hover:text-white hover:bg-[#111] hover:border-[#222]'
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
            toast.success("bucket created successfully!");
            setTitle("");
            setLink("");
            setDescription("");
            setOpen(false);
        }
        catch (error) {
            console.error(error);
            toast.error("failed to create bucket. please try again.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    className="bg-[#e5e5e5] text-black hover:bg-white border border-transparent hover:border-white shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all rounded-lg h-10 w-10 flex items-center justify-center"
                >
                    <Plus className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] md:w-full md:max-w-4xl h-[80vh] md:h-[600px] bg-[#0f1012] border border-[#333] text-white p-0 overflow-hidden flex flex-col md:flex-row gap-0 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <Tabs defaultValue="title" className="flex flex-col md:flex-row w-full h-full">


                    <div className="w-full md:w-[240px] shrink-0 border-b md:border-b-0 md:border-r border-[#333] bg-[#0a0a0a] p-4 flex flex-col gap-2">
                        <div className="px-2 mb-6 pt-2">
                            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#555] mb-1">
                                New Entry
                            </h2>
                            <div className="text-xl font-display font-medium text-white tracking-tight">
                                CREATE BUCKET
                            </div>
                        </div>

                        <TabsList className="flex flex-row md:flex-col h-auto bg-transparent gap-1 p-0 w-full">
                            <TabsTrigger
                                value="title"
                                className="w-full justify-start px-3 py-3 data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white data-[state=active]:border-l-2 data-[state=active]:border-white/50 text-[#666] border-l-2 border-transparent hover:text-white hover:bg-[#111] transition-all rounded-r-sm rounded-l-none font-mono text-xs uppercase tracking-wider gap-3"
                            >
                                <Bold className="w-4 h-4" />
                                <span>Identity</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="link"
                                className="w-full justify-start px-3 py-3 data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white data-[state=active]:border-l-2 data-[state=active]:border-white/50 text-[#666] border-l-2 border-transparent hover:text-white hover:bg-[#111] transition-all rounded-r-sm rounded-l-none font-mono text-xs uppercase tracking-wider gap-3"
                            >
                                <div className="w-4 h-4 flex items-center justify-center font-serif italic text-sm">/</div>
                                <span>Source</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="description"
                                className="w-full justify-start px-3 py-3 data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white data-[state=active]:border-l-2 data-[state=active]:border-white/50 text-[#666] border-l-2 border-transparent hover:text-white hover:bg-[#111] transition-all rounded-r-sm rounded-l-none font-mono text-xs uppercase tracking-wider gap-3"
                            >
                                <List className="w-4 h-4" />
                                <span>Context</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>


                    <div className="flex-1 flex flex-col h-full bg-[#0f1012] relative">

                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                        <div className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10">
                            <TabsContent value="title" className="h-full mt-0 outline-none flex flex-col justify-center max-w-lg mx-auto">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-display font-medium text-white tracking-tight">Naming Protocol</h3>
                                        <p className="text-[#666] font-mono text-xs leading-relaxed">
                                            ASSIGN A UNIQUE IDENTIFIER TO THIS DATA BUCKET.
                                        </p>
                                    </div>
                                    <div className="relative group">
                                        <Input
                                            autoFocus
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="BUCKET_NAME..."
                                            className="bg-[#050505] border border-[#333] rounded-sm px-4 py-6 text-lg font-mono text-white placeholder:text-[#333] focus-visible:ring-0 focus-visible:border-white/40 focus-visible:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all uppercase"
                                        />
                                        <div className="absolute -bottom-2 -right-2 w-3 h-3 border-r border-b border-[#333]" />
                                        <div className="absolute -top-2 -left-2 w-3 h-3 border-l border-t border-[#333]" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="link" className="h-full mt-0 outline-none flex flex-col justify-center max-w-lg mx-auto">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-display font-medium text-white tracking-tight">Source Reference</h3>
                                        <p className="text-[#666] font-mono text-xs leading-relaxed">
                                            ATTACH EXTERNAL URL OR RESOURCE LINK.
                                        </p>
                                    </div>
                                    <div className="relative group">
                                        <Input
                                            autoFocus
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            placeholder="HTTPS://..."
                                            className="bg-[#050505] border border-[#333] rounded-sm px-4 py-6 text-lg font-mono text-white placeholder:text-[#333] focus-visible:ring-0 focus-visible:border-white/40 focus-visible:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all"
                                        />
                                        <div className="absolute -bottom-2 -right-2 w-3 h-3 border-r border-b border-[#333]" />
                                        <div className="absolute -top-2 -left-2 w-3 h-3 border-l border-t border-[#333]" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="description" className="h-full pt-4 outline-none flex flex-col">
                                <div className="mb-6 space-y-2">
                                    <h3 className="text-2xl font-display font-medium text-white tracking-tight">Contextual Data</h3>
                                    <p className="text-[#666] font-mono text-xs">ADD NOTES AND DETAILS.</p>
                                </div>
                                <div className="flex-1 bg-[#050505] border border-[#333] rounded-sm overflow-hidden">
                                    <RichTextEditor content={description} onChange={setDescription} />
                                </div>
                            </TabsContent>
                        </div>


                        <div className="p-6 border-t border-[#222] bg-[#0f1012] flex justify-between items-center relative z-20">
                            <DialogClose asChild>
                                <button className="text-[#666] hover:text-white font-mono text-xs uppercase tracking-widest px-4 py-2 hover:bg-[#1a1a1a] transition-colors rounded-sm">
                                    Cancel
                                </button>
                            </DialogClose>

                            <Button
                                onClick={saveBucket}
                                disabled={!title}
                                size="sm"
                                className="bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest rounded-sm px-6"
                            >
                                Initialize Bucket
                            </Button>
                        </div>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
