

'use client';

import dynamic from "next/dynamic";

const TestimonialEdit = dynamic(() => import('@/components/pageComponent/TestimonialEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <TestimonialEdit />;
}



