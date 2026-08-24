import { Suspense } from 'react';
import { RepairGuideView } from '@/components/RepairGuideView';

export const metadata = {
  title: 'Interactive Repair Guide — RepairBeforeReplace',
};

export default function RepairPage() {
  return (
    <Suspense fallback={null}>
      <RepairGuideView />
    </Suspense>
  );
}
