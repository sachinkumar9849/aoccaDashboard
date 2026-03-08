

'use client';

import dynamic from "next/dynamic";

const CaFinalEdit = dynamic(() => import('@/components/pageComponent/CaFinalEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <CaFinalEdit />;
}



