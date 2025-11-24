import { IconPlus } from "@tabler/icons-react"
import { ArrowUpIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"


export function ChatInput() {
    const [input, setInput] = useState("")

  return (
    <div className="w-full h-full max-w-[900px]">
      <InputGroup className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-3xl">
        <InputGroupTextarea placeholder="Ask, Search or Chat..." value={input} onChange={(e) => setInput(e.target.value)} />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            variant="outline"
            className="rounded-full"
            size="icon-xs"
          >
            <IconPlus />
          </InputGroupButton>
          <Separator orientation="vertical" className="!h-4ho" />
          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-xs"
            disabled={input ? false : true}
          >
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
