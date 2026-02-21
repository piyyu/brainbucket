import { useState } from "react"
import { toast } from "sonner"
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Bold, Italic, List, ListOrdered, Globe, Type, AlignLeft, ArrowRight, ArrowLeft, X, Check } from "lucide-react"
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
            <EditorContent editor={editor} className="flex-1 overflow-y-auto min-h-[200px] max-h-[240px]" />
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

const STEPS = [
    {
        key: "title",
        icon: Type,
        label: "Name",
        title: "Name your bucket",
        subtitle: "Give this collection a clear, memorable name.",
        color: "text-indigo-400",
        bg: "from-indigo-500/15 to-violet-500/15",
        border: "border-indigo-500/20",
    },
    {
        key: "link",
        icon: Globe,
        label: "Source",
        title: "Add a source link",
        subtitle: "Optional — attach a URL or resource to this bucket.",
        color: "text-sky-400",
        bg: "from-sky-500/15 to-blue-500/15",
        border: "border-sky-500/20",
    },
    {
        key: "description",
        icon: AlignLeft,
        label: "Details",
        title: "Add details",
        subtitle: "Write down notes, ideas, or anything you want to remember.",
        color: "text-emerald-400",
        bg: "from-emerald-500/15 to-teal-500/15",
        border: "border-emerald-500/20",
    },
];

export function AddBucket({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [description, setDescription] = useState("");
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);

    const currentStep = STEPS[step];
    const filled = [title, link, description];

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
            setStep(0);
            onOpenChange(false);
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to create bucket.");
        } finally {
            setSaving(false);
        }
    }

    const handleClose = () => {
        setStep(0);
        onOpenChange(false);
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) setStep(step + 1);
        else saveBucket();
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const canProceed = step === 0 ? title.trim().length > 0 : true;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] md:w-full md:max-w-[560px] bg-background border border-border/50 text-foreground p-0 overflow-hidden rounded-xl shadow-2xl [&>button]:hidden">

                {/* Header */}
                {/* Header */}
                <div className="relative px-6 pt-10 pb-6 text-center border-b border-border/30 bg-muted/5">
                    {/* Ambient glow */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[150px] bg-gradient-to-b ${currentStep.bg} opacity-50 blur-[50px] pointer-events-none transition-all duration-700`} />

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer z-20"
                    >
                        <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>

                    <div className="flex flex-col items-center gap-4 relative z-10">
                        {/* Icon */}
                        <motion.div
                            key={step}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentStep.bg} ${currentStep.border} border flex items-center justify-center shadow-[0_4_20px_0_rgba(0,0,0,0.1)] transition-colors duration-500`}
                        >
                            <currentStep.icon className={`w-5 h-5 ${currentStep.color}`} strokeWidth={1.5} />
                        </motion.div>

                        <div className="space-y-1">
                            <h2 className="text-[22px] font-semibold text-foreground tracking-[-0.02em] leading-tight flex items-center justify-center gap-2">
                                {currentStep.title}
                            </h2>
                            <p className="text-[14px] text-muted-foreground">
                                {currentStep.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Node-based Progress Indicator */}
                    <div className="max-w-[200px] mx-auto mt-8 relative z-10">
                        <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-border/40 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-500/50"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                        </div>
                        <div className="flex justify-between relative">
                            {STEPS.map((s, i) => (
                                <button
                                    key={s.key}
                                    onClick={() => (i === 0 || filled[i - 1] || title) && setStep(i)}
                                    className={`relative w-3.5 h-3.5 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center
                                        ${i === step ? "bg-background border-2 border-indigo-500 ring-4 ring-indigo-500/10 scale-125" :
                                            filled[i] || i < step ? "bg-indigo-500 border border-indigo-500" : "bg-background border-2 border-border/60 hover:border-foreground/30"}`}
                                >
                                    {/* Inner white dot for completed steps */}
                                    {(filled[i] || i < step) && i !== step && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-background" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content area */}
                <div className="px-6 pt-6 pb-2 min-h-[300px] relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -12 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {/* Title/Subtitle removed here because they're now in the centered header above */}

                            {step === 0 && (
                                <div className="space-y-2">
                                    <input
                                        autoFocus
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && canProceed && handleNext()}
                                        placeholder="E.g. Project Ideas, Reading List..."
                                        className="w-full h-12 px-4 rounded-lg bg-background border border-border/50 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all"
                                    />
                                    <p className="text-[11px] text-muted-foreground/50 pl-1">
                                        Press Enter to continue
                                    </p>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" strokeWidth={1.5} />
                                        <input
                                            autoFocus
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleNext()}
                                            placeholder="https://example.com/article"
                                            className="w-full h-12 pl-11 pr-4 rounded-lg bg-background border border-border/50 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 transition-all"
                                        />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground/50 pl-1">
                                        Optional — you can skip this step
                                    </p>
                                </div>
                            )}

                            {step === 2 && (
                                <RichTextEditor content={description} onChange={setDescription} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border/30 flex items-center justify-between bg-muted/10">
                    <button
                        onClick={step === 0 ? handleClose : handleBack}
                        className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-accent/50 transition-all cursor-pointer"
                    >
                        {step === 0 ? (
                            "Cancel"
                        ) : (
                            <>
                                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                                Back
                            </>
                        )}
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleNext}
                            disabled={!canProceed || saving}
                            className="group rounded-lg font-medium px-4 text-[13px] h-9 cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-px flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : step === STEPS.length - 1 ? (
                                <>
                                    <Check className="w-3.5 h-3.5" strokeWidth={2} />
                                    Create Bucket
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
