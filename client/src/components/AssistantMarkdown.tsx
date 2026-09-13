import { Children, isValidElement, useState, type ReactElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";

function CodeBlock({ lang, text, children }: { lang: string; text: string; children: ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="my-4 rounded-lg border border-border/50 bg-secondary/30 overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-border/50 bg-secondary/20">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-accent"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="hljs font-mono bg-transparent p-0">{children}</code>
      </pre>
    </div>
  );
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return extractText(node.props.children);
  return "";
}

function ThemedPre({ children }: { children?: ReactNode }) {
  const codeEl = Children.toArray(children)[0] as ReactElement<{ className?: string; children?: ReactNode }> | undefined;
  const className = isValidElement(codeEl) ? codeEl.props.className || "" : "";
  const lang = /language-([\w+-]+)/.exec(className)?.[1] || "code";
  const codeChildren = isValidElement(codeEl) ? codeEl.props.children : children;
  const text = extractText(codeChildren).replace(/\n$/, "");
  return <CodeBlock lang={lang} text={text}>{codeChildren}</CodeBlock>;
}

export const AssistantMarkdown = ({ content }: { content: string }) => {
  return (
    <div className="markdown-body text-[14px] leading-[1.7] text-foreground break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          h1: ({ children }) => (
            <h1 className="text-[18px] font-semibold tracking-[-0.01em] mt-5 mb-3 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[16px] font-semibold tracking-[-0.01em] mt-5 mb-2.5 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[15px] font-semibold mt-4 mb-2 first:mt-0">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-[14px] font-semibold mt-3 mb-1.5 first:mt-0">{children}</h4>
          ),
          ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1.5 marker:text-muted-foreground">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1.5 marker:text-muted-foreground">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-400/30 transition-colors"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-indigo-500/30 pl-4 my-3 text-muted-foreground italic [&>p]:mb-1">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isBlock = /language-[\w+-]+/.test(className || "");
            if (isBlock) return <code className={className}>{children}</code>;
            return (
              <code className={`font-mono text-[13px] bg-secondary/60 border border-border/50 rounded px-1.5 py-0.5 ${className || ""}`}>
                {children}
              </code>
            );
          },
          pre: ThemedPre,
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-[13px] border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-secondary/30">{children}</thead>,
          th: ({ children }) => (
            <th className="text-left font-semibold px-3 py-2 border-b border-border/50">{children}</th>
          ),
          td: ({ children }) => <td className="px-3 py-2 border-b border-border/30 last:border-b-0">{children}</td>,
          hr: () => <hr className="my-5 border-border/50" />,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
