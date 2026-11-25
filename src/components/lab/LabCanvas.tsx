import React, { useCallback, useRef, useState } from 'react';
import {
  getComponentPins,
  getPinWorldPosition,
  LAB_GRID_SIZE,
  snapToGrid,
} from '../../data/labCatalog';
import type {
  LabComponentInstance,
  LabComponentType,
  LabSimulationResult,
  LabWire,
} from '../../types/electronics';
import { LabComponentSvg } from './LabComponentSvg';

interface PendingWire {
  fromCompId: string;
  fromPinId: string;
  x: number;
  y: number;
}

interface LabCanvasProps {
  components: LabComponentInstance[];
  wires: LabWire[];
  simResult: LabSimulationResult | null;
  isRunning: boolean;
  selectedCompIds: string[];
  selectedWireIds: string[];
  zoom: number;
  pan: { x: number; y: number };
  showGrid: boolean;
  snapEnabled: boolean;
  wiringHintText: string;
  cancelWireText: string;
  canvasHintText: string;
  onSelect: (compIds: string[], wireIds: string[]) => void;
  onMoveComponents: (updates: Record<string, { x: number; y: number }>, commitHistory: boolean) => void;
  onDropNewComponent: (type: LabComponentType, x: number, y: number) => void;
  onCreateWire: (fromCompId: string, fromPinId: string, toCompId: string, toPinId: string) => void;
  onToggleInteractive: (compId: string) => void;
  onZoomChange: (nextZoom: number) => void;
  onPanChange: (nextPan: { x: number; y: number }) => void;
}

export const LabCanvas: React.FC<LabCanvasProps> = ({
  components,
  wires,
  simResult,
  isRunning,
  selectedCompIds,
  selectedWireIds,
  zoom,
  pan,
  showGrid,
  snapEnabled,
  wiringHintText,
  cancelWireText,
  canvasHintText,
  onSelect,
  onMoveComponents,
  onDropNewComponent,
  onCreateWire,
  onToggleInteractive,
  onZoomChange,
  onPanChange,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [pendingWire, setPendingWire] = useState<PendingWire | null>(null);
  const [pointerWorld, setPointerWorld] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [marquee, setMarquee] = useState<{
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  } | null>(null);

  const dragStateRef = useRef<{
    mode: 'none' | 'pan' | 'move-comps' | 'marquee';
    startClientX: number;
    startClientY: number;
    startPan: { x: number; y: number };
    startWorld: { x: number; y: number };
    initialPositions: Record<string, { x: number; y: number }>;
    moved: boolean;
  }>({
    mode: 'none',
    startClientX: 0,
    startClientY: 0,
    startPan: { x: 0, y: 0 },
    startWorld: { x: 0, y: 0 },
    initialPositions: {},
    moved: false,
  });

  const clientToWorld = useCallback(
    (clientX: number, clientY: number) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (clientX - rect.left - pan.x) / zoom,
        y: (clientY - rect.top - pan.y) / zoom,
      };
    },
    [pan.x, pan.y, zoom]
  );

  const handleBackgroundPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (pendingWire) {
      setPendingWire(null);
      return;
    }

    const target = e.target as Element;
    if (target !== svgRef.current && !target.hasAttribute('data-lab-bg')) return;

    const world = clientToWorld(e.clientX, e.clientY);
    if (e.shiftKey) {
      dragStateRef.current = {
        mode: 'marquee',
        startClientX: e.clientX,
        startClientY: e.clientY,
        startPan: { ...pan },
        startWorld: world,
        initialPositions: {},
        moved: false,
      };
      setMarquee({ x0: world.x, y0: world.y, x1: world.x, y1: world.y });
    } else {
      onSelect([], []);
      dragStateRef.current = {
        mode: 'pan',
        startClientX: e.clientX,
        startClientY: e.clientY,
        startPan: { ...pan },
        startWorld: world,
        initialPositions: {},
        moved: false,
      };
    }
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const handleComponentPointerDown = (
    e: React.PointerEvent<SVGGElement>,
    comp: LabComponentInstance
  ) => {
    e.stopPropagation();
    if (pendingWire) return;

    const isMulti = e.shiftKey || e.ctrlKey || e.metaKey;
    let nextSelected = selectedCompIds;
    if (isMulti) {
      nextSelected = selectedCompIds.includes(comp.id)
        ? selectedCompIds.filter((id) => id !== comp.id)
        : [...selectedCompIds, comp.id];
    } else if (!selectedCompIds.includes(comp.id)) {
      nextSelected = [comp.id];
    }
    onSelect(nextSelected, []);

    const initialPositions: Record<string, { x: number; y: number }> = {};
    for (const c of components) {
      if (nextSelected.includes(c.id)) {
        initialPositions[c.id] = { x: c.x, y: c.y };
      }
    }

    dragStateRef.current = {
      mode: 'move-comps',
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPan: { ...pan },
      startWorld: clientToWorld(e.clientX, e.clientY),
      initialPositions,
      moved: false,
    };
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const world = clientToWorld(e.clientX, e.clientY);
    setPointerWorld(world);

    const ds = dragStateRef.current;
    if (ds.mode === 'pan') {
      onPanChange({
        x: ds.startPan.x + (e.clientX - ds.startClientX),
        y: ds.startPan.y + (e.clientY - ds.startClientY),
      });
    } else if (ds.mode === 'move-comps') {
      const dx = world.x - ds.startWorld.x;
      const dy = world.y - ds.startWorld.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) ds.moved = true;
      const updates: Record<string, { x: number; y: number }> = {};
      for (const [id, init] of Object.entries(ds.initialPositions)) {
        updates[id] = {
          x: snapEnabled ? snapToGrid(init.x + dx) : Math.round(init.x + dx),
          y: snapEnabled ? snapToGrid(init.y + dy) : Math.round(init.y + dy),
        };
      }
      onMoveComponents(updates, false);
    } else if (ds.mode === 'marquee') {
      setMarquee({
        x0: ds.startWorld.x,
        y0: ds.startWorld.y,
        x1: world.x,
        y1: world.y,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    const ds = dragStateRef.current;
    if (ds.mode === 'move-comps' && ds.moved) {
      const world = clientToWorld(e.clientX, e.clientY);
      const dx = world.x - ds.startWorld.x;
      const dy = world.y - ds.startWorld.y;
      const updates: Record<string, { x: number; y: number }> = {};
      for (const [id, init] of Object.entries(ds.initialPositions)) {
        updates[id] = {
          x: snapEnabled ? snapToGrid(init.x + dx) : Math.round(init.x + dx),
          y: snapEnabled ? snapToGrid(init.y + dy) : Math.round(init.y + dy),
        };
      }
      onMoveComponents(updates, true);
    } else if (ds.mode === 'marquee' && marquee) {
      const minX = Math.min(marquee.x0, marquee.x1);
      const maxX = Math.max(marquee.x0, marquee.x1);
      const minY = Math.min(marquee.y0, marquee.y1);
      const maxY = Math.max(marquee.y0, marquee.y1);
      const hitIds = components
        .filter((c) => c.x >= minX && c.x <= maxX && c.y >= minY && c.y <= maxY)
        .map((c) => c.id);
      onSelect(hitIds, []);
      setMarquee(null);
    }
    dragStateRef.current.mode = 'none';
  };

  const handlePinClick = (
    e: React.MouseEvent,
    comp: LabComponentInstance,
    pinId: string,
    wx: number,
    wy: number
  ) => {
    e.stopPropagation();
    if (!pendingWire) {
      setPendingWire({ fromCompId: comp.id, fromPinId: pinId, x: wx, y: wy });
      return;
    }
    if (pendingWire.fromCompId === comp.id && pendingWire.fromPinId === pinId) {
      setPendingWire(null);
      return;
    }
    onCreateWire(pendingWire.fromCompId, pendingWire.fromPinId, comp.id, pinId);
    setPendingWire(null);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    const nextZoom = Math.min(2.2, Math.max(0.35, Number((zoom * factor).toFixed(2))));
    onZoomChange(nextZoom);
  };

  const compMap = new Map(components.map((c) => [c.id, c]));

  const buildOrthogonalPath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = snapToGrid((x1 + x2) / 2, LAB_GRID_SIZE / 2);
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  };

  return (
    <div
      className="relative flex-1 min-h-[420px] lg:min-h-[580px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 select-none"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('application/x-electropedia-lab')) {
          e.preventDefault();
        }
      }}
      onDrop={(e) => {
        const type = e.dataTransfer.getData('application/x-electropedia-lab') as LabComponentType;
        if (!type) return;
        e.preventDefault();
        const world = clientToWorld(e.clientX, e.clientY);
        onDropNewComponent(type, world.x, world.y);
      }}
    >
      {/* Top Canvas Hint / Wiring Bar */}
      <div className="pointer-events-none absolute top-2.5 inset-x-3 z-10 flex items-center justify-between gap-2">
        <div className="pointer-events-auto rounded-lg border border-slate-200/90 dark:border-slate-700/90 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
          {pendingWire ? (
            <span className="flex items-center gap-2 text-blue-600 dark:text-sky-400 font-semibold">
              <span>{wiringHintText}</span>
              <button
                type="button"
                onClick={() => setPendingWire(null)}
                className="rounded bg-rose-500/15 px-2 py-0.5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25"
              >
                {cancelWireText}
              </button>
            </span>
          ) : (
            <span>{canvasHintText}</span>
          )}
        </div>
        <div className="rounded-lg border border-slate-200/90 dark:border-slate-700/90 bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 text-xs font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-200">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="lab-canvas-svg"
        className="w-full h-full touch-none cursor-grab active:cursor-grabbing text-slate-800 dark:text-slate-100"
        onPointerDown={handleBackgroundPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        style={{
          direction: 'ltr',
          ['--lab-node-bg' as string]: 'var(--color-lab-node, #ffffff)',
        }}
      >
        <defs>
          <pattern
            id="lab-grid-pattern"
            width={LAB_GRID_SIZE}
            height={LAB_GRID_SIZE}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={1} cy={1} r={1.1} className="fill-slate-300 dark:fill-slate-700" />
          </pattern>
        </defs>

        <rect
          data-lab-bg="true"
          x={0}
          y={0}
          width="100%"
          height="100%"
          fill={showGrid ? 'url(#lab-grid-pattern)' : 'transparent'}
        />

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Rendered Wires */}
          {wires.map((wire) => {
            const fromC = compMap.get(wire.fromCompId);
            const toC = compMap.get(wire.toCompId);
            if (!fromC || !toC) return null;
            const fromPin = getComponentPins(fromC).find((p) => p.id === wire.fromPinId);
            const toPin = getComponentPins(toC).find((p) => p.id === wire.toPinId);
            if (!fromPin || !toPin) return null;

            const p1 = getPinWorldPosition(fromC, fromPin);
            const p2 = getPinWorldPosition(toC, toPin);
            const d = buildOrthogonalPath(p1.x, p1.y, p2.x, p2.y);
            const isSel = selectedWireIds.includes(wire.id);
            const wireCurrent = isRunning ? simResult?.wireCurrents[wire.id] ?? 0 : 0;
            const hasFlow = isRunning && wireCurrent > 1e-4;

            return (
              <g
                key={wire.id}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onSelect([], [wire.id]);
                }}
                className="cursor-pointer"
              >
                <path d={d} fill="none" stroke="transparent" strokeWidth={14} />
                <path
                  d={d}
                  fill="none"
                  stroke={isSel ? '#00BFFF' : hasFlow ? '#2563eb' : '#64748b'}
                  strokeWidth={isSel ? 3.5 : 2.5}
                  strokeLinejoin="round"
                />
                {hasFlow && (
                  <path
                    d={d}
                    fill="none"
                    stroke="#00BFFF"
                    strokeWidth={2.5}
                    strokeDasharray="6 8"
                    strokeLinejoin="round"
                    className="lab-wire-animated pointer-events-none"
                    style={{
                      animationDuration: `${Math.max(0.25, Math.min(1.5, 0.8 / Math.max(0.05, wireCurrent))).toFixed(2)}s`,
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Pending Wire Preview */}
          {pendingWire && (
            <path
              d={buildOrthogonalPath(
                pendingWire.x,
                pendingWire.y,
                snapEnabled ? snapToGrid(pointerWorld.x) : pointerWorld.x,
                snapEnabled ? snapToGrid(pointerWorld.y) : pointerWorld.y
              )}
              fill="none"
              stroke="#00BFFF"
              strokeWidth={2.2}
              strokeDasharray="5 5"
              className="pointer-events-none"
            />
          )}

          {/* Components */}
          {components.map((comp) => {
            const isSel = selectedCompIds.includes(comp.id);
            const pins = getComponentPins(comp);
            const simState = simResult?.componentStates[comp.id];
            const isInteractive =
              comp.type === 'switch' ||
              comp.type === 'push-button' ||
              comp.type === 'circuit-breaker';

            return (
              <g
                key={comp.id}
                data-testid={`lab-comp-${comp.id}`}
                transform={`translate(${comp.x}, ${comp.y})`}
                onPointerDown={(e) => handleComponentPointerDown(e, comp)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (isInteractive) onToggleInteractive(comp.id);
                }}
                className="cursor-move"
              >
                {isSel && (
                  <rect
                    x={-58}
                    y={-48}
                    width={116}
                    height={96}
                    rx={10}
                    fill="#00BFFF12"
                    stroke="#00BFFF"
                    strokeWidth={1.4}
                    strokeDasharray="4 4"
                    className="pointer-events-none"
                  />
                )}

                <LabComponentSvg
                  comp={comp}
                  simState={simState}
                  isRunning={isRunning}
                  isSelected={isSel}
                />

                {/* Pins */}
                {pins.map((pin) => {
                  const localPos = getPinWorldPosition(
                    { ...comp, x: 0, y: 0 },
                    pin
                  );
                  const worldPos = getPinWorldPosition(comp, pin);
                  const isPendingStart =
                    pendingWire?.fromCompId === comp.id &&
                    pendingWire.fromPinId === pin.id;

                  return (
                    <g
                      key={pin.id}
                      transform={`translate(${localPos.x}, ${localPos.y})`}
                      onClick={(e) =>
                        handlePinClick(e, comp, pin.id, worldPos.x, worldPos.y)
                      }
                      className="cursor-crosshair"
                    >
                      <circle cx={0} cy={0} r={11} fill="transparent" />
                      <circle
                        cx={0}
                        cy={0}
                        r={isPendingStart ? 6 : 4.5}
                        fill={isPendingStart ? '#00BFFF' : '#2563eb'}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                      <text
                        x={Math.abs(localPos.y) > Math.abs(localPos.x) ? -11 : 0}
                        y={Math.abs(localPos.y) > Math.abs(localPos.x) ? 3 : -9}
                        textAnchor={Math.abs(localPos.y) > Math.abs(localPos.x) ? 'end' : 'middle'}
                        fontSize={9}
                        fontWeight={700}
                        className="fill-slate-600 dark:fill-slate-300 pointer-events-none"
                      >
                        {pin.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Marquee Selection Box */}
          {marquee && (
            <rect
              x={Math.min(marquee.x0, marquee.x1)}
              y={Math.min(marquee.y0, marquee.y1)}
              width={Math.abs(marquee.x1 - marquee.x0)}
              height={Math.abs(marquee.y1 - marquee.y0)}
              fill="#2563eb22"
              stroke="#2563eb"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          )}
        </g>
      </svg>
    </div>
  );
};
