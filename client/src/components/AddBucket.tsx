import { useState } from "react"
import { toast } from "sonner"
import axios from "axios";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bold, Italic, List, ListOrdered, Globe, X, Type, AlignLeft } from "lucide-react"
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
        <div className="flex flex-col w-full h-full relative border-none bg-transparent">
            <EditorContent editor={editor} className="flex-1 overflow-y-auto h-[120px] max-h-[160px] md:h-[180px] md:max-h-[200px]" />
            <div className="flex items-center gap-0.5 border-t border-border/30 bg-muted/30 p-1.5 select-none rounded-b-xl">
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

    const [activeTab, setActiveTab] = useState("name");

    const handleTabChange = (val: string) => setActiveTab(val);

    const canProceed = title.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] md:w-full md:max-w-[760px] bg-background/80 backdrop-blur-xl border border-border/40 text-foreground p-0 overflow-hidden rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] [&>button]:hidden">

                {/* Ambient glow */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="flex h-[420px] relative z-10">
                    {/* Sidebar TabsList */}
                    <div className="w-[200px] shrink-0 border-r border-border/30 bg-secondary/20 flex flex-col justify-between">
                        <div>
                            <div className="h-16 flex items-center px-5 border-b border-border/30">
                                <h2 className="text-[16px] font-semibold text-foreground tracking-[-0.02em]">
                                    Create Bucket
                                </h2>
                            </div>
                            <div className="p-3">
                                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                                    <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1.5 space-y-0">
                                        <TabsTrigger
                                            value="name"
                                            className="w-full justify-start px-3 py-2.5 h-auto text-[13px] font-medium data-[state=active]:bg-background/80 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border/50 rounded-xl group transition-all"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-3 group-data-[state=active]:bg-indigo-500/20 group-data-[state=active]:shadow-inner transition-colors">
                                                <Type className="w-3.5 h-3.5 text-indigo-400 opacity-70 group-data-[state=active]:opacity-100" strokeWidth={2} />
                                            </div>
                                            Name
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="source"
                                            className="w-full justify-start px-3 py-2.5 h-auto text-[13px] font-medium data-[state=active]:bg-background/80 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border/50 rounded-xl group transition-all"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center mr-3 group-data-[state=active]:bg-sky-500/20 group-data-[state=active]:shadow-inner transition-colors">
                                                <Globe className="w-3.5 h-3.5 text-sky-400 opacity-70 group-data-[state=active]:opacity-100" strokeWidth={2} />
                                            </div>
                                            Source List
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="details"
                                            className="w-full justify-start px-3 py-2.5 h-auto text-[13px] font-medium data-[state=active]:bg-background/80 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border/50 rounded-xl group transition-all"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-3 group-data-[state=active]:bg-emerald-500/20 group-data-[state=active]:shadow-inner transition-colors">
                                                <AlignLeft className="w-3.5 h-3.5 text-emerald-400 opacity-70 group-data-[state=active]:opacity-100" strokeWidth={2} />
                                            </div>
                                            Details
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col bg-background/40 relative">
                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-secondary/50 transition-all cursor-pointer z-20"
                        >
                            <X className="w-4 h-4" strokeWidth={2} />
                        </button>

                        <div className="flex-1 p-8 overflow-y-auto">
                            <Tabs value={activeTab} className="h-full">
                                <TabsContent value="name" className="mt-0 h-full flex flex-col justify-center space-y-6 focus-visible:outline-none">
                                    <div className="space-y-1.5">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20 shadow-inner">
                                            <Type className="w-5 h-5 text-indigo-400" strokeWidth={2} />
                                        </div>
                                        <h3 className="text-[18px] font-semibold text-foreground tracking-[-0.02em]">What is this bucket about?</h3>
                                        <p className="text-[14px] text-muted-foreground">Give your new collection a clear, memorable name.</p>
                                    </div>
                                    <input
                                        autoFocus
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && canProceed && handleTabChange("source")}
                                        placeholder="E.g., Project Ideas, Research Logs..."
                                        className="w-full h-12 px-4 rounded-xl bg-secondary/30 border border-border/50 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring focus:border-border transition-all shadow-inner"
                                    />
                                </TabsContent>

                                <TabsContent value="source" className="mt-0 h-full flex flex-col justify-center space-y-6 focus-visible:outline-none">
                                    <div className="space-y-1.5">
                                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center mb-4 border border-sky-500/20 shadow-inner">
                                            <Globe className="w-5 h-5 text-sky-400" strokeWidth={2} />
                                        </div>
                                        <h3 className="text-[18px] font-semibold text-foreground tracking-[-0.02em] flex items-center gap-2">
                                            Add a source link <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/40 uppercase tracking-wider">Optional</span>
                                        </h3>
                                        <p className="text-[14px] text-muted-foreground">Attach a primary URL or website to this bucket.</p>
                                    </div>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" strokeWidth={2} />
                                        <input
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleTabChange("details")}
                                            placeholder="https://"
                                            className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary/30 border border-border/50 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring focus:border-border transition-all shadow-inner"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="details" className="mt-0 h-full flex flex-col focus-visible:outline-none">
                                    <div className="space-y-1.5 mb-5 shrink-0">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 shadow-inner hidden md:flex">
                                            <AlignLeft className="w-5 h-5 text-emerald-400" strokeWidth={2} />
                                        </div>
                                        <h3 className="text-[18px] font-semibold text-foreground tracking-[-0.02em] flex items-center gap-2">
                                            Add details <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/40 uppercase tracking-wider">Optional</span>
                                        </h3>
                                        <p className="text-[14px] text-muted-foreground">Jot down notes, context, or any other thoughts.</p>
                                    </div>
                                    <div className="flex-1 min-h-0 bg-secondary/20 rounded-xl border border-border/50 focus-within:ring-1 focus-within:ring-ring focus-within:border-border transition-all shadow-inner overflow-hidden">
                                        <RichTextEditor content={description} onChange={setDescription} />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Footer area within main content */}
                        <div className="px-8 py-5 border-t border-border/30 bg-muted/5 flex items-center justify-between shrink-0">
                            <p className="text-[13px] text-muted-foreground/70 hidden sm:block font-medium">
                                {activeTab === "name" && "Keep names short and descriptive."}
                                {activeTab === "source" && "You can always edit this link later."}
                                {activeTab === "details" && "Use formatting to structure your thoughts."}
                            </p>
                            <div className="flex items-center gap-3 ml-auto">
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/80 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveBucket}
                                    disabled={!canProceed || saving}
                                    className="rounded-xl font-medium px-6 text-[13px] h-10 cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Create Bucket"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
