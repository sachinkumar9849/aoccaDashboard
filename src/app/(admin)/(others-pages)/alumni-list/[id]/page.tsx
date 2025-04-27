

'use client';

import dynamic from "next/dynamic";

const AlumniEdit = dynamic(() => import('@/components/pageComponent/AlumniEdit'), {
  ssr: false,
});

export default function Page() {
  return <AlumniEdit />;
}



