
'use client';

import dynamic from "next/dynamic";

const BlogEdit = dynamic(() => import('@/components/pageComponent/BlogEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <BlogEdit />;
}
