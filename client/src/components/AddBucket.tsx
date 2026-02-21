import { useState } from "react"
import { toast } from "sonner"
import axios from "axios";

import {
    Dialog,
    DialogClose,
    DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Bold, Italic, List, ListOrdered, LinkIcon, Sparkles, FileText, Globe, ArrowRight } from "lucide-react"
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
                class: 'min-h-[250px] w-full rounded-md bg-transparent px-4 py-3 text-[14px] placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose prose-neutral dark:prose-invert max-w-none',
            },
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col h-full w-full relative group border border-border/50 rounded-xl bg-background overflow-hidden transition-all focus-within:border-ring/50 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]">
            <EditorContent editor={editor} className="flex-1 overflow-y-auto min-h-[250px]" />
            <div className="flex items-center gap-0.5 border-t border-border/50 bg-secondary/20 p-1.5 select-none">
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
                <div className="w-px h-4 bg-border/50 mx-0.5" />
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
                <div className="w-px h-4 bg-border/50 mx-0.5" />
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
        className={`h-7 w-7 flex items-center justify-center rounded-md transition-all cursor-pointer ${isActive
            ? 'bg-accent text-accent-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
        onClick={(e) => { e.preventDefault(); onClick() }}
    >
        {icon}
    </button>
)

const steps = [
    {
        value: "title",
        icon: FileText,
        label: "Identity",
        color: "text-indigo-400",
        gradient: "from-indigo-500/20 to-violet-500/20",
    },
    {
        value: "link",
        icon: Globe,
        label: "Source",
        color: "text-sky-400",
        gradient: "from-sky-500/20 to-blue-500/20",
    },
    {
        value: "description",
        icon: List,
        label: "Context",
        color: "text-emerald-400",
        gradient: "from-emerald-500/20 to-teal-500/20",
    },
];

export function AddBucket({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [description, setDescription] = useState("");

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
            onOpenChange(false);
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to create bucket. Please try again.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] md:w-full md:max-w-4xl h-[80vh] md:h-[600px] bg-background border border-border/50 text-foreground p-0 overflow-hidden flex flex-col md:flex-row gap-0 rounded-2xl shadow-2xl [&>button]:hidden">
                <Tabs defaultValue="title" className="flex flex-col md:flex-row w-full h-full">

                    {/* Sidebar panel */}
                    <div className="w-full md:w-[240px] shrink-0 border-b md:border-b-0 md:border-r border-border/30 bg-secondary/10 p-5 flex flex-col gap-1 relative overflow-hidden">
                        {/* Ambient glow */}
                        <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

                        <div className="mb-6 pt-1 relative z-10">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/10 flex items-center justify-center mb-3">
                                <Sparkles className="w-4.5 h-4.5 text-indigo-400" strokeWidth={1.5} />
                            </div>
                            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1">
                                New Entry
                            </p>
                            <h2 className="text-xl font-semibold text-foreground tracking-[-0.02em]">
                                Create Bucket
                            </h2>
                        </div>

                        <TabsList className="flex flex-row md:flex-col h-auto bg-transparent gap-1 p-0 w-full relative z-10">
                            {steps.map((step) => (
                                <TabsTrigger
                                    key={step.value}
                                    value={step.value}
                                    className="group w-full justify-start px-3 py-2.5 data-[state=active]:bg-accent/60 data-[state=active]:text-accent-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground transition-all rounded-lg font-medium text-[13px] gap-2.5 cursor-pointer relative overflow-hidden"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-100 data-[state=active]:opacity-0 transition-opacity duration-300 pointer-events-none rounded-lg`} />
                                    <span className={`relative z-10 ${step.color}`}>
                                        <step.icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                                    </span>
                                    <span className="relative z-10">{step.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Progress indicator */}
                        <div className="mt-auto pt-4 relative z-10">
                            <div className="flex items-center gap-1.5">
                                {steps.map((step, i) => (
                                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${(step.value === "title" && title) ||
                                            (step.value === "link" && link) ||
                                            (step.value === "description" && description)
                                            ? "bg-indigo-500/60"
                                            : "bg-border/30"
                                        }`} />
                                ))}
                            </div>
                            <p className="text-[11px] text-muted-foreground/50 mt-2">
                                {[title, link, description].filter(Boolean).length} of 3 completed
                            </p>
                        </div>
                    </div>


                    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
                        {/* Content ambient */}
                        <div className="absolute top-[50%] right-[-20%] w-[300px] h-[300px] bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

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
                                        className="bg-background border border-border/50 rounded-xl h-11 px-4 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-ring/50 focus-visible:ring-offset-0 transition-all shadow-sm"
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
                                        className="bg-background border border-border/50 rounded-xl h-11 px-4 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-ring/50 focus-visible:ring-offset-0 transition-all shadow-sm"
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

                        {/* Footer */}
                        <div className="px-5 py-4 border-t border-border/30 flex justify-between items-center relative z-20 bg-secondary/5">
                            <DialogClose asChild>
                                <button className="text-muted-foreground hover:text-foreground font-medium text-[13px] px-3.5 py-2 hover:bg-accent/50 transition-all rounded-lg cursor-pointer">
                                    Cancel
                                </button>
                            </DialogClose>

                            <button
                                onClick={saveBucket}
                                disabled={!title}
                                className="group rounded-lg font-medium px-5 text-[13px] h-9 cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-px flex items-center gap-2 relative overflow-hidden"
                            >
                                <span className="relative z-10">Create Bucket</span>
                                <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog >
    )
}
