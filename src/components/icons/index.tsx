import type { SVGProps } from "react";

/**
 * Custom icon set (docs/design.md §8): 24px grid, 2.2px rounded strokes, a
 * little hand-made wobble. Icons inherit colour and size from the text.
 */
type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Icon({ title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

export const ArrowUpRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.5 17.6 17.2 6.9" />
    <path d="M8.4 6.6c3 .2 6 .1 8.9-.1.2 2.9.1 5.9-.1 8.9" />
  </Icon>
);

export const ArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12.2c5.3-.3 10.6-.3 15.6 0" />
    <path d="M13.6 6.3c2 1.9 4 3.9 6 5.9-2 2-4 3.9-6 5.8" />
  </Icon>
);

export const ArrowDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12.1 4c.2 5.3.2 10.6 0 15.6" />
    <path d="M6.2 13.7c1.9 2 3.9 4 5.9 5.9 2-2 3.9-4 5.8-5.9" />
  </Icon>
);

export const Copy = (p: IconProps) => (
  <Icon {...p}>
    <rect x="8.6" y="8.4" width="11" height="11.2" rx="2.6" />
    <path d="M15.4 5.6c-.3-1-1.2-1.6-2.3-1.6H6.6C5.2 4 4 5.2 4 6.6v6.6c0 1.1.6 2 1.6 2.3" />
  </Icon>
);

export const Check = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.6 12.8c1.6 1.4 3.1 2.9 4.6 4.5 3.3-4 6.6-7.6 10.2-10.8" />
  </Icon>
);

export const Star = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.6c.9 2.1 1.8 4.2 2.6 6.3 2.2.1 4.5.3 6.7.6-1.7 1.5-3.4 3-5.2 4.4.6 2.2 1.1 4.4 1.6 6.6-1.9-1.2-3.8-2.4-5.7-3.5-1.9 1.2-3.8 2.3-5.7 3.5.5-2.2 1-4.4 1.6-6.6-1.8-1.4-3.5-2.9-5.2-4.4 2.2-.3 4.5-.5 6.7-.6.8-2.1 1.7-4.2 2.6-6.3Z" />
  </Icon>
);

export const Mail = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.4" y="5.4" width="17.2" height="13.2" rx="3" />
    <path d="M4.4 7.2c2.5 2 5 3.8 7.6 5.5 2.6-1.7 5.1-3.5 7.6-5.5" />
  </Icon>
);

export const Spark = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5c.4 3.9 1.3 6.6 5 8.5-3.7 1.9-4.6 4.6-5 8.5-.4-3.9-1.3-6.6-5-8.5 3.7-1.9 4.6-4.6 5-8.5Z" />
  </Icon>
);
