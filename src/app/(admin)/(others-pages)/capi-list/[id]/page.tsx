
'use client';

import dynamic from "next/dynamic";

const CapiEdit = dynamic(() => import('@/components/pageComponent/CapiEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <CapiEdit />;
}

