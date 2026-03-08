
'use client';


import dynamic from "next/dynamic";

const BlogAdd = dynamic(() => import('@/components/pageComponent/BlogAdd').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <BlogAdd/>;
}
