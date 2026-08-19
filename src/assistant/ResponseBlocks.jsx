// Renders a parsed assistant reply.
//
// The block contract and parsing engine come from ElimuLink
// (responseBlockParser.js is copied verbatim); the presentation is rewritten in
// FaidaFarm's tokens - Inter, the green palette, no dark mode. Block types the
// farmer app has no use for (math, diagrams, generated images, web image rows,
// citations) fall through to prose rather than dragging KaTeX and a sources
// drawer along with them.

import { Component, useMemo, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Copy } from "lucide-react";
import { parseAssistantResponseBlocks } from "./responseBlockParser";

const PROSE = "text-[16.5px] leading-[1.75] text-[#2C3830] md:text-[15.5px] md:leading-[1.78]";

function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copyValue}
      title={label}
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold text-[#667164] transition hover:bg-[#F1F6EE] hover:text-[#166534]"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : label}
    </button>
  );
}

function parseInlineMarkdown(text, keyPrefix = "inline") {
  const value = String(text || "");
  const parts = value.split(
    /(\[[^\]]+\]\(https?:\/\/[^)]+\)|`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g
  );

  return parts
    .filter((part) => part !== "")
    .map((part, index) => {
      const key = `${keyPrefix}-${index}`;

      const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={key}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#166534] underline decoration-[#A9CFA6] underline-offset-4"
          >
            {linkMatch[1]}
          </a>
        );
      }

      if (/^`[^`]+`$/.test(part)) {
        return (
          <code key={key} className="rounded-md bg-[#F1F6EE] px-1.5 py-0.5 text-[0.92em] font-semibold text-[#20562B]">
            {part.slice(1, -1)}
          </code>
        );
      }

      if (/^\*\*[^*]+\*\*$/.test(part) || /^__[^_]+__$/.test(part)) {
        return (
          <strong key={key} className="font-bold text-[#182118]">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (/^\*[^*]+\*$/.test(part) || /^_[^_]+_$/.test(part)) {
        return <em key={key}>{part.slice(1, -1)}</em>;
      }

      return <span key={key}>{part}</span>;
    });
}

function normalizeLooseLine(value) {
  return String(value || "")
    .replace(/^\s{0,3}#{1,6}\s+/, "")
    .replace(/^\s*>\s?/, "")
    .replace(/^\s{0,6}[-*•]\s+/, "")
    .replace(/^\s{0,6}\d+[.)]\s+/, "");
}

function LooseText({ text, keyPrefix = "loose" }) {
  const paragraphs = String(text || "")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p key={`${keyPrefix}-${index}`} className={PROSE}>
          {parseInlineMarkdown(normalizeLooseLine(paragraph), `${keyPrefix}-${index}`)}
        </p>
      ))}
    </div>
  );
}

function ListBlock({ block, compact = false }) {
  const items = Array.isArray(block.items) ? block.items : [];
  const hasOrdered = items.some((item) => item.ordered);
  const Tag = hasOrdered ? "ol" : "ul";

  const content = (
    <Tag
      className={
        hasOrdered
          ? "list-decimal space-y-2.5 pl-5 marker:font-semibold marker:text-[#8A958A]"
          : "list-disc space-y-2.5 pl-5 marker:text-[#8A958A]"
      }
    >
      {items.map((item, index) => (
        <li
          key={`list-item-${index}`}
          className={PROSE}
          style={{ marginLeft: `${Math.min(3, item.depth || 0) * 14}px` }}
        >
          {parseInlineMarkdown(item.text, `list-item-${index}`)}
        </li>
      ))}
    </Tag>
  );

  return compact ? content : <div>{content}</div>;
}

// Unlabelled and unboxed on purpose: a table is self-evident, and on a phone it
// scrolls sideways rather than collapsing, because reading a comparison across
// the row is the whole point.
function TableBlock({ block }) {
  const columns = Array.isArray(block.columns) ? block.columns : [];
  const rows = Array.isArray(block.rows) ? block.rows : [];

  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={`th-${index}`}
                className="border-b border-[#DCE5D8] px-3 py-2.5 align-bottom text-sm font-bold text-[#182118]"
              >
                <div className="min-w-[104px]">{parseInlineMarkdown(column, `th-${index}`)}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="border-b border-[#EEF2EC] px-3 py-3 align-top leading-6 text-[#4C574D]"
                >
                  <div className="min-w-[104px] break-words">
                    {parseInlineMarkdown(cell, `cell-${rowIndex}-${cellIndex}`)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ block }) {
  const code = String(block.code ?? block.text ?? "");

  return (
    <div className="rounded-2xl border border-[#E7ECE5] bg-[#F7F9F6]">
      <div className="flex items-center justify-between border-b border-[#E7ECE5] px-3 py-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8A958A]">
          {block.language || "Code"}
        </span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto px-3 py-3 text-[13px] leading-6 text-[#182118]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function JsonBlock({ block }) {
  const rawJson = useMemo(() => {
    try {
      return JSON.stringify(block.data, null, 2);
    } catch {
      return String(block.raw || "");
    }
  }, [block.data, block.raw]);

  return <CodeBlock block={{ language: "JSON", code: rawJson }} />;
}

function QuoteBlock({ block }) {
  return (
    <blockquote className="border-l-[3px] border-[#A9CFA6] pl-4 text-[15.5px] leading-7 text-[#4C574D] italic">
      {parseInlineMarkdown(block.text, "quote")}
    </blockquote>
  );
}

function NoteBlock({ block }) {
  return (
    <div className="rounded-2xl border border-[#E4EBDD] bg-[#F7FBF5] px-4 py-3">
      <LooseText text={block.text} keyPrefix="note" />
    </div>
  );
}

function WarningBlock({ block }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-[#F2E2C4] bg-[#FDF8EE] px-4 py-3">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#B77A18]" />
      <div className="whitespace-pre-wrap text-[15.5px] leading-[1.75] text-[#7A5510]">
        {block.text}
      </div>
    </div>
  );
}

function SuccessBlock({ block }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-[#CFE3C8] bg-[#F1F6EE] px-4 py-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2F8F46]" />
      <div className="whitespace-pre-wrap text-[15.5px] leading-[1.75] text-[#20562B]">
        {block.text}
      </div>
    </div>
  );
}

function ActionsBlock({ block, onAction }) {
  const items = Array.isArray(block.items) ? block.items : [];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <button
          key={`action-${index}`}
          type="button"
          onClick={() => onAction?.(item)}
          className="inline-flex items-center rounded-full border border-[#CFE3C8] bg-white px-3.5 py-2 text-xs font-semibold text-[#166534] transition hover:bg-[#F1F6EE]"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function MarkdownDocument({ text }) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const nodes = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = Math.min(4, headingMatch[1].length + 1);
      const Tag = `h${level}`;
      nodes.push(
        <Tag
          key={`heading-${index}`}
          className="mb-1 mt-7 text-[18px] font-bold tracking-[-0.01em] text-[#182118] first:mt-0"
        >
          {parseInlineMarkdown(headingMatch[2], `h-${index}`)}
        </Tag>
      );
      index += 1;
      continue;
    }

    if (/^\s*>\s+/.test(line)) {
      const quoteLines = [];
      while (index < lines.length && /^\s*>\s+/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      nodes.push(
        <blockquote
          key={`quote-${index}`}
          className="space-y-1 border-l-[3px] border-[#A9CFA6] pl-4 text-[15px] leading-7 text-[#5F695D]"
        >
          {quoteLines.map((item, quoteIndex) => (
            <p key={`quote-line-${index}-${quoteIndex}`}>
              {parseInlineMarkdown(item, `q-${index}-${quoteIndex}`)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // A pipe table needs at least a header row and a separator row.
    if (/^\s*\|.*\|\s*$/.test(line) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[index + 1] || "")) {
      const splitRow = (row) =>
        row
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((cell) => cell.trim());

      const columns = splitRow(line);
      index += 2;
      const rows = [];
      while (index < lines.length && /^\s*\|.*\|\s*$/.test(lines[index])) {
        rows.push(splitRow(lines[index]));
        index += 1;
      }
      nodes.push(<TableBlock key={`md-table-${index}`} block={{ columns, rows }} />);
      continue;
    }

    if (/^(\s{0,6}[-*•]\s+|\s{0,6}\d+[.)]\s+)/.test(line)) {
      const listLines = [];
      while (
        index < lines.length &&
        /^(\s{0,6}[-*•]\s+|\s{0,6}\d+[.)]\s+)/.test(lines[index])
      ) {
        listLines.push(lines[index]);
        index += 1;
      }
      nodes.push(
        <ListBlock
          key={`md-list-${index}`}
          compact
          block={{
            items: listLines.map((item) => ({
              depth: Math.min(3, Math.floor((item.match(/^\s+/)?.[0]?.length || 0) / 2)),
              ordered: /^\s{0,6}\d+[.)]\s+/.test(item),
              text: item.replace(/^(\s{0,6}[-*•]\s+|\s{0,6}\d+[.)]\s+)/, "").trim(),
            })),
          }}
        />
      );
      continue;
    }

    const paragraph = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,4})\s+/.test(lines[index]) &&
      !/^\s*>\s+/.test(lines[index]) &&
      !/^\s*\|.*\|\s*$/.test(lines[index]) &&
      !/^(\s{0,6}[-*•]\s+|\s{0,6}\d+[.)]\s+)/.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }

    if (paragraph.length) {
      nodes.push(
        <p key={`p-${index}`} className={PROSE}>
          {parseInlineMarkdown(paragraph.join(" "), `p-${index}`)}
        </p>
      );
    }
  }

  return <div className="space-y-3.5">{nodes}</div>;
}

// One malformed block must not blank the whole answer.
class BlockBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <p className={PROSE}>
          {this.props.fallbackText || "I could not display this part of the answer cleanly."}
        </p>
      );
    }

    return this.props.children;
  }
}

export default function ResponseBlocks({ text = "", onAction = null }) {
  const blocks = useMemo(() => parseAssistantResponseBlocks({ text }), [text]);

  const renderBlock = (block) => {
    switch (block.type) {
      case "code":
        return <CodeBlock block={block} />;
      case "json":
        return <JsonBlock block={block} />;
      case "quote":
        return <QuoteBlock block={block} />;
      case "list":
        return <ListBlock block={block} />;
      case "table":
        return <TableBlock block={block} />;
      case "note":
        return <NoteBlock block={block} />;
      case "warning":
        return <WarningBlock block={block} />;
      case "success":
        return <SuccessBlock block={block} />;
      case "actions":
        return <ActionsBlock block={block} onAction={onAction} />;
      case "markdown":
        return <MarkdownDocument text={block.text} />;
      // Math, diagrams, generated images, web image rows and file blocks are
      // not part of the farmer assistant; their text still reads as prose.
      default:
        return <MarkdownDocument text={block.text || block.caption || ""} />;
    }
  };

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <BlockBoundary key={block.id} fallbackText={block?.text || block?.caption}>
          {renderBlock(block)}
        </BlockBoundary>
      ))}
    </div>
  );
}
