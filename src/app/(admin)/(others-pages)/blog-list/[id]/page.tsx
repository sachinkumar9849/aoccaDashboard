
'use client';

import dynamic from "next/dynamic";

const BlogEdit = dynamic(() => import('@/components/pageComponent/BlogEdit'), {
  ssr: false,
});

export default function Page() {
  return <BlogEdit />;
}
