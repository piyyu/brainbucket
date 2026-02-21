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

    const [activeTab, setActiveTab] = useState("name");

    const handleTabChange = (val: string) => setActiveTab(val);

    const canProceed = title.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] md:w-full md:max-w-[720px] bg-background border border-border/50 text-foreground p-0 overflow-hidden rounded-xl shadow-xl [&>button]:hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-muted/5">
                    <div>
                        <h2 className="text-[16px] font-semibold text-foreground tracking-[-0.01em]">
                            Create Bucket
                        </h2>
                        <p className="text-[13px] text-muted-foreground mt-0.5">Add a new collection to your workspace.</p>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer"
                    >
                        <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Tabs & Content */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="flex h-[320px]">
                    {/* Sidebar TabsList */}
                    <div className="w-[180px] shrink-0 border-r border-border/30 bg-secondary/10 p-4">
                        <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1 space-y-1">
                            <TabsTrigger
                                value="name"
                                className="w-full justify-start px-3 py-2 h-9 text-[13px] data-[state=active]:bg-background data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border/50 rounded-lg group"
                            >
                                <Type className="w-4 h-4 mr-2 text-indigo-400 opacity-70 group-data-[state=active]:opacity-100" strokeWidth={1.5} />
                                Name
                            </TabsTrigger>
                            <TabsTrigger
                                value="source"
                                className="w-full justify-start px-3 py-2 h-9 text-[13px] data-[state=active]:bg-background data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border/50 rounded-lg group"
                            >
                                <Globe className="w-4 h-4 mr-2 text-sky-400 opacity-70 group-data-[state=active]:opacity-100" strokeWidth={1.5} />
                                Source Link
                            </TabsTrigger>
                            <TabsTrigger
                                value="details"
                                className="w-full justify-start px-3 py-2 h-9 text-[13px] data-[state=active]:bg-background data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border/50 rounded-lg group"
                            >
                                <AlignLeft className="w-4 h-4 mr-2 text-emerald-400 opacity-70 group-data-[state=active]:opacity-100" strokeWidth={1.5} />
                                Details
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Tab Panels */}
                    <div className="flex-1 p-6 overflow-y-auto bg-background/50">
                        <TabsContent value="name" className="mt-0 h-full flex flex-col justify-center space-y-4 focus-visible:outline-none">
                            <div>
                                <h3 className="text-[15px] font-medium text-foreground mb-1.5">What is this bucket about?</h3>
                                <p className="text-[13px] text-muted-foreground">Give your new collection a clear, memorable name.</p>
                            </div>
                            <input
                                autoFocus
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && canProceed && handleTabChange("source")}
                                placeholder="E.g., Project Ideas, Research Logs..."
                                className="w-full h-10 px-3 rounded-lg bg-background border border-border/50 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all shadow-sm"
                            />
                        </TabsContent>

                        <TabsContent value="source" className="mt-0 h-full flex flex-col justify-center space-y-4 focus-visible:outline-none">
                            <div>
                                <h3 className="text-[15px] font-medium text-foreground flex items-center gap-2 mb-1.5">
                                    Add a source link <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground border border-border/30">Optional</span>
                                </h3>
                                <p className="text-[13px] text-muted-foreground">Attach a primary URL or website to this bucket.</p>
                            </div>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" strokeWidth={1.5} />
                                <input
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleTabChange("details")}
                                    placeholder="https://"
                                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-background border border-border/50 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 transition-all shadow-sm"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="details" className="mt-0 h-full flex flex-col space-y-4 focus-visible:outline-none">
                            <div>
                                <h3 className="text-[15px] font-medium text-foreground flex items-center gap-2 mb-1.5">
                                    Add details <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground border border-border/30">Optional</span>
                                </h3>
                                <p className="text-[13px] text-muted-foreground">Jot down notes, context, or any other thoughts.</p>
                            </div>
                            <div className="flex-1 min-h-0">
                                <RichTextEditor content={description} onChange={setDescription} />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border/30 flex items-center justify-between bg-muted/10">
                    <p className="text-[12px] text-muted-foreground/60 hidden sm:block">
                        {activeTab === "name" && "Tip: Keep names short and descriptive."}
                        {activeTab === "source" && "You can always edit this link later."}
                        {activeTab === "details" && "Use formatting to structure your thoughts."}
                    </p>
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveBucket}
                            disabled={!canProceed || saving}
                            className="rounded-lg font-medium px-5 text-[13px] h-9 cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:-translate-y-px flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Create Bucket"
                            )}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
