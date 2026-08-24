'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WASHING_MACHINE_DEMO } from '../data/mockData';
import { DetectionOverlay } from './DetectionOverlay';
import { RepairabilityScore } from './RepairabilityScore';
import { RepairVsReplace } from './RepairVsReplace';
import { ImpactCalculator } from './ImpactCalculator';
import { SafetyNotice } from './SafetyNotice';
import { 
  Wrench, Cpu, ShieldCheck, ArrowRight, Play, Eye, 
  Sparkles, CheckCircle2, AlertTriangle, Layers, Activity, Search, Leaf, Compass, PlayCircle 
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const router = useRouter();
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);

  const demoItem = WASHING_MACHINE_DEMO;

  const workflowSteps = [
    {
      step: '01',
      title: 'Show it',
      subtitle: 'Upload photo or video',
      desc: 'Capture broken object via phone camera or drag a high-res photo/video onto the workstation.',
      badge: 'Visual Input'
    },
    {
      step: '02',
      title: 'We inspect it',
      subtitle: 'Segment hardware components',
      desc: 'AI computer-vision segments physical assemblies, thermal gradients, and acoustic signatures.',
      badge: 'Neural Segmentation'
    },
    {
      step: '03',
      title: 'We diagnose it',
      subtitle: 'Rank root cause probability',
      desc: 'Calculates primary failure mode, confidence probability, and transparent 0-100 repairability index.',
      badge: 'Diagnostic Telemetry'
    },
    {
      step: '04',
      title: 'We guide you',
      subtitle: 'Interactive step manual',
      desc: 'Presents safety prerequisites, required hand tools, and 3D visual component step instructions.',
      badge: 'Guided Repair'
    },
    {
      step: '05',
      title: 'You decide',
      subtitle: 'Repair vs Replace evidence',
      desc: 'Compares ₹1,200 repair cost against ₹18,000 replacement with net carbon and waste savings.',
      badge: 'Economic Decision'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Wide Split Diagnostic Workstation (45% Text / 55% UI)   */}
      {/* ========================================================================= */}
      <section className="relative pt-6 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Product Message (45% -> 5 Cols LG) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-charcoal-800 border border-graphite-border text-xs font-mono text-amber-400">
              <Sparkles className="w-3.5 h-3.5 text-industrial-orange animate-pulse" />
              <span>AI Visual Hardware Telemetry</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Before you replace it, see if it can be repaired.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
              Upload a photo or short video of a broken object. <strong className="text-white">RepairBeforeReplace</strong> uses AI to identify the likely problem, estimate repairability, and guide you through the next step.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                href="/diagnose"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded bg-industrial-orange hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-orange-500/25 active:scale-98"
              >
                <span>Diagnose an object →</span>
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded bg-charcoal-800 hover:bg-charcoal-700 border border-graphite-border text-slate-200 hover:text-white font-medium text-sm transition-colors"
              >
                <span>See how it works</span>
              </Link>
            </div>

            {/* Central Product Philosophy Callout */}
            <div className="p-4 rounded-lg bg-charcoal-800/80 border-l-4 border-industrial-orange text-xs text-slate-300 font-mono space-y-1">
              <span className="text-industrial-orange font-bold uppercase tracking-wider block">
                Central Mission
              </span>
              <p className="text-sm font-semibold text-white italic">
                “We built AI that tells you when NOT to buy something.”
              </p>
            </div>

          </div>

          {/* Right Column: Visual Hero Product Demo (55% -> 7 Cols LG) */}
          <div className="lg:col-span-7">
            <div className="bg-charcoal-800 border border-graphite-border rounded-xl p-4 sm:p-6 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-graphite-border pb-3 text-xs font-mono text-slate-400">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <Activity className="w-4 h-4 text-industrial-orange animate-pulse" />
                  <span>Live Workstation Hero Telemetry</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-emerald-400 font-semibold">Ready for Upload</span>
                </div>
              </div>

              {/* Computer Vision Annotated Hero Canvas */}
              <DetectionOverlay
                imageUrl={demoItem.fullImageUrl}
                markers={demoItem.markers}
                activeMarkerId={demoItem.markers[0].id}
              />

              {/* Preliminary Diagnosis Panel Overlay */}
              <div className="bg-charcoal-900 border border-graphite-border rounded-lg p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                <div className="sm:col-span-7 space-y-1">
                  <span className="font-mono text-[10px] uppercase text-industrial-orange font-bold tracking-wider block">
                    Preliminary Diagnosis
                  </span>
                  <h3 className="font-bold text-base text-white">
                    {demoItem.primaryIssue.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    Recommend action: Inspect lower pump filter before replacing unit.
                  </p>
                </div>

                <div className="sm:col-span-5 flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 sm:border-l border-graphite-border pt-3 sm:pt-0 sm:pl-4">
                  <div className="text-left sm:text-right">
                    <span className="font-mono text-[10px] text-graphite-muted uppercase block">Confidence</span>
                    <span className="font-mono font-bold text-base text-emerald-400">{demoItem.primaryIssue.confidence}%</span>
                  </div>

                  <div className="text-left sm:text-right bg-emerald-950/80 px-3 py-1.5 rounded border border-emerald-500/40">
                    <span className="font-mono text-[10px] text-emerald-300 uppercase block">Repairability</span>
                    <span className="font-mono font-bold text-base text-emerald-400">{demoItem.repairability.totalScore} / 100</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. THE BIG PRODUCT MOMENT: "What if your broken object could explain itself?" */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-charcoal-800 border border-graphite-border rounded-xl p-8 sm:p-12 shadow-workstation space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="font-mono text-xs text-industrial-orange font-bold uppercase tracking-widest">
              Automated Inspection Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              What if your broken object could explain itself?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              A 5-step visual workflow that turns physical damage into an understandable, actionable repair path.
            </p>
          </div>

          {/* 5-Step Horizontal Workflow Layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((wf, idx) => {
              const stepNum = idx + 1;
              const isActive = activeWorkflowStep === stepNum;
              return (
                <div
                  key={wf.step}
                  onClick={() => setActiveWorkflowStep(stepNum)}
                  className={`p-5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isActive
                      ? 'bg-charcoal-900 border-industrial-orange shadow-hud scale-102'
                      : 'bg-charcoal-900/60 border-graphite-border/70 hover:border-slate-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-extrabold text-industrial-orange">
                        {wf.step}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-charcoal-800 border border-graphite-border text-[9px] font-mono text-slate-300">
                        {wf.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white">{wf.title}</h3>
                    <span className="font-mono text-xs text-slate-400 block">{wf.subtitle}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {wf.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Interactive Workflow Product Preview Stage */}
          <div className="bg-charcoal-900 border border-graphite-border rounded-lg p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-graphite-border pb-3">
              <span>Interactive Workflow Preview // Step 0{activeWorkflowStep}</span>
              <span className="text-industrial-orange font-bold">
                {workflowSteps[activeWorkflowStep - 1].title} — {workflowSteps[activeWorkflowStep - 1].subtitle}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded bg-orange-950 border border-orange-500/40 font-mono text-xs font-bold text-orange-400">
                  Step 0{activeWorkflowStep} Output Telemetry
                </span>
                <h3 className="text-xl font-bold text-white">
                  {activeWorkflowStep === 1 && "Ingesting High-Resolution Hardware Photo & Acoustic Video"}
                  {activeWorkflowStep === 2 && "Segmenting Motors, Impellers, Valves & Structural Castings"}
                  {activeWorkflowStep === 3 && "Correlating Acoustic Vibration Profiles with Known Failure Nodes"}
                  {activeWorkflowStep === 4 && "Generating Interactive 3D Step Manual & Tool Requirement List"}
                  {activeWorkflowStep === 5 && "Calculating ₹16,500 Net Cost Savings vs Replacement Unit"}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {workflowSteps[activeWorkflowStep - 1].desc}
                </p>
                <div className="pt-2">
                  <Link
                    href="/diagnose"
                    className="inline-flex items-center space-x-2 text-xs font-mono text-industrial-orange hover:text-orange-400 font-bold"
                  >
                    <span>Launch Live Diagnostic Workstation →</span>
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[16/10] bg-charcoal-950 rounded border border-graphite-border overflow-hidden">
                <img
                  src={demoItem.fullImageUrl}
                  alt="Workflow Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal-900/40 backdrop-contrast-105 flex items-center justify-center">
                  <span className="px-4 py-2 rounded bg-charcoal-900/90 border border-graphite-border text-xs font-mono text-white font-bold shadow-lg">
                    Stage 0{activeWorkflowStep}: {workflowSteps[activeWorkflowStep - 1].badge} Active
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. DIAGNOSTIC RESULT & REPAIRABILITY SCORE SECTION                       */}
      {/* ========================================================================= */}
      <section id="repairability" className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <RepairabilityScore score={demoItem.repairability} />
      </section>


      {/* ========================================================================= */}
      {/* 4. DON'T REPLACE IT YET (ECONOMIC COST COMPARISON)                      */}
      {/* ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <RepairVsReplace
          repairCost={demoItem.repairCostRange}
          replaceCost={demoItem.replaceCost}
          potentialSavings={demoItem.potentialSavings}
          estimatedTime={demoItem.estimatedTime}
          difficulty={demoItem.difficulty}
          onGuideClick={() => router.push('/repair')}
        />
      </section>


      {/* ========================================================================= */}
      {/* 5. ENVIRONMENTAL IMPACT & SUSTAINABILITY                                 */}
      {/* ========================================================================= */}
      <section id="impact" className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <ImpactCalculator impact={demoItem.impact} />
      </section>


      {/* ========================================================================= */}
      {/* 6. HOW AI WORKS (TECHNICAL CREDIBILITY)                                  */}
      {/* ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal-800 border border-graphite-border rounded-xl p-8 sm:p-10 shadow-workstation space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-graphite-border pb-4 gap-4">
            <div>
              <span className="font-mono text-xs text-industrial-orange uppercase font-bold tracking-widest">
                Technical Pipeline
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                How AI Hardware Telemetry Works
              </h2>
            </div>
            <span className="px-3 py-1 rounded bg-charcoal-900 border border-graphite-border text-xs font-mono text-slate-300">
              Multimodal Vision & Knowledge Retrieval Architecture
            </span>
          </div>

          {/* Horizontal Technical Pipeline Diagram */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
            {[
              { title: 'Image / Video', desc: 'RGB-Thermal input' },
              { title: 'Object Detection', desc: 'Appliance classifier' },
              { title: 'Component Identification', desc: 'Sub-assembly map' },
              { title: 'Symptom Extraction', desc: 'Acoustic & visual' },
              { title: 'Knowledge Retrieval', desc: 'Service manual DB' },
              { title: 'Recommendation', desc: 'Repairability index' },
              { title: 'Interactive Guide', desc: '5-step manual' },
            ].map((p, i) => (
              <div key={i} className="bg-charcoal-900 p-3 rounded border border-graphite-border/70 space-y-1">
                <span className="font-mono text-[10px] text-industrial-orange font-bold block">
                  0{i + 1}
                </span>
                <h4 className="font-bold text-xs text-white">{p.title}</h4>
                <span className="text-[10px] font-mono text-slate-400 block">{p.desc}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded bg-charcoal-900/60 border border-graphite-border/70 text-xs text-slate-400 space-y-1">
            <p>
              <strong className="text-slate-200">Prototype Credibility Notice:</strong> RepairBeforeReplace is structured with a simulated analysis pipeline for real-time demonstration, designed for easy plug-and-play integration with multimodal AI API endpoints (such as Gemini 1.5 Pro / Flash Vision). Always verify recommendations against manufacturer documentation.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
