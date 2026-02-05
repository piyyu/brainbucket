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
          fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-50 transition-all duration-700 ease-in-out
          bg-[#151515] border border-[#333] rounded-xl overflow-hidden backdrop-blur-xl items-end pb-2
          ${isCentered ? "top-1/2 -translate-y-1/2" : "bottom-4 translate-y-0"}
          
        `}
      >
        <InputGroupTextarea
          placeholder="ENTER QUERY OR COMMAND..."
          value={input}
          disabled={disabled}
          className="bg-transparent border-none text-[#e5e5e5] placeholder:text-[#444] font-mono tracking-wide focus:ring-0 min-h-[50px] py-4 px-4 text-sm"
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
            className="rounded-lg bg-[#e5e5e5] text-black border border-transparent hover:border-white shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all hover:bg-white active:scale-95 h-10 w-10 flex items-center justify-center"
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
