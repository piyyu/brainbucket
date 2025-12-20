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
    <div className="w-full max-w-[900px]">
      <InputGroup
        className={`
          fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 transition-all duration-700 ease-in-out
          bg-[#0f1012] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl items-end pb-2
          ${isCentered ? "top-1/2 -translate-y-1/2" : "bottom-4 translate-y-0"}
        `}
      >
        <InputGroupTextarea
          placeholder="Ask, Search or Chat..."
          value={input}
          disabled={disabled}
          className="bg-transparent border-none text-white placeholder:text-zinc-500 focus:ring-0 min-h-[50px] py-4"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              askQuestion();
            }
          }}
        />

        <InputGroupAddon align="inline-end" className="bg-transparent mb-1 mr-2">
          <InputGroupButton
            variant="default"
            className="rounded-xl bg-white text-black shadow-[0_14px_30px_rgba(0,0,0,0.25),inset_0_-3px_6px_rgba(236,72,153,0.55)] transition-all hover:scale-105 active:scale-95 hover:shadow-[0_18px_36px_rgba(0,0,0,0.3),inset_0_-4px_8px_rgba(236,72,153,0.65)]"
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
