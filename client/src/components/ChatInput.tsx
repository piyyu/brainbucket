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
          fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl shadow-lg z-50 transition-all duration-700 ease-in-out
          bg-card/90 border border-border/50 rounded-2xl overflow-hidden backdrop-blur-xl items-end pb-2
          ${isCentered ? "top-1/2 -translate-y-1/2" : "bottom-6 translate-y-0"}
        `}
      >
        <InputGroupTextarea
          placeholder="Ask BrainBucket..."
          value={input}
          disabled={disabled}
          className="bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:ring-0 min-h-[56px] py-4 px-6 text-base resize-none shadow-none"
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
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 h-10 w-10 flex items-center justify-center shadow-sm disabled:opacity-50"
            size="icon-sm"
            onClick={askQuestion}
            disabled={!input.trim() || disabled}
          >
            <ArrowUpIcon size={20} />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
