
'use client';

import dynamic from "next/dynamic";

const CapiEdit = dynamic(() => import('@/components/pageComponent/CapiEdit'), {
  ssr: false,
});

export default function Page() {
  return <CapiEdit />;
}

