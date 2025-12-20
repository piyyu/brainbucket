import { useState } from "react"
import { toast } from "sonner"
import axios from "axios";
import { Button } from "@/components/ui/button"
import ButtonL from "./ButtonL"
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
        <div className="flex flex-col h-full w-full relative group border border-white/10 rounded-lg bg-black/20 overflow-hidden focus-within:ring-1 focus-within:ring-white/20">
            <EditorContent editor={editor} className="flex-1 overflow-y-auto min-h-[300px]" />
            <div className="flex items-center gap-1 border-t border-white/10 bg-white/5 p-2">
                <Button variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('bold') ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'}`} onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}>
                    <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('italic') ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'}`} onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}>
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <Button variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('heading', { level: 1 }) ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'}`} onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run() }}>
                    <span className="text-xs font-bold">H1</span>
                </Button>
                <Button variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('heading', { level: 2 }) ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'}`} onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}>
                    <span className="text-xs font-bold">H2</span>
                </Button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <Button variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('bulletList') ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'}`} onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}>
                    <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className={`h-8 w-8 ${editor.isActive('orderedList') ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'}`} onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}>
                    <ListOrdered className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export function AddBucket() {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false)

    const saveBucket = async (e: React.MouseEvent) => {
        e.preventDefault();
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
                    className="flex gap-2 bg-white text-black font-medium rounded-lg cursor-pointer shadow-[0_14px_30px_rgba(0,0,0,0.25),inset_0_-3px_6px_rgba(236,72,153,0.55)] transition-all duration-200 ease-out hover:shadow-[0_18px_36px_rgba(0,0,0,0.3),inset_0_-4px_8px_rgba(236,72,153,0.65)] hover:bg-white active:shadow-[0_10px_22px_rgba(0,0,0,0.22),inset_0_-2px_4px_rgba(236,72,153,0.45)] active:scale-[0.97] hover:scale-[1.02]"
                >
                    <Plus className="h-4 w-4" />
                    add bucket
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] md:w-full md:max-w-5xl h-[60vh] md:h-[600px] bg-[#0f1012] border-white/10 text-white p-0 overflow-hidden flex flex-col md:flex-row gap-0 rounded-xl">
                <Tabs defaultValue="title" className="flex flex-col md:flex-row w-full h-full">

                    <div className="w-full md:w-[280px] shrink-0 border-b md:border-b-0 md:border-r border-white/10 bg-black/20 p-4 md:p-6 flex flex-col gap-2">
                        <div className="px-2 mb-2 hidden md:block">
                            <h2 className="text-lg font-semibold tracking-tight">add content</h2>
                            <p className="text-xs text-zinc-500">choose a section to edit details.</p>
                        </div>
                        <TabsList className="flex flex-row md:flex-col h-auto bg-transparent gap-2 p-0 w-full overflow-hidden">
                            <TabsTrigger
                                value="title"
                                className="flex-1 md:w-full shrink-0 md:shrink h-auto gap-2 md:gap-3 justify-center md:justify-start px-2 py-2 md:px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg border border-transparent data-[state=active]:border-white/5 transition-all text-left items-center"
                            >
                                <div className="p-1.5 md:p-2 rounded-lg bg-white/5 text-zinc-400 group-data-[state=active]:text-white group-data-[state=active]:bg-white/10">
                                    <Bold className="h-3 w-3 md:h-4 md:w-4" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs md:text-sm font-medium">title</span>
                                    <span className="text-[10px] text-zinc-500 hidden md:block">name your bucket</span>
                                </div>
                            </TabsTrigger>

                            <TabsTrigger
                                value="link"
                                className="flex-1 md:w-full shrink-0 md:shrink h-auto gap-2 md:gap-3 justify-center md:justify-start px-2 py-2 md:px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg border border-transparent data-[state=active]:border-white/5 transition-all text-left items-center"
                            >
                                <div className="p-1.5 md:p-2 rounded-lg bg-white/5 text-zinc-400 group-data-[state=active]:text-white group-data-[state=active]:bg-white/10">
                                    <div className="h-3 w-3 md:h-4 md:w-4 flex items-center justify-center font-serif italic text-xs md:text-sm">/</div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs md:text-sm font-medium">link</span>
                                    <span className="text-[10px] text-zinc-500 hidden md:block">attach a url</span>
                                </div>
                            </TabsTrigger>

                            <TabsTrigger
                                value="description"
                                className="flex-1 md:w-full shrink-0 md:shrink h-auto gap-2 md:gap-3 justify-center md:justify-start px-2 py-2 md:px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg border border-transparent data-[state=active]:border-white/5 transition-all text-left items-center"
                            >
                                <div className="p-1.5 md:p-2 rounded-lg bg-white/5 text-zinc-400 group-data-[state=active]:text-white group-data-[state=active]:bg-white/10">
                                    <List className="h-3 w-3 md:h-4 md:w-4" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs md:text-sm font-medium">desc</span>
                                    <span className="text-[10px] text-zinc-500 hidden md:block">write notes & details</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 flex flex-col h-full bg-[#0f1012]">
                        <div className="flex-1 p-6 overflow-y-auto">
                            <TabsContent value="title" className="h-full mt-0 focus-visible:ring-0 outline-none">
                                <div className="flex flex-col h-full">
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-semibold mb-2">title</h3>
                                        <p className="text-zinc-500 hidden md:block">give this bucket a unique name to identify it later.</p>
                                    </div>
                                    <Input
                                        autoFocus
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="enter bucket title..."
                                        className="bg-white/5 border border-white/5 px-3 py-3 text-sm md:text-lg font-medium focus-visible:ring-0 focus-visible:border-white/20 placeholder:text-zinc-700 h-auto rounded-lg"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="link" className="h-full mt-0 focus-visible:ring-0 outline-none">
                                <div className="flex flex-col h-full">
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-semibold mb-2">link</h3>
                                        <p className="text-zinc-500 hidden md:block">paste a url to associate with this bucket.</p>
                                    </div>
                                    <Input
                                        autoFocus
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        placeholder="https://example.com/..."
                                        className="bg-white/5 border border-white/5 px-3 py-3 text-sm md:text-lg font-mono text-white focus-visible:ring-0 focus-visible:border-white/20 placeholder:text-zinc-700 h-auto rounded-lg"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="description" className="h-full pt-4 focus-visible:ring-0 outline-none flex flex-col">
                                <RichTextEditor content={description} onChange={setDescription} />
                            </TabsContent>
                        </div>

                        <div className="p-6 flex justify-end items-center gap-3">
                            <DialogClose asChild>
                                <Button variant="ghost" className="hover:bg-white/10 hover:text-white text-zinc-400 rounded-lg">cancel</Button>
                            </DialogClose>
                            <ButtonL
                                onClick={saveBucket}
                                disabled={!title}
                                size="small"
                                className="rounded-lg"
                            >
                                save bucket
                            </ButtonL>
                        </div>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
