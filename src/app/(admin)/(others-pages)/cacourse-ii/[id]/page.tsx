
'use client';

import dynamic from "next/dynamic";

const CapiiEdit = dynamic(() => import('@/components/pageComponent/CapiiEdit'), {
  ssr: false,
});

export default function Page() {
  return <CapiiEdit />;
}

