
'use client';

import dynamic from "next/dynamic";

const MandatoryTrainingEdit = dynamic(() => import('@/components/pageComponent/MandatoryTrainingEdit').then(mod => mod.default), {
  ssr: false,
});

export default function Page() {
  return <MandatoryTrainingEdit />;
}

