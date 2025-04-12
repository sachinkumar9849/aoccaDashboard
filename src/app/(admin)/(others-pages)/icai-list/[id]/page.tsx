
// 'use client';

// import dynamic from "next/dynamic";

// const CapiiiEdit = dynamic(() => import('@/components/pageComponent/CapiiiEdit'), {
//   ssr: false,
// });

// export default function Page() {
//   return <CapiiiEdit />;
// }



'use client';

import dynamic from "next/dynamic";

const CapiiiEdit = dynamic(() => import('@/components/pageComponent/CapiiiEdit'), {
  ssr: false,
});

export default function Page() {
  return <CapiiiEdit />;
}



