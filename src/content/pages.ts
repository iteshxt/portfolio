/** The three star projects with case studies (docs/prd.md §7.2), in running order. */
export const STAR_SLUGS = ["arcee", "patentiq", "diachat"] as const;
export type StarSlug = (typeof STAR_SLUGS)[number];
