
'use client';

import dynamic from "next/dynamic";

const CaIntermediateEdit = dynamic(() => import('@/components/pageComponent/CaIntermediateEdit'), {
  ssr: false,
});

export default function Page() {
  return <CaIntermediateEdit />;
}

