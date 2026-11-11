import { getNowBuilding } from "@/lib/github";
import { TimeAgo } from "./TimeAgo";

/** Latest public push, e.g. "cineflex-app · fix: why does this work · 3 hours ago". Renders nothing on failure. */
export async function NowBuilding({ compact = false }: { compact?: boolean }) {
  const now = await getNowBuilding();
  if (!now) return null;

  if (compact) {
    return (
      <a href={now.commitUrl} target="_blank" rel="noreferrer" className="group flex max-w-[340px] items-start gap-2.5 text-left">
        <span className="relative mt-[7px] flex size-2 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-lime" />
        </span>
        <span className="min-w-0">
          <span className="block text-[12px] tracking-wide text-fg-muted uppercase">Last push</span>
          <span className="block truncate font-mono text-[13px] text-fg group-hover:underline group-hover:decoration-violet group-hover:underline-offset-4">
            {now.message}
          </span>
          <span className="block text-[12px] text-fg-muted">
            {now.repo.split("/").pop()} · <TimeAgo iso={now.at} />
          </span>
        </span>
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-2 text-[13px] text-fg-muted">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-lime" />
        </span>
        Currently building
      </p>
      <a href={now.commitUrl} target="_blank" rel="noreferrer" className="group block max-w-sm">
        <span className="font-mono text-[14px] text-fg group-hover:underline group-hover:decoration-violet group-hover:underline-offset-4">
          {now.message}
        </span>
        <span className="mt-1 block text-[13px] text-fg-muted">
          {now.repo} · <TimeAgo iso={now.at} />
        </span>
      </a>
    </div>
  );
}
