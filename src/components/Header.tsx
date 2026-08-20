import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Info, ShieldCheck, Cpu } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({ soundEnabled, onToggleSound }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-md">
        {/* Brand & Mascot */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-sm flex items-center justify-center text-2xl select-none">
            🐱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                <span>ScratchBot</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  GatiBot
                </span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                🎒 Primaria
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Tutor Socrático de Programación con Captura de Estado
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) playSound('click');
            }}
            title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => setShowInfoModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Guía Pedagógica</span>
          </button>
        </div>
      </header>

      {/* Info / Pedagogical Guide Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl">
                  💡
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Guía Didáctica de ScratchBot
                  </h3>
                  <p className="text-xs text-slate-400">
                    Diseñado para el aprendizaje activo en Educación Primaria
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-white p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-96 overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                <Cpu className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-1">1. Captura de Estado en Tiempo Real</h4>
                  <p className="text-slate-400 text-xs">
                    El asistente inspecciona automáticamente el objeto activo, la pila de bloques colocados, las variables del proyecto y los errores típicos de lógica (falta de bucles <code>por siempre</code>, variables sin inicializar a 0, etc.).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-1">2. Método Socrático por Pistas</h4>
                  <p className="text-slate-400 text-xs">
                    No da la solución de golpe. Guía al alumno en 3 pasos: primero indica la categoría de color (Pista 1), luego sugiere la función del bloque (Pista 2) y finalmente muestra la estructura visual (Pista 3).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-1">3. Seguro y 100% Sin API</h4>
                  <p className="text-slate-400 text-xs">
                    Funciona mediante un árbol de decisiones determinista y analizador sintáctico en el navegador del alumno. No requiere claves de API, no tiene coste por mensaje y garantiza total privacidad para los estudiantes.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all"
              >
                ¡Entendido, a programar!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
