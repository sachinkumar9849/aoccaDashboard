
'use client';

import dynamic from "next/dynamic";

const MandatoryTrainingEdit = dynamic(() => import('@/components/pageComponent/MandatoryTrainingEdit'), {
  ssr: false,
});

export default function Page() {
  return <MandatoryTrainingEdit />;
}

