import React from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import { ShikijiLFHighlighter } from "@site/src/components/ShikijiLFHighlighter"

export default function CodeBlockWrapper(props) {
  return (
    <>
      { /* If using <CodeBlock /> then it will contain language="lf-c"; if using ``` it will contain className="language-lf-c". */ }
      {(props.language?.startsWith("lf") || props.className?.startsWith("language-lf")) ? <ShikijiLFHighlighter {...props} /> : <CodeBlock {...props} />}
    </>
  );
}
