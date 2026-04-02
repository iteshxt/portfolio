import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LPU WiFi Auto Login — Never Log In Manually Again',
  description:
    'A lightweight Chrome Extension that automatically logs you into the LPU captive portal WiFi network. Set it once, stay connected forever.',
  openGraph: {
    title: 'LPU WiFi Auto Login',
    description:
      'Automatically logs you into the LPU captive portal WiFi. Silent, background, zero effort.',
    url: 'https://iteshxt.me/lpu-wifi-auto-login',
  },
};

export default function LPUWifiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
