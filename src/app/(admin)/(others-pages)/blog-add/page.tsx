
'use client';


import dynamic from "next/dynamic";

const BlogAdd = dynamic(() => import('@/components/pageComponent/BlogAdd'), {
  ssr: false,
});

export default function Page() {
  return <BlogAdd/>;
}
