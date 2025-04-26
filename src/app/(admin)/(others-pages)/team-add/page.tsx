

'use client';


import dynamic from "next/dynamic";

const TeamAddTwo = dynamic(() => import('@/components/pageComponent/TeamAddTwo'), {
  ssr: false,
});

export default function Page() {
  return <TeamAddTwo/>;
}
