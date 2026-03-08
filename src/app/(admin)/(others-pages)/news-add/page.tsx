'use client';

import dynamic from "next/dynamic";

const NewsAdd = dynamic(() => import('@/components/pageComponent/NewsAdd').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <NewsAdd />;
}
