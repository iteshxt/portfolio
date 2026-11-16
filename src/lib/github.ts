import { cacheLife } from "next/cache";

/**
 * "Currently building" feed (docs/prd.md §6.5, docs/spec.md §9): the latest
 * public push to GitHub. The user events feed can lag by days, so the source is
 * the most recently pushed public repo's activity feed (real time), with the
 * events feed as a fallback. The commit message is fetched separately.
 * Cached for 10 minutes; fails silently.
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

/** The newest push event with a head commit. GitHub's feed isn't strictly newest-first, so compare times. */
export function latestPush(events: unknown): { repo: string; head: string; at: string } | null {
  if (!Array.isArray(events)) return null;
  let best: { repo: string; head: string; at: string } | null = null;
  for (const e of events as GitHubEvent[]) {
    if (e?.type === "PushEvent" && e.repo?.name && e.payload?.head && e.created_at) {
      if (!best || Date.parse(e.created_at) > Date.parse(best.at)) best = { repo: e.repo.name, head: e.payload.head, at: e.created_at };
    }
  }
  return best;
}

type RepoActivity = { activity_type?: string; after?: string; timestamp?: string };

/** The newest push in a repo's activity feed (GET /repos/{repo}/activity?activity_type=push). */
export function latestActivityPush(repo: string, activity: unknown): { repo: string; head: string; at: string } | null {
  if (!Array.isArray(activity)) return null;
  let best: { repo: string; head: string; at: string } | null = null;
  for (const a of activity as RepoActivity[]) {
    if (a?.after && a.timestamp && (!a.activity_type || a.activity_type === "push" || a.activity_type === "force_push")) {
      if (!best || Date.parse(a.timestamp) > Date.parse(best.at)) best = { repo, head: a.after, at: a.timestamp };
    }
  }
  return best;
}

/** The most recently pushed public repo's activity first; the (laggy) events feed if that fails. */
async function findLatestPush(): Promise<{ repo: string; head: string; at: string } | null> {
  try {
    const repos = await gh(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=1`);
    if (repos.ok) {
      const [top] = (await repos.json()) as { full_name?: string }[];
      if (top?.full_name) {
        const act = await gh(`https://api.github.com/repos/${top.full_name}/activity?activity_type=push&per_page=5`);
        if (act.ok) {
          const push = latestActivityPush(top.full_name, await act.json());
          if (push) return push;
        }
      }
    }
  } catch {
    // fall through to the events feed
  }
  const res = await gh(`https://api.github.com/users/${USER}/events/public?per_page=30`);
  return res.ok ? latestPush(await res.json()) : null;
}

/** First line of a commit message, trimmed to `max` characters. */
export function summariseCommit(message: string, max = 80): string {
  const first = message.split("\n")[0].trim();
  return first.length > max ? `${first.slice(0, max - 1).trimEnd()}…` : first;
}

function headers(withToken: boolean): HeadersInit {
  const h: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "iteshxt.me" };
  if (withToken && process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

/** Public endpoints only: if the token is expired or revoked (401/403), ask again without it. */
async function gh(url: string): Promise<Response> {
  const res = await fetch(url, { headers: headers(true) });
  if ((res.status === 401 || res.status === 403) && process.env.GITHUB_TOKEN) return fetch(url, { headers: headers(false) });
  return res;
}

export async function getNowBuilding(): Promise<NowBuilding | null> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 600, expire: 86_400 });

  try {
    const push = await findLatestPush();
    if (!push) return null;

    const commitRes = await gh(`https://api.github.com/repos/${push.repo}/commits/${push.head}`);
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
