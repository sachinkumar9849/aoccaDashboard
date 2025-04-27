
'use client';


import dynamic from "next/dynamic";

const AlumniAdd = dynamic(() => import('@/components/pageComponent/AlumniAdd'), {
  ssr: false,
});

export default function Page() {
  return <AlumniAdd/>;
}
