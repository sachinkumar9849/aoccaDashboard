

'use client';


import dynamic from "next/dynamic";

const TestimonialAdd = dynamic(() => import('@/components/pageComponent/TestimonialAdd'), {
  ssr: false,
});

export default function Page() {
  return <TestimonialAdd/>;
}
