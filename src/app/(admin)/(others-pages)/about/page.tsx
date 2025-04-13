
'use client';


import dynamic from "next/dynamic";

const AboutEdit = dynamic(() => import('@/components/pageComponent/AboutEdit'), {
  ssr: false,
});

export default function Page() {
  return <AboutEdit/>;
}
