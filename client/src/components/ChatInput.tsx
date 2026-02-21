import { ArrowUpIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

interface ChatInputProps {
  askQuestion: () => void;
  input: string;
  setInput: (val: string) => void;
  disabled: boolean;
}

export const ChatInput = ({
  askQuestion,
  input,
  setInput,
  disabled,
}: ChatInputProps) => {
  return (
    <InputGroup
      className={`
        w-full max-w-3xl mx-auto z-50
        bg-secondary/30 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden items-end shadow-vercel
        hover:border-border transition-colors
      `}
    >
      <InputGroupTextarea
        placeholder="Ask BrainBucket..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            askQuestion();
          }
        }}
        className="bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:ring-0 min-h-[52px] py-3.5 px-4 text-[14px] resize-none shadow-none leading-relaxed"
      />
      <InputGroupButton
        variant="default"
        onClick={askQuestion}
        disabled={disabled || !input.trim()}
        className="rounded-lg bg-foreground text-background h-8 w-8 flex items-center justify-center disabled:opacity-20 cursor-pointer transition-all hover:bg-foreground/90 hover:shadow-md mr-2 mb-2 shrink-0"
        size="icon-sm"
      >
        <ArrowUpIcon size={16} strokeWidth={2} />
        <span className="sr-only">Send</span>
      </InputGroupButton>
    </InputGroup>
  );
};
