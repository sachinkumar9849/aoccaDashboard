// import AboutPage from '@/components/pageComponent/AboutPage'
// import React from 'react'

// const page = () => {
//   return (
//     <div>
//       <AboutPage/>
//     </div>
//   )
// }

// export default page


'use client';


import dynamic from "next/dynamic";

const AboutPage = dynamic(() => import('@/components/pageComponent/AboutPage'), {
  ssr: false,
});

export default function Page() {
  return <AboutPage/>;
}
