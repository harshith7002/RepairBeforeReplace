'use client';

import React, { useState } from 'react';
import { ComponentMarker } from '../types';
import { Eye, Cpu, AlertTriangle, CheckCircle, Info, Sparkles, Layers } from 'lucide-react';

interface DetectionOverlayProps {
  imageUrl: string;
  markers: ComponentMarker[];
  activeMarkerId?: string;
  onSelectMarker?: (marker: ComponentMarker) => void;
  interactive?: boolean;
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({
  imageUrl,
  markers,
  activeMarkerId,
  onSelectMarker,
  interactive = true,
}) => {
  const [viewMode, setViewMode] = useState<'annotated' | 'original'>('annotated');
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

  const activeMarker = markers.find(m => m.id === (activeMarkerId || hoveredMarkerId));

  return (
    <div className="relative rounded-lg overflow-hidden bg-charcoal-900 border border-graphite-border shadow-workstation group">
      
      {/* Top Telemetry Header Bar */}
      <div className="bg-charcoal-800 border-b border-graphite-border px-4 py-2 flex items-center justify-between z-20 relative">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-mono text-xs text-white">
            <Cpu className="w-4 h-4 text-industrial-orange animate-pulse" />
            <span className="font-bold uppercase tracking-wider">Visual Inspection</span>
          </div>
          <span className="font-mono text-[11px] text-graphite-muted hidden sm:inline">
            [RGB VISUAL ANALYSIS]
          </span>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center space-x-1 bg-charcoal-900 p-0.5 rounded border border-graphite-border">
          <button
            onClick={() => setViewMode('original')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
              viewMode === 'original'
                ? 'bg-graphite text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Original</span>
            </span>
          </button>
          <button
            onClick={() => setViewMode('annotated')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
              viewMode === 'annotated'
                ? 'bg-industrial-orange text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5" />
              <span>AI Analysis</span>
            </span>
          </button>
        </div>
      </div>

      {/* Main Visual Frame & Canvas */}
      <div className="relative w-full aspect-[16/10] bg-charcoal-900 overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <img
          src={imageUrl}
          alt="Hardware diagnostic object"
          className="w-full h-full object-cover select-none transition-all duration-300"
        />

        {/* AI Analysis Overlay Layer */}
        {viewMode === 'annotated' && (
          <div className="absolute inset-0 bg-charcoal-900/30 backdrop-contrast-105 pointer-events-auto">
            
            {/* Subtle Diagnostic Grid Lines overlay */}
            <div className="absolute inset-0 bg-[linear-[#ffffff08]_1px,transparent_1px] bg-[size:32px_32px] pointer-events-none" />

            {/* Scanning Laser Animation Line */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-industrial-orange to-transparent opacity-80 animate-[scan_4s_ease-in-out_infinite] shadow-[0_0_15px_#ea580c] pointer-events-none" />

            {/* Bounding Boxes & Markers SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {markers.map((marker) => {
                const isSelected = marker.id === activeMarkerId;
                const isHovered = marker.id === hoveredMarkerId;
                const isHighlight = isSelected || isHovered;

                const strokeColor = marker.status === 'critical'
                  ? '#EA580C'
                  : marker.status === 'warning'
                  ? '#D97706'
                  : '#059669';

                return (
                  <g key={marker.id} className="pointer-events-auto cursor-pointer">
                    {/* Bounding Box Rectangle */}
                    {marker.width && marker.height && (
                      <rect
                        x={`${marker.x - marker.width / 2}%`}
                        y={`${marker.y - marker.height / 2}%`}
                        width={`${marker.width}%`}
                        height={`${marker.height}%`}
                        fill={isHighlight ? `${strokeColor}22` : `${strokeColor}08`}
                        stroke={strokeColor}
                        strokeWidth={isHighlight ? 2.5 : 1.5}
                        strokeDasharray={isHighlight ? 'none' : '4,3'}
                        className="transition-all duration-200"
                        onClick={() => interactive && onSelectMarker?.(marker)}
                        onMouseEnter={() => setHoveredMarkerId(marker.id)}
                        onMouseLeave={() => setHoveredMarkerId(null)}
                      />
                    )}

                    {/* Corner Reticle Anchors */}
                    {marker.width && marker.height && (
                      <>
                        <path
                          d={`M ${marker.x - marker.width / 2}% ${(marker.y - marker.height / 2) + 2}% L ${marker.x - marker.width / 2}% ${marker.y - marker.height / 2}% L ${(marker.x - marker.width / 2) + 2}% ${marker.y - marker.height / 2}%`}
                          stroke={strokeColor}
                          strokeWidth="2.5"
                          fill="none"
                        />
                        <path
                          d={`M ${(marker.x + marker.width / 2) - 2}% ${marker.y - marker.height / 2}% L ${marker.x + marker.width / 2}% ${marker.y - marker.height / 2}% L ${marker.x + marker.width / 2}% ${(marker.y - marker.height / 2) + 2}%`}
                          stroke={strokeColor}
                          strokeWidth="2.5"
                          fill="none"
                        />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Interactive Marker Pins */}
            {markers.map((marker) => {
              const isSelected = marker.id === activeMarkerId;
              const isHovered = marker.id === hoveredMarkerId;
              const isHighlight = isSelected || isHovered;

              const bgBadge = marker.status === 'critical'
                ? 'bg-industrial-orange'
                : marker.status === 'warning'
                ? 'bg-amber-600'
                : 'bg-emerald-600';

              return (
                <div
                  key={`pin-${marker.id}`}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group/pin"
                  onClick={() => interactive && onSelectMarker?.(marker)}
                  onMouseEnter={() => setHoveredMarkerId(marker.id)}
                  onMouseLeave={() => setHoveredMarkerId(null)}
                >
                  {/* Ping Animation Ring */}
                  {marker.status === 'critical' && (
                    <span className="absolute -inset-2 rounded-full bg-industrial-orange opacity-40 animate-ping pointer-events-none" />
                  )}

                  {/* Marker Node Button */}
                  <div
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border font-mono text-xs shadow-lg transition-all transform ${
                      isHighlight
                        ? 'scale-110 border-white text-white shadow-orange-500/40 font-bold ' + bgBadge
                        : 'border-slate-300/40 bg-charcoal-900/90 text-slate-200 hover:border-white'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${bgBadge}`} />
                    <span>{marker.label}</span>
                  </div>
                </div>
              );
            })}

          </div>
        )}

        {/* Corner Diagnostic Overlay Details Box */}
        {viewMode === 'annotated' && activeMarker && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-charcoal-900/95 border border-graphite-border p-3.5 rounded-lg shadow-2xl z-40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {activeMarker.status === 'critical' ? (
                  <AlertTriangle className="w-4 h-4 text-industrial-orange flex-shrink-0" />
                ) : activeMarker.status === 'warning' ? (
                  <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
                <div>
                  <span className="font-mono text-[10px] text-graphite-muted uppercase tracking-wider block">
                    Component Inspection
                  </span>
                  <h4 className="font-bold text-sm text-white">{activeMarker.title}</h4>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                activeMarker.status === 'critical'
                  ? 'bg-orange-950 text-orange-400 border border-orange-500/40'
                  : activeMarker.status === 'warning'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              }`}>
                {activeMarker.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {activeMarker.description}
            </p>

            {activeMarker.symptomDetected && (
              <div className="mt-2 pt-2 border-t border-graphite-border flex items-center space-x-2 text-[11px] font-mono text-amber-400">
                <Sparkles className="w-3 h-3 flex-shrink-0" />
                <span>Detected Symptom: {activeMarker.symptomDetected}</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
