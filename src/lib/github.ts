import { cacheLife } from "next/cache";

/**
 * "Currently building" feed (docs/prd.md §6.5, docs/spec.md §9): the latest
 * public push to GitHub. Push events no longer carry commit messages, so the
 * head commit is fetched separately. Cached for 10 minutes; fails silently.
 */

export type NowBuilding = {
  repo: string;
  repoUrl: string;
  message: string;
  commitUrl: string;
  at: string;
};

type GitHubEvent = {
  type?: string;
  repo?: { name?: string };
  created_at?: string;
  payload?: { head?: string; ref?: string };
};

const USER = "iteshxt";

export function latestPush(events: unknown): { repo: string; head: string; at: string } | null {
  if (!Array.isArray(events)) return null;
  for (const e of events as GitHubEvent[]) {
    if (e?.type === "PushEvent" && e.repo?.name && e.payload?.head && e.created_at) {
      return { repo: e.repo.name, head: e.payload.head, at: e.created_at };
    }
  }
  return null;
}

/** First line of a commit message, trimmed to `max` characters. */
export function summariseCommit(message: string, max = 80): string {
  const first = message.split("\n")[0].trim();
  return first.length > max ? `${first.slice(0, max - 1).trimEnd()}…` : first;
}

function headers(): HeadersInit {
  const h: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "iteshxt.me" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

export async function getNowBuilding(): Promise<NowBuilding | null> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 600, expire: 86_400 });

  try {
    const res = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=30`, { headers: headers() });
    if (!res.ok) return null;
    const push = latestPush(await res.json());
    if (!push) return null;

    const commitRes = await fetch(`https://api.github.com/repos/${push.repo}/commits/${push.head}`, { headers: headers() });
    if (!commitRes.ok) return null;
    const commit = (await commitRes.json()) as { commit?: { message?: string }; html_url?: string };
    const message = commit.commit?.message;
    if (!message) return null;

    return {
      repo: push.repo.replace(`${USER}/`, ""),
      repoUrl: `https://github.com/${push.repo}`,
      message: summariseCommit(message),
      commitUrl: commit.html_url ?? `https://github.com/${push.repo}/commit/${push.head}`,
      at: push.at,
    };
  } catch {
    return null;
  }
}
