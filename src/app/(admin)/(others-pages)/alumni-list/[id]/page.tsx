

'use client';

import dynamic from "next/dynamic";

const AlumniEdit = dynamic(() => import('@/components/pageComponent/AlumniEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <AlumniEdit />;
}



