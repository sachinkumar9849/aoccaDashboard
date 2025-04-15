
'use client';

import dynamic from "next/dynamic";

const FaqEdit = dynamic(() => import('@/components/pageComponent/FaqEdit'), {
  ssr: false,
});

export default function Page() {
  return <FaqEdit />;
}

