import { ArrowUpIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

type Props = {
  askQuestion: () => void;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  isCentered?: boolean;
};

export function ChatInput({
  askQuestion,
  input,
  setInput,
  disabled = false,
  isCentered = false,
}: Props) {
  return (
    <div className="w-full max-w-[900px] mx-auto">
      <InputGroup
        className={`
          fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl z-50 transition-all duration-500 ease-in-out
          bg-background border border-border rounded-lg overflow-hidden items-end shadow-vercel
          ${isCentered ? "top-1/2 -translate-y-1/2" : "bottom-6"}
        `}
      >
        <InputGroupTextarea
          placeholder="Ask BrainBucket..."
          value={input}
          disabled={disabled}
          className="bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:ring-0 min-h-[52px] py-3.5 px-4 text-[14px] resize-none shadow-none leading-relaxed"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              askQuestion();
            }
          }}
        />

        <InputGroupAddon align="inline-end" className="bg-transparent mb-2 mr-2">
          <InputGroupButton
            variant="default"
            className="rounded-md bg-foreground text-background h-8 w-8 flex items-center justify-center disabled:opacity-30 cursor-pointer transition-colors hover:bg-foreground/90"
            size="icon-sm"
            onClick={askQuestion}
            disabled={!input.trim() || disabled}
          >
            <ArrowUpIcon size={16} strokeWidth={2} />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
