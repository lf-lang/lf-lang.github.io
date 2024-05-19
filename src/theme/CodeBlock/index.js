import React from "react";
import CodeBlock from "@theme-original/CodeBlock";
import { ShikiLFHighlighter } from "@site/src/components/ShikiLFHighlighter";

export default function CodeBlockWrapper(props) {
  return (
    <>
      {/* If using <CodeBlock /> then it will contain language="lf-c"; if using ``` it will contain className="language-lf-c". */}
      {props.language?.startsWith("lf") ||
      props.className?.startsWith("language-lf") ? (
        <ShikiLFHighlighter {...props} />
      ) : (
        <CodeBlock {...props} />
      )}
    </>
  );
}
