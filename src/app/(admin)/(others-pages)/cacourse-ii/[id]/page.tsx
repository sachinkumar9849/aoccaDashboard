
'use client';

import dynamic from "next/dynamic";

const CapiiEdit = dynamic(() => import('@/components/pageComponent/CapiiEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <CapiiEdit />;
}

