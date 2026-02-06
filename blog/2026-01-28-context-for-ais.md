---
slug: context-for-ais
title: "Context for AI-Assisted Coding"
authors: [eal]
tags: [lingua franca, tooling, AI, RAG, Cursor, Copilot, curated-c, curated-py]
---

When you use an AI assistant to write Lingua Franca code—whether Cursor, GitHub Copilot, Claude, or another—the AI relies on **context**: the files, examples, and documentation it can "see" to guide its responses. Without the right context, AIs often mix C and Python syntax, suggest patterns from the wrong target, or miss LF-specific idioms. The Lingua Franca project has introduced two template repositories, **[curated-c](https://github.com/lf-lang/curated-c)** and **[curated-py](https://github.com/lf-lang/curated-py)**, designed specifically to provide high-quality, target-specific context for AIs. This post explains why context matters, how different AI systems use it, and how to use these templates effectively.

{/* truncate */}

## The Problem: Mixed Targets and Confused AIs

Lingua Franca supports multiple target languages: C, C++, Python, TypeScript, and Rust. Reaction bodies use different syntax and APIs depending on the target—for example, C uses `self->param` and `lf_set(out, value)`, while Python uses `self.param` and `out.set(value)`. The main LF repositories (e.g. [lingua-franca](https://github.com/lf-lang/lingua-franca) and [playground-lingua-franca](https://github.com/lf-lang/playground-lingua-franca)) contain examples and tests for **all** targets. When an AI indexes or retrieves from such a mixed corpus, it can pull C examples when you're writing Python, or vice versa, leading to invalid suggestions and subtle bugs.

The curated templates solve this by isolating **only** the content relevant to one target. **curated-c** contains C-target examples, tests, demos, and libraries; **curated-py** contains Python-target content. Each repo also includes a snapshot of the Lingua Franca documentation rendered as static HTML that contains only the examples in the target language. By creating a new project from the appropriate template, you give your AI a single-target context, reducing confusion and improving suggestion quality.

---

## How AIs Use Context: RAG and Local Indexing

Different AI systems use context in different ways. Two main approaches are **Retrieval Augmented Generation (RAG)** and **local codebase indexing**.

### Retrieval Augmented Generation (RAG)

**RAG** (Retrieval Augmented Generation) is a technique that augments an LLM's response by retrieving relevant external information and including it in the prompt. Instead of relying only on the model's training data, RAG supplies documents, code, or other text that the model can use to ground its answer.

A typical RAG pipeline works as follows:

1. **Chunking** — Documents and code are split into smaller sections (e.g. functions, paragraphs).
2. **Embedding** — Each chunk is converted into a numerical vector (an *embedding*) that captures its semantic meaning. Embeddings are produced by a separate model.
3. **Storage** — Embeddings are stored in a vector database.
4. **Querying** — When you ask a question, the query is also embedded. The system retrieves chunks whose embeddings are most similar to the query (semantic search).
5. **Generation** — The retrieved chunks are added to the prompt sent to the LLM. The model then generates an answer using both its internal knowledge and the retrieved context.

RAG effectively gives the model an "open book": it can reference your codebase, docs, or examples when answering. This reduces hallucinations and lets the model use up-to-date or project-specific information it wasn't trained on. Some AI coding tools use RAG over your workspace; others use it over a configured knowledge base. The curated templates are ideal for RAG: they provide a large, consistent set of target-specific examples and documentation for retrieval.

### Local Codebase Indexing (e.g. Cursor)

Tools like **Cursor** use a different but related mechanism: they **index your codebase** locally. Cursor computes embeddings for files in your project (respecting `.gitignore` and `.cursorignore`) and builds a semantic index. When you chat or request code, Cursor uses this index to find relevant code and inject it into the context. New files are indexed incrementally. This is similar in spirit to RAG—retrieve relevant chunks, then generate—but the indexing is done in the IDE and scoped to your workspace.

By opening a project built from **curated-c** or **curated-py**, Cursor indexes only C or only Python LF examples. That avoids polluting the index with Python examples when you're writing C, or vice versa. You can further tune what gets indexed with `.cursorignore` (e.g. excluding large binary assets or generated files).

### Copilot Spaces and Workspace Context

**GitHub Copilot** offers **Copilot Spaces**, where you can add files, folders, and repositories to a "space" that provides context to Copilot. You can include instructions (e.g. "focus on C-target Lingua Franca") and specific sources. Adding the `context` and `lfdocs` directories from a curated template to a Copilot Space gives Copilot direct access to target-specific examples and documentation.

Other tools (e.g. Claude with project context, or custom RAG setups) work similarly: they use whatever files or chunks you include in the context. The curated templates are structured so that `context/` and `lfdocs/` can be pointed at as authoritative, target-specific sources.

---

## What the Curated Templates Provide

Each template repo contains:

| Component | Contents |
|-----------|----------|
| **`context/`** | Examples, tests, demos, and libraries for that target only. **curated-c** pulls from `lingua-franca` (test/C), `playground-lingua-franca` (examples/C), `lf-demos`, and target-specific libraries (e.g. mujoco-c, mqtt-c). **curated-py** pulls from `lingua-franca` (test/Python) and `playground-lingua-franca` (examples/Python). |
| **`lfdocs/`** | A snapshot of the [Lingua Franca documentation](https://lf-lang.org) rendered as static HTML containing only the examples in the relevant target language. Entry point: `lfdocs/index.html`. |
| **`src/`** | A minimal starter program (e.g. `HelloWorld.lf`) and instructions for compiling and running. |
| **`scripts/`** | Utilities to update context (`clone_and_copy_subdir.sh`, `build_lf_docs.sh`). |
| **`Makefile`** | Targets for `format`, `clean`, `update-context`, `update-lfdocs`, and `update`. |

To create a new project:

1. Go to [curated-c](https://github.com/lf-lang/curated-c) or [curated-py](https://github.com/lf-lang/curated-py).
2. Click **"Use this template"** to create your own repository.
3. Clone the new repo and open it in your IDE (e.g. Cursor or VS Code with Copilot).
4. Put your application code in `src/`. The AI will have access to hundreds of target-specific examples in `context/` and full documentation in `lfdocs/`.

The `context` directory is kept in sync with upstream via `make update-context` (and optionally `make update-lfdocs`), so you can periodically refresh examples and docs.

---

## Tips for Better AI-Assisted LF Development

- **Choose the right template** — Use **curated-c** for C/C++ targets and **curated-py** for Python. Don't mix both in the same project if you want consistent AI suggestions.
- **Reference examples explicitly** — When chatting with an AI, you can say "See `context/examples/src/distributed/` for a federated example" or "Follow the pattern in `context/tests/src/federated/`." Many tools will then pull those files into context.
- **Use `.cursorignore`** — Exclude build artifacts (`build/`, `src-gen/`, `fed-gen/`), large assets, or other content that would dilute the semantic index.
- **Keep context updated** — Run `make update` occasionally to pull the latest examples and documentation from upstream.

---

## Summary

The **curated-c** and **curated-py** templates provide target-specific context—examples, tests, demos, libraries, and documentation—to improve AI-assisted Lingua Franca development. Whether your AI uses RAG, codebase indexing, or workspace files, giving it a single-target corpus reduces confusion and yields more accurate, idiomatic suggestions. Use "Use this template" on GitHub to create a new project and get started.
