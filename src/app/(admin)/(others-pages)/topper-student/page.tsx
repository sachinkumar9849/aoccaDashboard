
'use client';


import dynamic from "next/dynamic";

const TopperStudent = dynamic(() => import('@/components/pageComponent/TopperStudent'), {
  ssr: false,
});

export default function Page() {
  return <TopperStudent/>;
}
