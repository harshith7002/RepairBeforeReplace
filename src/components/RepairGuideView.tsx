'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { DiagnosticItem } from '../types';
import {
  ArrowLeft, ArrowRight, Wrench, Clock, ShieldAlert,
  CheckCircle2, AlertOctagon, Lightbulb, Loader2,
} from 'lucide-react';

export const RepairGuideView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [item, setItem] = useState<DiagnosticItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const url = id ? `/api/diagnostics/${id}` : null;
        if (!url) {
          // No id supplied — fall back to the most recent diagnosis on record.
          const listRes = await fetch('/api/diagnostics?limit=1', { cache: 'no-store' });
          if (!listRes.ok) throw new Error('Failed to load a diagnosis to repair.');
          const listData = await listRes.json();
          const first: DiagnosticItem | undefined = listData.items?.[0];
          if (!first) {
            if (!cancelled) {
              setItem(null);
              setIsLoading(false);
            }
            return;
          }
          if (!cancelled) {
            setItem(first);
            setCompletedSteps(first.completedSteps ?? []);
            setCurrentStepIndex(0);
            setIsLoading(false);
          }
          return;
        }

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('That diagnosis record could not be found.');
        const data: DiagnosticItem = await res.json();
        if (!cancelled) {
          setItem(data);
          setCompletedSteps(data.completedSteps ?? []);
          setCurrentStepIndex(0);
        }
      } catch (err) {
        if (!cancelled) setErrorMessage(err instanceof Error ? err.message : 'Failed to load repair guide.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  const persistProgress = async (nextCompleted: number[]) => {
    if (!item) return;
    try {
      await fetch(`/api/diagnostics/${item.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ completedSteps: nextCompleted }),
      });
    } catch {
      // Best-effort persistence — progress still works locally even if this fails.
    }
  };

  const handleNext = () => {
    if (!item) return;
    const steps = item.repairSteps;
    let next = completedSteps;
    if (!completedSteps.includes(currentStepIndex)) {
      next = [...completedSteps, currentStepIndex];
      setCompletedSteps(next);
      persistProgress(next);
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleFinish = () => {
    if (!item) return;
    if (!completedSteps.includes(currentStepIndex)) {
      const next = [...completedSteps, currentStepIndex];
      setCompletedSteps(next);
      persistProgress(next);
    }
    router.push('/history');
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (errorMessage || !item) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-4 text-center">
        <AlertOctagon className="w-10 h-10 text-amber-400 mx-auto" />
        <h1 className="text-xl font-bold text-white">
          {errorMessage || 'No diagnosis available yet.'}
        </h1>
        <p className="text-sm text-slate-400">
          Run a diagnosis first to generate a repair manual.
        </p>
        <Link
          href="/diagnose"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded bg-industrial-orange hover:bg-orange-600 text-white font-mono text-xs font-bold"
        >
          <span>Go to Diagnostic Workstation →</span>
        </Link>
      </div>
    );
  }

  const steps = item.repairSteps;
  const currentStep = steps[currentStepIndex];

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Top Breadcrumb & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-graphite-border pb-6">
        <div>
          <Link
            href={`/diagnose?id=${item.id}`}
            className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-industrial-orange transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Diagnosis Workstation</span>
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Interactive Repair Manual
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-orange-950 border border-orange-500/40 text-orange-400 font-mono text-xs font-bold">
              {item.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Procedure: <strong className="text-white">{item.primaryIssue.name}</strong>
          </p>
        </div>

        {/* Telemetry Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-charcoal-800 border border-graphite-border px-3 py-1.5 rounded flex items-center space-x-2 text-xs">
            <Clock className="w-3.5 h-3.5 text-industrial-orange" />
            <span className="font-mono text-slate-400">Est. Time:</span>
            <span className="font-mono font-bold text-white">{item.estimatedTime}</span>
          </div>

          <div className="bg-charcoal-800 border border-graphite-border px-3 py-1.5 rounded flex items-center space-x-2 text-xs">
            <Wrench className="w-3.5 h-3.5 text-industrial-orange" />
            <span className="font-mono text-slate-400">Difficulty:</span>
            <span className="font-mono font-bold text-amber-400">{item.difficulty}</span>
          </div>

          <div className="bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded text-xs text-emerald-400 font-mono font-bold">
            Repairability: {item.repairability.totalScore}/100
          </div>
        </div>
      </div>

      {/* Safety Prerequisite Warning Banner */}
      <div className="bg-amber-950/50 border border-amber-500/40 rounded-lg p-4 flex items-start space-x-3 text-xs text-amber-200">
        <AlertOctagon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
            Mandatory Safety Precaution:
          </span>
          <p className="leading-relaxed">
            {item.safetyWarnings[0]}
          </p>
        </div>
      </div>

      {/* Required Tools Telemetry Section */}
      <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-5 shadow-workstation space-y-3">
        <div className="flex items-center justify-between border-b border-graphite-border pb-2">
          <span className="font-mono text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-industrial-orange" />
            <span>Tools & Materials Required</span>
          </span>
          <span className="font-mono text-[11px] text-graphite-muted">
            {item.toolsRequired.length} items needed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {item.toolsRequired.map((tool, i) => (
            <div key={i} className="bg-charcoal-900 p-2.5 rounded border border-graphite-border/70 text-xs">
              <span className="font-bold text-white block">{tool.name}</span>
              <span className="font-mono text-[10px] text-slate-400 block mt-0.5">{tool.spec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-4 shadow-workstation space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-industrial-orange font-bold uppercase tracking-wider">
            Procedure Progress
          </span>
          <span className="text-white font-extrabold text-sm">
            STEP 0{currentStepIndex + 1} / 0{steps.length}
          </span>
        </div>

        {/* Visual Progress Segments */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((s, idx) => {
            const isActive = idx === currentStepIndex;
            const isDone = completedSteps.includes(idx) || idx < currentStepIndex;

            return (
              <button
                key={s.stepNumber}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2.5 rounded transition-all cursor-pointer ${
                  isActive
                    ? 'bg-industrial-orange ring-2 ring-orange-500/50'
                    : isDone
                    ? 'bg-emerald-500'
                    : 'bg-charcoal-700 hover:bg-slate-600'
                }`}
                title={`Step ${idx + 1}: ${s.title}`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <span>{steps[currentStepIndex].title}</span>
          <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete</span>
        </div>
      </div>

      {/* MAIN STEP INTERFACE CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Visual Diagram/Photo (6 Cols on LG) */}
        <div className="lg:col-span-6 bg-charcoal-900 border border-graphite-border rounded-lg overflow-hidden shadow-workstation">
          <div className="bg-charcoal-800 border-b border-graphite-border px-4 py-2 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-300 font-bold uppercase">
              Step 0{currentStep.stepNumber} Diagram Overlay
            </span>
            <span className="font-mono text-[10px] text-graphite-muted">
              Annotated Inspection View
            </span>
          </div>

          <div className="relative aspect-[16/10] bg-charcoal-950 overflow-hidden">
            <img
              src={currentStep.imageUrl}
              alt={currentStep.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-4 left-4 right-4 bg-charcoal-900/90 border border-graphite-border p-3 rounded backdrop-blur-md">
              <span className="font-mono text-[10px] text-industrial-orange uppercase font-bold tracking-wider block">
                Target Zone:
              </span>
              <p className="text-xs text-white font-semibold">{currentStep.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Right Step Guidance & Next Action (6 Cols on LG) */}
        <div className="lg:col-span-6 space-y-6">

          <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 shadow-workstation space-y-6">

            {/* Step Header */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-industrial-orange text-white font-mono text-xs font-bold uppercase">
                  STEP 0{currentStep.stepNumber}
                </span>
                <span className="font-mono text-xs text-graphite-muted uppercase">
                  {currentStep.subtitle}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight mt-2">
                {currentStep.title}
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-200 leading-relaxed">
              {currentStep.description}
            </p>

            {/* Checklist Details */}
            <div className="space-y-2 bg-charcoal-900 p-4 rounded-lg border border-graphite-border">
              <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Action Instructions:
              </span>
              {currentStep.details.map((detail, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{detail}</span>
                </div>
              ))}
            </div>

            {/* Safety Note or Pro Tip */}
            {currentStep.safetyNote && (
              <div className="bg-amber-950/60 border border-amber-500/40 p-3 rounded flex items-start space-x-2 text-xs text-amber-300">
                <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span><strong>Safety Note:</strong> {currentStep.safetyNote}</span>
              </div>
            )}

            {currentStep.proTip && (
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded flex items-start space-x-2 text-xs text-emerald-300">
                <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Pro Tip:</strong> {currentStep.proTip}</span>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-graphite-border">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded font-mono text-xs font-medium transition-all ${
                  currentStepIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-charcoal-900 text-slate-500'
                    : 'bg-charcoal-900 border border-graphite-border text-slate-200 hover:border-white hover:bg-charcoal-700'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentStepIndex < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded bg-industrial-orange hover:bg-orange-600 text-white font-mono text-xs font-bold transition-all shadow-sm active:scale-98"
                >
                  <span>Next Step 0{currentStepIndex + 2} →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finish & Log Repair</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
