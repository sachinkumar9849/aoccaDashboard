

'use client';


import dynamic from "next/dynamic";

const TestimonialAdd = dynamic(() => import('@/components/pageComponent/TestimonialAdd').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <TestimonialAdd/>;
}
