

'use client';


import dynamic from "next/dynamic";

const TeamAdd = dynamic(() => import('@/components/pageComponent/TeamAdd').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <TeamAdd/>;
}
