

'use client';

import dynamic from "next/dynamic";

const IcaiEdit = dynamic(() => import('@/components/pageComponent/IcaiEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <IcaiEdit />;
}



