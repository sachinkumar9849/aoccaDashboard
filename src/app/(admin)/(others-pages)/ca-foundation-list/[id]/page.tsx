
'use client';

import dynamic from "next/dynamic";

const CaFoundationEdit = dynamic(() => import('@/components/pageComponent/CaFoundationEdit'), {
  ssr: false,
});

export default function Page() {
  return <CaFoundationEdit />;
}

