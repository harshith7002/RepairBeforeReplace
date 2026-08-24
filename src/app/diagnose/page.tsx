import { Suspense } from 'react';
import { DiagnosticWorkspace } from '@/components/DiagnosticWorkspace';

export const metadata = {
  title: 'Diagnostic Workstation — RepairBeforeReplace',
};

export default function DiagnosePage() {
  return (
    <Suspense fallback={null}>
      <DiagnosticWorkspace />
    </Suspense>
  );
}
