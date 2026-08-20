import React from 'react';
import { ScratchBlockDef } from '../types';
import { CATEGORY_COLORS } from '../data/scratchBlocks';
import { Trash2 } from 'lucide-react';

interface ScratchBlockProps {
  block: ScratchBlockDef;
  onRemove?: (id: string) => void;
  isCompact?: boolean;
  showRemoveBtn?: boolean;
}

export const ScratchBlock: React.FC<ScratchBlockProps> = ({
  block,
  onRemove,
  isCompact = false,
  showRemoveBtn = false,
}) => {
  const cat = CATEGORY_COLORS[block.category] || CATEGORY_COLORS.motion;

  // Render C-Block (e.g. "por siempre", "si ... entonces", "repetir")
  if (block.shape === 'c-block') {
    return (
      <div className="flex flex-col items-start select-none my-1 font-sans text-xs sm:text-sm">
        {/* Top bar of C block */}
        <div
          className={`flex items-center justify-between px-3 py-1.5 rounded-t-md ${cat.bg} ${cat.text} shadow-sm border-t border-l border-r ${cat.border} min-w-[180px] max-w-full`}
        >
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-white/30" />
            <span>{block.label}</span>
          </div>
          {showRemoveBtn && onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(block.id);
              }}
              title="Eliminar bloque"
              className="ml-2 p-1 hover:bg-black/20 rounded transition-colors text-white/90 hover:text-white"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Inner spine & children */}
        <div className={`flex items-stretch pl-4 border-l-8 ${cat.border} w-full`}>
          <div className="bg-slate-900/10 dark:bg-black/20 w-full p-1.5 min-h-[32px] rounded-r border-t border-b border-r border-dashed border-slate-300 dark:border-slate-700/50 flex flex-col gap-1">
            {block.children && block.children.length > 0 ? (
              block.children.map((child) => (
                <ScratchBlock
                  key={child.id}
                  block={child}
                  onRemove={onRemove}
                  isCompact={isCompact}
                  showRemoveBtn={showRemoveBtn}
                />
              ))
            ) : (
              <div className="text-[11px] italic text-slate-500 dark:text-slate-400 py-1 px-2">
                (Arrastra o añade bloques dentro de este bucle)
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar of C block */}
        <div
          className={`h-4 w-16 rounded-b-md ${cat.bg} border-b border-l border-r ${cat.border}`}
        />
      </div>
    );
  }

  // Render Hat Block (curved top)
  if (block.shape === 'hat') {
    return (
      <div className="flex flex-col items-start select-none my-1 font-sans text-xs sm:text-sm">
        {/* Hat curve */}
        <div
          className={`w-24 h-2.5 rounded-t-full ${cat.bg} border-t border-l border-r ${cat.border}`}
        />
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-r-md rounded-bl-md ${cat.bg} ${cat.text} shadow-sm border ${cat.border} min-w-[170px] max-w-full`}
        >
          <div className="flex items-center gap-1.5 font-semibold">
            <span>{block.label}</span>
          </div>
          {showRemoveBtn && onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(block.id);
              }}
              title="Eliminar bloque"
              className="ml-2 p-1 hover:bg-black/20 rounded transition-colors text-amber-950/80 hover:text-amber-950"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render Boolean Reporter (hexagonal look)
  if (block.shape === 'boolean') {
    return (
      <div
        className={`inline-flex items-center px-2.5 py-1 rounded-full ${cat.bg} ${cat.text} border ${cat.border} text-xs font-semibold shadow-xs select-none`}
      >
        <span>{block.label}</span>
      </div>
    );
  }

  // Standard Stack Block
  return (
    <div
      className={`group relative flex items-center justify-between px-3 py-1.5 rounded-md ${cat.bg} ${cat.text} shadow-xs border ${cat.border} my-1 min-w-[150px] max-w-full text-xs sm:text-sm font-semibold select-none transition-all hover:brightness-105`}
    >
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
        <span>{block.label}</span>
      </div>
      {showRemoveBtn && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(block.id);
          }}
          title="Eliminar bloque"
          className="ml-2 p-0.5 opacity-80 group-hover:opacity-100 hover:bg-black/20 rounded transition-opacity"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
