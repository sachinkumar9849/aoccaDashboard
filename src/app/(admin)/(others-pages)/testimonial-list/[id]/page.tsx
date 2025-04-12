

'use client';

import dynamic from "next/dynamic";

const TestimonialEdit = dynamic(() => import('@/components/pageComponent/TestimonialEdit'), {
  ssr: false,
});

export default function Page() {
  return <TestimonialEdit />;
}



