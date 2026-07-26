'use client';

import dynamic from "next/dynamic";

const SeoArchiveEdit = dynamic(() => import('@/components/pageComponent/SeoArchiveEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <SeoArchiveEdit />;
}
