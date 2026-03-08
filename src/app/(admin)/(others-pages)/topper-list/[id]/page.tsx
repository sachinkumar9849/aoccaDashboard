

'use client';

import dynamic from "next/dynamic";

const TopperStudentEdit = dynamic(() => import('@/components/pageComponent/TopperStudentEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <TopperStudentEdit />;
}



