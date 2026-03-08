
'use client';


import dynamic from "next/dynamic";

const AlumniAdd = dynamic(() => import('@/components/pageComponent/AlumniAdd').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <AlumniAdd/>;
}
