"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  source: string;
  className?: string;
};

export default function MarkdownRenderer({ source, className }: Props) {
  const components: any = {
    a: ({ href, children }: any) => (
      <a href={href} target={href?.startsWith("#") ? undefined : "_blank"} rel={href?.startsWith("#") ? undefined : "noopener noreferrer"}>
        {children}
      </a>
    ),
    img: ({ src, alt }: any) => (
      // simple img renderer; replace with next/image if you prefer optimization
      <img src={src} alt={alt ?? ""} style={{ maxWidth: "100%", height: "auto" }} />
    ),
    code: ({ node, inline, className: cn, children, ...props }: any) => {
      if (inline) {
        return <code className={cn ? cn : "inline-code"} {...props}>{children}</code>;
      }
      const language = cn ? cn.replace("language-", "") : "";
      return (
        <pre className={cn ? cn : "code-block"}>
          <code data-lang={language} {...props}>
            {children}
          </code>
        </pre>
      );
    },
  };

  return (
    <div className={className ?? "md-card"}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source ?? ""}
      </ReactMarkdown>
    </div>
  );
}