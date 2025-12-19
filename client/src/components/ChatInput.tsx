import { IconPlus } from "@tabler/icons-react";
import { ArrowUpIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

type Props = {
  askQuestion: () => void;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
};

export function ChatInput({
  askQuestion,
  input,
  setInput,
  disabled = false,
}: Props) {
  return (
    <div className="w-full max-w-[900px]">
      <InputGroup className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-3xl">
        <InputGroupTextarea
          placeholder="Ask, Search or Chat..."
          value={input}
          disabled={disabled}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              askQuestion();
            }
          }}
        />

        <InputGroupAddon align="block-end">
          <InputGroupButton
            variant="outline"
            className="rounded-full"
            size="icon-xs"
            disabled
          >
            <IconPlus />
          </InputGroupButton>

          <Separator orientation="vertical" className="mx-1 h-4" />

          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-xs"
            onClick={askQuestion}
            disabled={!input.trim() || disabled}
          >
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
