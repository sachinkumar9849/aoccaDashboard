
'use client';

import dynamic from "next/dynamic";

const NewsEdit = dynamic(() => import('@/components/pageComponent/NewsEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <NewsEdit />;
}

