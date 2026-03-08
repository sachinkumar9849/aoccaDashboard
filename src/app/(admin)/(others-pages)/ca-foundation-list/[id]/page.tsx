
'use client';

import dynamic from "next/dynamic";

const CaFoundationEdit = dynamic(() => import('@/components/pageComponent/CaFoundationEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <CaFoundationEdit />;
}

