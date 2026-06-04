'use client';

import dynamic from 'next/dynamic';

const FacilityExperience = dynamic(
  () => import('@/components/facility/FacilityExperience'),
  { ssr: false }
);

export default function Home() {
  return <FacilityExperience />;
}
