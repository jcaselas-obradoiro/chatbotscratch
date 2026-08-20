import React, { useState } from 'react';
import { ProjectState, ScratchBlockDef, BlockCategory } from '../types';
import { ScratchBlock } from './ScratchBlock';
import { AVAILABLE_BLOCKS_PALETTE, CATEGORY_COLORS } from '../data/scratchBlocks';
import { PRESET_SCENARIOS } from '../data/presets';
import {
  Plus,
  Trash2,
  FolderOpen,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Variable,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface ProjectInspectorProps {
  state: ProjectState;
  onUpdateState: (updater: (prev: ProjectState) => ProjectState) => void;
  onTriggerAnalysisInChat: () => void;
}

export const ProjectInspector: React.FC<ProjectInspectorProps> = ({
  state,
  onUpdateState,
  onTriggerAnalysisInChat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BlockCategory>('events');
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [newVarName, setNewVarName] = useState('');
  const [showAddVar, setShowAddVar] = useState(false);

  const activeSprite =
    state.sprites.find((s) => s.id === state.activeSpriteId) || state.sprites[0];

  // Add block to active sprite
  const handleAddBlock = (blockTemplate: ScratchBlockDef) => {
    playSound('click');
    const newBlock: ScratchBlockDef = {
      ...blockTemplate,
      id: `${blockTemplate.id}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      children: blockTemplate.children ? [] : undefined,
    };

    onUpdateState((prev) => ({
      ...prev,
      sprites: prev.sprites.map((s) => {
        if (s.id === prev.activeSpriteId) {
          // If previous block is a C-block and is empty, offer placing inside or at root
          return {
            ...s,
            blocks: [...s.blocks, newBlock],
          };
        }
        return s;
      }),
    }));
  };

  // Remove block by id
  const handleRemoveBlock = (blockId: string) => {
    playSound('click');
    onUpdateState((prev) => ({
      ...prev,
      sprites: prev.sprites.map((s) => {
        if (s.id === prev.activeSpriteId) {
          // Recursive removal
          function removeFromList(list: ScratchBlockDef[]): ScratchBlockDef[] {
            return list
              .filter((b) => b.id !== blockId)
              .map((b) => ({
                ...b,
                children: b.children ? removeFromList(b.children) : undefined,
              }));
          }
          return {
            ...s,
            blocks: removeFromList(s.blocks),
          };
        }
        return s;
      }),
    }));
  };

  // Clear all blocks for active sprite
  const handleClearBlocks = () => {
    playSound('click');
    onUpdateState((prev) => ({
      ...prev,
      sprites: prev.sprites.map((s) => (s.id === prev.activeSpriteId ? { ...s, blocks: [] } : s)),
    }));
  };

  // Load a preset scenario
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_SCENARIOS.find((p) => p.id === presetId);
    if (!preset) return;
    playSound('success');

    onUpdateState((prev) => ({
      ...prev,
      activeSpriteId: 'sprite_active',
      sprites: [
        {
          id: 'sprite_active',
          name: preset.spriteName,
          avatar: preset.spriteAvatar,
          x: 0,
          y: 0,
          direction: 90,
          rotationStyle: 'all-around',
          costume: 'disfraz1',
          blocks: JSON.parse(JSON.stringify(preset.blocks)),
        },
      ],
      variables: JSON.parse(JSON.stringify(preset.variables)),
    }));
    setShowPresetsModal(false);
  };

  // Add new variable
  const handleCreateVariable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarName.trim()) return;
    playSound('click');
    const cleanName = newVarName.trim().toLowerCase();
    onUpdateState((prev) => {
      if (prev.variables.some((v) => v.name.toLowerCase() === cleanName)) {
        return prev;
      }
      return {
        ...prev,
        variables: [...prev.variables, { name: cleanName, value: 0, initialValue: 0 }],
      };
    });
    setNewVarName('');
    setShowAddVar(false);
  };

  // Remove variable
  const handleRemoveVariable = (varName: string) => {
    playSound('click');
    onUpdateState((prev) => ({
      ...prev,
      variables: prev.variables.filter((v) => v.name !== varName),
    }));
  };

  const filteredPaletteBlocks = AVAILABLE_BLOCKS_PALETTE.filter(
    (b) => b.category === selectedCategory
  );

  const categories: BlockCategory[] = [
    'events',
    'control',
    'motion',
    'looks',
    'sensing',
    'variables',
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-100 overflow-hidden">
      {/* Header Inspector */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
            {activeSprite?.avatar || '🐱'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Objeto Activo
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {activeSprite?.blocks.length || 0} bloques
              </span>
            </div>
            <h2 className="text-sm font-semibold truncate text-white">
              {activeSprite?.name || 'Objeto'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowPresetsModal(true)}
            title="Cargar reto o error común"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ejemplos y Retos</span>
          </button>

          <button
            onClick={onTriggerAnalysisInChat}
            title="Enviar estado actual al chatbot"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>Consultar a GatiBot</span>
          </button>
        </div>
      </div>

      {/* Main Workspace split into Script Stack & Block Palette */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left column: Palette drawer */}
        <div className="w-full md:w-60 bg-slate-950/40 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              Paleta de Bloques
            </span>
            <span className="text-[10px] text-slate-500">(Clic para añadir)</span>
          </div>

          {/* Category tabs */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible p-1.5 gap-1 border-b border-slate-800 bg-slate-950/60 scrollbar-thin">
            {categories.map((cat) => {
              const meta = CATEGORY_COLORS[cat];
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    playSound('click');
                  }}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-white shadow-xs border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: meta.iconColor }}
                  />
                  <span>{meta.nameEs}</span>
                </button>
              );
            })}
          </div>

          {/* Blocks in selected category */}
          <div className="flex-1 p-2 overflow-y-auto space-y-1.5 max-h-48 md:max-h-none scrollbar-thin">
            {filteredPaletteBlocks.map((blk) => (
              <div
                key={blk.id}
                onClick={() => handleAddBlock(blk)}
                className="cursor-pointer transform transition-transform hover:scale-[1.02] active:scale-[0.98]"
                title="Haz clic para añadir este bloque al objeto"
              >
                <ScratchBlock block={blk} isCompact={true} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Current Project Script Stack */}
        <div className="flex-1 flex flex-col bg-slate-900/90 overflow-hidden">
          {/* Top Bar for Variables & Controls */}
          <div className="p-2.5 bg-slate-950/30 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Variable className="w-3.5 h-3.5 text-amber-400" />
                Variables del Proyecto:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {state.variables.length === 0 ? (
                  <span className="text-[11px] text-slate-500 italic">Ninguna</span>
                ) : (
                  state.variables.map((v) => (
                    <span
                      key={v.name}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium"
                    >
                      <span>
                        {v.name} = {v.value}
                      </span>
                      <button
                        onClick={() => handleRemoveVariable(v.name)}
                        className="hover:text-amber-100 p-0.5"
                        title="Eliminar variable"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
                {showAddVar ? (
                  <form onSubmit={handleCreateVariable} className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={newVarName}
                      onChange={(e) => setNewVarName(e.target.value)}
                      placeholder="nombre (puntos, vidas...)"
                      className="text-xs bg-slate-800 border border-slate-700 text-white rounded px-2 py-0.5 focus:outline-hidden focus:border-amber-400 w-32"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="text-xs px-2 py-0.5 bg-amber-500 text-slate-950 rounded font-semibold hover:bg-amber-400"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddVar(false)}
                      className="text-xs px-1.5 py-0.5 text-slate-400 hover:text-slate-200"
                    >
                      ✕
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowAddVar(true)}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Crear variable</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearBlocks}
                disabled={activeSprite?.blocks.length === 0}
                className="text-[11px] px-2 py-1 rounded bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-300 disabled:opacity-40 transition-colors flex items-center gap-1"
                title="Eliminar todos los bloques del objeto"
              >
                <Trash2 className="w-3 h-3" />
                <span>Vaciar objeto</span>
              </button>
            </div>
          </div>

          {/* Block Canvas Viewer */}
          <div className="flex-1 p-4 overflow-y-auto bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] scrollbar-thin">
            {activeSprite?.blocks && activeSprite.blocks.length > 0 ? (
              <div className="flex flex-col items-start gap-0.5 max-w-xl mx-auto bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                <div className="w-full pb-2 mb-2 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>{activeSprite.avatar}</span>
                    <span>Código de "{activeSprite.name}"</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Arrastrado en el lienzo de Scratch
                  </span>
                </div>
                {activeSprite.blocks.map((blk) => (
                  <ScratchBlock
                    key={blk.id}
                    block={blk}
                    onRemove={handleRemoveBlock}
                    showRemoveBtn={true}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-2xl mb-3">
                  🐱
                </div>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">
                  Tu objeto no tiene bloques todavía
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Haz clic en cualquier bloque de la paleta izquierda para añadirlo, o carga un
                  ejemplo desde el botón "Ejemplos y Retos".
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddBlock(AVAILABLE_BLOCKS_PALETTE[0])}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg shadow-sm transition-all"
                  >
                    + Añadir Bandera Verde
                  </button>
                  <button
                    onClick={() => setShowPresetsModal(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-all"
                  >
                    Cargar Reto
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Diagnostic Status Bar at Bottom */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {state.detectedIssues.length > 0 ? (
                <div className="flex items-center gap-1.5 text-amber-400 font-medium bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    {state.detectedIssues.length}{' '}
                    {state.detectedIssues.length === 1 ? 'aviso / pista' : 'avisos / pistas'}{' '}
                    detectados en tu lógica
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sin errores de sintaxis evidentes</span>
                </div>
              )}
            </div>

            <button
              onClick={onTriggerAnalysisInChat}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold hover:underline"
            >
              <span>Ver diagnóstico en el chat</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Presets Modal */}
      {showPresetsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-lg">
                  🎯
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Retos y Errores Comunes de Scratch
                  </h3>
                  <p className="text-xs text-slate-400">
                    Carga un caso típico de clase para ver cómo GatiBot lo detecta
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPresetsModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1">
              {PRESET_SCENARIOS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset.id)}
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 cursor-pointer transition-all flex items-start gap-3 group"
                >
                  <span className="text-2xl p-1 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform">
                    {preset.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {preset.title}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                        {preset.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowPresetsModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
