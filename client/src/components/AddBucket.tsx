import { useState } from "react"
import { toast } from "sonner"
import axios from "axios";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Bold, Italic, List, ListOrdered, Globe, X } from "lucide-react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const RichTextEditor = ({ content, onChange }: { content: string, onChange: (content: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Add notes, ideas, or anything you want to remember...',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'min-h-[200px] w-full rounded-md bg-transparent px-4 py-3 text-[14px] leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose prose-neutral dark:prose-invert max-w-none prose-p:my-1.5 prose-headings:mb-2 prose-headings:mt-3',
            },
        },
    })

    if (!editor) return null

    return (
        <div className="flex flex-col w-full relative border border-border/50 rounded-lg bg-background overflow-hidden transition-all duration-200 focus-within:border-ring/30 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.06)]">
            <EditorContent editor={editor} className="flex-1 overflow-y-auto min-h-[100px] max-h-[160px]" />
            <div className="flex items-center gap-0.5 border-t border-border/30 bg-muted/30 p-1.5 select-none">
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
                <div className="w-px h-4 bg-border/30 mx-0.5" />
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


export function AddBucket({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);



    const saveBucket = async () => {
        if (!title || saving) return;
        setSaving(true);
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
            toast.success("Bucket created!");
            setTitle("");
            setLink("");
            setDescription("");
            onOpenChange(false);
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to create bucket.");
        } finally {
            setSaving(false);
        }
    }

    const canProceed = title.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] md:w-full md:max-w-[460px] bg-background border border-border/50 text-foreground p-0 overflow-hidden rounded-xl shadow-xl [&>button]:hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 bg-muted/5">
                    <h2 className="text-[15px] font-semibold text-foreground tracking-[-0.01em]">
                        Create Bucket
                    </h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer"
                    >
                        <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-foreground/80">Name</label>
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && canProceed && saveBucket()}
                            placeholder="Project Ideas, Research..."
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border/50 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-foreground/80 flex items-center justify-between">
                            Source Link <span className="text-[11px] text-muted-foreground/50 font-normal">Optional</span>
                        </label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" strokeWidth={1.5} />
                            <input
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && canProceed && saveBucket()}
                                placeholder="https://..."
                                className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-border/50 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-foreground/80 flex items-center justify-between">
                            Details <span className="text-[11px] text-muted-foreground/50 font-normal">Optional</span>
                        </label>
                        <RichTextEditor content={description} onChange={setDescription} />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-border/30 flex items-center justify-end gap-2 bg-muted/10">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={saveBucket}
                        disabled={!canProceed || saving}
                        className="rounded-lg font-medium px-4 text-[13px] h-8 cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:-translate-y-px flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                Creating
                            </>
                        ) : (
                            "Create"
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
