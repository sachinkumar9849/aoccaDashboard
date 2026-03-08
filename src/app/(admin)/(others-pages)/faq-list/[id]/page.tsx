
'use client';

import dynamic from "next/dynamic";

const FaqEdit = dynamic(() => import('@/components/pageComponent/FaqEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <FaqEdit />;
}

