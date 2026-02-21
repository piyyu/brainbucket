import { useState } from "react"
import { toast } from "sonner"
import axios from "axios";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Bold, Italic, List, ListOrdered, Globe, X, ArrowRight, ArrowLeft, Check } from "lucide-react"
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
                class: 'min-h-[160px] w-full rounded-md bg-transparent px-4 py-3 text-[14px] leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose prose-neutral dark:prose-invert max-w-none prose-p:my-1.5 prose-headings:mb-2 prose-headings:mt-3',
            },
        },
    })

    if (!editor) return null

    return (
        <div className="flex flex-col w-full border border-border/50 rounded-lg bg-background overflow-hidden transition-all duration-200 focus-within:border-ring/30 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]">
            {/* Toolbar */}
            <div className="flex items-center gap-1 border-b border-border/30 bg-muted/20 px-2 py-1.5 select-none shrink-0">
                <ToolbarButton
                    isActive={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    icon={<Bold className="h-4 w-4" strokeWidth={1.75} />}
                    label="Bold"
                />
                <ToolbarButton
                    isActive={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    icon={<Italic className="h-4 w-4" strokeWidth={1.75} />}
                    label="Italic"
                />
                <div className="w-px h-4 bg-border/40 mx-1" />
                <ToolbarButton
                    isActive={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    icon={<List className="h-4 w-4" strokeWidth={1.75} />}
                    label="Bullet list"
                />
                <ToolbarButton
                    isActive={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    icon={<ListOrdered className="h-4 w-4" strokeWidth={1.75} />}
                    label="Ordered list"
                />
            </div>
            <EditorContent editor={editor} className="flex-1 overflow-y-auto max-h-[200px]" />
        </div>
    )
}

const ToolbarButton = ({ isActive, onClick, icon, label }: { isActive: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button
        title={label}
        className={`h-8 w-8 flex items-center justify-center rounded-md transition-all cursor-pointer ${isActive
            ? 'bg-accent text-accent-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
        onClick={(e) => { e.preventDefault(); onClick() }}
    >
        {icon}
    </button>
)

const STEPS = ["Name", "Source", "Details"] as const;
type Step = typeof STEPS[number];

export function AddBucket({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    const currentStep: Step = STEPS[stepIndex];

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
            resetAndClose();
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to create bucket.");
        } finally {
            setSaving(false);
        }
    }

    const resetAndClose = () => {
        setTitle("");
        setLink("");
        setDescription("");
        setStepIndex(0);
        onOpenChange(false);
    };

    const canProceed = title.trim().length > 0;

    const goNext = () => {
        if (stepIndex < STEPS.length - 1) setStepIndex(i => i + 1);
        else saveBucket();
    };

    const goBack = () => {
        if (stepIndex > 0) setStepIndex(i => i - 1);
    };

    const isLastStep = stepIndex === STEPS.length - 1;

    return (
        <Dialog open={open} onOpenChange={resetAndClose}>
            <DialogContent className="w-[95vw] sm:w-[560px] h-[480px] bg-background border border-border/50 text-foreground p-0 overflow-hidden rounded-xl shadow-2xl [&>button]:hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 shrink-0">
                    <div>
                        <h2 className="text-[17px] font-semibold text-foreground tracking-[-0.02em]">
                            Create Bucket
                        </h2>
                        <p className="text-[12px] text-muted-foreground mt-0.5">
                            Step {stepIndex + 1} of {STEPS.length} — {currentStep}
                        </p>
                    </div>
                    <button
                        onClick={resetAndClose}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer"
                    >
                        <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="flex gap-1.5 px-6 shrink-0">
                    {STEPS.map((_, i) => {
                        const activeColors = ['bg-indigo-500', 'bg-sky-500', 'bg-emerald-500'];
                        return (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= stepIndex ? activeColors[i] : 'bg-border/40'}`}
                            />
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
                    {currentStep === "Name" && (
                        <div className="space-y-5">
                            <div className="space-y-1">
                                <h3 className="text-[15px] font-medium text-foreground">What's this bucket about?</h3>
                                <p className="text-[13px] text-muted-foreground">Give your new collection a clear, memorable name.</p>
                            </div>
                            <input
                                autoFocus
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && canProceed && goNext()}
                                placeholder="E.g., Project Ideas, Research Logs..."
                                className="w-full h-11 px-4 rounded-lg bg-background border border-border/50 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all shadow-sm"
                            />
                        </div>
                    )}

                    {currentStep === "Source" && (
                        <div className="space-y-5">
                            <div className="space-y-1">
                                <h3 className="text-[15px] font-medium text-foreground flex items-center gap-2">
                                    Add a source link
                                    <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/30">Optional</span>
                                </h3>
                                <p className="text-[13px] text-muted-foreground">Attach a primary URL or website to this bucket.</p>
                            </div>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" strokeWidth={1.5} />
                                <input
                                    autoFocus
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && goNext()}
                                    placeholder="https://"
                                    className="w-full h-11 pl-11 pr-4 rounded-lg bg-background border border-border/50 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/40 transition-all shadow-sm"
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === "Details" && (
                        <div className="space-y-5">
                            <div className="space-y-1">
                                <h3 className="text-[15px] font-medium text-foreground flex items-center gap-2">
                                    Add details
                                    <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/30">Optional</span>
                                </h3>
                                <p className="text-[13px] text-muted-foreground">Jot down notes, context, or any other thoughts.</p>
                            </div>
                            <RichTextEditor content={description} onChange={setDescription} />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border/30 flex items-center justify-between bg-muted/5 shrink-0">
                    <button
                        onClick={goBack}
                        disabled={stepIndex === 0}
                        className="h-9 px-4 flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-all cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
                        Back
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={resetAndClose}
                            className="h-9 px-4 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={goNext}
                            disabled={(currentStep === "Name" && !canProceed) || saving}
                            className="h-9 px-5 rounded-lg font-medium text-[13px] cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:-translate-y-px flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : isLastStep ? (
                                <>
                                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    Create Bucket
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}