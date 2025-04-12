

'use client';

import dynamic from "next/dynamic";

const TopperStudentEdit = dynamic(() => import('@/components/pageComponent/TopperStudentEdit'), {
  ssr: false,
});

export default function Page() {
  return <TopperStudentEdit />;
}



