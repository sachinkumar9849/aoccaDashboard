

'use client';

import dynamic from "next/dynamic";

const IcaiEdit = dynamic(() => import('@/components/pageComponent/IcaiEdit'), {
  ssr: false,
});

export default function Page() {
  return <IcaiEdit />;
}



