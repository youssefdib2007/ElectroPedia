import React, { useMemo, useState } from 'react';
import { BookOpen, Plus, Search } from 'lucide-react';
import {
  LAB_CATEGORIES,
  LAB_COMPONENT_CATALOG,
} from '../../data/labCatalog';
import type {
  LabComponentCategory,
  LabComponentType,
  Locale,
} from '../../types/electronics';

interface LabComponentPaletteProps {
  locale: Locale;
  title: string;
  searchPlaceholder: string;
  allLabel: string;
  onAddComponent: (type: LabComponentType) => void;
  onOpenEncyclopedia?: (componentId: string) => void;
}

export const LabComponentPalette: React.FC<LabComponentPaletteProps> = ({
  locale,
  title,
  searchPlaceholder,
  allLabel,
  onAddComponent,
  onOpenEncyclopedia,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<LabComponentCategory | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LAB_COMPONENT_CATALOG.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.name.ar.toLowerCase().includes(q) ||
        item.name.en.toLowerCase().includes(q) ||
        item.name.fr.toLowerCase().includes(q)
      );
    });
  }, [category, query]);

  return (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {filtered.length}
          </span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute top-2.5 start-2.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 ps-8 pe-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
              category === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {allLabel}
          </button>
          {LAB_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                category === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label[locale]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 max-h-[300px] lg:max-h-[540px] overflow-y-auto p-2 space-y-1.5">
        {filtered.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/x-electropedia-lab', item.type);
              e.dataTransfer.effectAllowed = 'copy';
            }}
            className="group flex items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 px-2.5 py-2 hover:border-blue-500/60 hover:bg-blue-50/40 dark:hover:bg-slate-800 transition cursor-grab active:cursor-grabbing"
          >
            <button
              type="button"
              onClick={() => onAddComponent(item.type)}
              className="flex-1 min-w-0 text-start flex items-center gap-2.5"
            >
              <span className="shrink-0 w-10 h-8 rounded-md bg-blue-600/10 dark:bg-sky-500/15 text-blue-700 dark:text-sky-400 font-mono text-[11px] font-bold flex items-center justify-center">
                {item.code}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {item.name[locale]}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {item.description[locale]}
                </div>
              </div>
            </button>

            <div className="flex items-center gap-1 shrink-0">
              {item.encyclopediaId && onOpenEncyclopedia && (
                <button
                  type="button"
                  title="Encyclopedia"
                  onClick={() => onOpenEncyclopedia(item.encyclopediaId!)}
                  className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-sky-400"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                aria-label={`Add ${item.name[locale]}`}
                onClick={() => onAddComponent(item.type)}
                className="p-1 rounded bg-blue-600/10 text-blue-600 dark:text-sky-400 hover:bg-blue-600 hover:text-white transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
