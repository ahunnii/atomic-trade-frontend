/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type EditorJS from "@editorjs/editorjs";

import "~/styles/editor.css";

import type { OutputData } from "@editorjs/editorjs";

import { cn } from "~/lib/utils";

export interface LargeMarkdownFormFieldRef {
  clear: () => void;
  render: (data: OutputData) => void;
  save: () => Promise<void>;
}

type Props = {
  className?: string;
  defaultContent?: OutputData;
};

export const MarkdownView = (props: Props) => {
  const { className } = props;

  const editorRef = useRef<EditorJS | undefined>(undefined);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          editorRef.current = editor;
        },

        inlineToolbar: true,
        data: props.defaultContent ?? { blocks: [] },
        readOnly: true,
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },

          image: { class: ImageTool },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef?.current?.focus();
      }, 0);
    };

    if (isMounted) {
      void init();

      return () => {
        editorRef.current?.destroy();
        editorRef.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={cn("col-span-full w-full", className)}>
      <div className="prose prose-stone dark:prose-invert bg-background col-span-full mt-2 w-full max-w-7xl rounded-lg">
        <div id="editor" className="h-auto w-full" />
      </div>
    </div>
  );
};
