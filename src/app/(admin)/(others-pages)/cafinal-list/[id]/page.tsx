

'use client';

import dynamic from "next/dynamic";

const CaFinalEdit = dynamic(() => import('@/components/pageComponent/CaFinalEdit'), {
  ssr: false,
});

export default function Page() {
  return <CaFinalEdit />;
}



