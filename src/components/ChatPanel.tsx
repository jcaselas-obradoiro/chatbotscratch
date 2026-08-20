import React, { useState, useEffect, useRef } from 'react';
import {
  ChatMessage,
  ProjectState,
  DecisionNode,
  DecisionOption,
  SocraticStep,
} from '../types';
import { DECISION_TREE } from '../data/decisionTree';
import { ScratchBlock } from './ScratchBlock';
import { playSound } from '../utils/soundEffects';
import {
  Bot,
  User,
  Sparkles,
  Search,
  RotateCcw,
  Send,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface ChatPanelProps {
  projectState: ProjectState;
  onNavigateTree?: (nodeId: string) => void;
  externalTriggerAnalysis?: number;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  projectState,
  externalTriggerAnalysis,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [revealedCluesMap, setRevealedCluesMap] = useState<Record<string, number>>({});
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSprite =
    projectState.sprites.find((s) => s.id === projectState.activeSpriteId) ||
    projectState.sprites[0];

  // Initialize with root node message
  useEffect(() => {
    const rootNode = DECISION_TREE['root'];
    const initialMsg: ChatMessage = {
      id: 'msg_root_init',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: rootNode.question,
      mascotMood: rootNode.mascotMood,
      interactiveOptions: rootNode.options,
    };
    setMessages([initialMsg]);
  }, []);

  // Respond to external analysis triggers (e.g. from the Inspector button)
  useEffect(() => {
    if (externalTriggerAnalysis && externalTriggerAnalysis > 0) {
      handleAnalyzeCurrentState();
    }
  }, [externalTriggerAnalysis]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, revealedCluesMap]);

  // Mascot expression icons
  const getMascotEmoji = (mood?: string) => {
    switch (mood) {
      case 'detective':
        return '🕵️‍♂️';
      case 'thinking':
        return '🤔';
      case 'celebrating':
        return '🎉';
      case 'explaining':
        return '🎓';
      case 'happy':
      default:
        return '🐱';
    }
  };

  // Perform automated state analysis & socratic guidance
  const handleAnalyzeCurrentState = () => {
    playSound('hint');
    const issues = projectState.detectedIssues;
    const blockCount = activeSprite?.blocks?.length || 0;
    const varNames = projectState.variables.map((v) => `${v.name}=${v.value}`);

    const userMsg: ChatMessage = {
      id: `user_ana_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `🔍 Por favor analiza el código de mi objeto "${activeSprite?.name || 'Objeto'}"`,
    };

    let botResponseText = '';
    let botMood: ChatMessage['mascotMood'] = 'detective';
    let socraticClues: SocraticStep[] = [];
    let options: DecisionOption[] = [];

    if (issues.length === 0) {
      botMood = 'happy';
      botResponseText = `¡Excelente! He analizado los **${blockCount} bloques** de **${activeSprite?.name}** y no he detectado ningún fallo común de estructura. La bandera de inicio y los bucles parecen correctos. ¿Qué nueva mecánica quieres aprender a programar?`;
      options = [
        {
          id: 'opt_add_movement',
          text: '🏃 Aprender mecánicas de movimiento',
          nextNodeId: 'movement_hub',
        },
        {
          id: 'opt_add_jump',
          text: '🦘 Programar salto o gravedad',
          nextNodeId: 'jump_gravity_hub',
        },
        {
          id: 'opt_add_score',
          text: '⭐ Puntuación y monedas',
          nextNodeId: 'score_lives_hub',
        },
      ];
    } else {
      const topIssue = issues[0];
      botMood = topIssue.severity === 'error' ? 'detective' : 'thinking';
      botResponseText = `🔎 **¡He detectado una pista importante en tu código!**\n\n📌 **${topIssue.title}**\n${topIssue.description}\n\n💡 *Pista socrática:* ${topIssue.socraticClue}`;

      socraticClues = [
        {
          level: 1,
          title: 'Pista 1: Revisa la categoría de color',
          hint: `Dirígete a la categoría de **${topIssue.suggestedCategory.toUpperCase()}** en la paleta izquierda.`,
          suggestedCategory: topIssue.suggestedCategory,
        },
        {
          level: 2,
          title: 'Pista 2: Bloque sugerido',
          hint: `Coloca el bloque "${topIssue.suggestedBlock}" en la posición adecuada de tu pila.`,
          suggestedCategory: topIssue.suggestedCategory,
        },
      ];

      options = [
        {
          id: 'opt_try_fix',
          text: '🛠️ Ya he colocado el bloque, ¿puedes volver a comprobar?',
          nextNodeId: 'debug_analyzer',
        },
        {
          id: 'opt_explain_more',
          text: '❓ ¿Por qué ocurre este error?',
          nextNodeId:
            topIssue.id === 'if_without_forever'
              ? 'debug_missing_forever'
              : topIssue.id === 'no_hat_block'
              ? 'debug_no_flag'
              : topIssue.id === 'var_not_reset'
              ? 'debug_variables_fix'
              : 'debug_analyzer',
        },
        {
          id: 'opt_main_menu',
          text: '🏠 Menú principal',
          nextNodeId: 'root',
        },
      ];
    }

    const botMsg: ChatMessage = {
      id: `bot_ana_${Date.now()}`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: botResponseText,
      mascotMood: botMood,
      capturedStateSnapshot: {
        spriteName: activeSprite?.name || 'Objeto',
        blockCount,
        variables: varNames,
        issueCount: issues.length,
      },
      clues: socraticClues.length > 0 ? socraticClues : undefined,
      interactiveOptions: options,
      isAnalysisReport: true,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  // Select an option from decision tree
  const handleSelectOption = (option: DecisionOption) => {
    playSound('click');
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: option.text,
    };

    const targetNode = DECISION_TREE[option.nextNodeId] || DECISION_TREE['root'];
    setCurrentNodeId(targetNode.id);

    const botMsg: ChatMessage = {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: targetNode.question,
      mascotMood: targetNode.mascotMood,
      clues: targetNode.clues,
      interactiveOptions: targetNode.options,
      blocks: targetNode.relatedBlocks,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  // Progressive clue revelation (Level 1 -> 2 -> 3)
  const handleRevealNextClue = (messageId: string, currentLevel: number) => {
    playSound('hint');
    setRevealedCluesMap((prev) => ({
      ...prev,
      [messageId]: currentLevel + 1,
    }));
  };

  // Keyword-based search / natural inquiry without external API
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const query = inputQuery.trim().toLowerCase();
    setInputQuery('');
    playSound('click');

    const userMsg: ChatMessage = {
      id: `user_q_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputQuery.trim(),
    };

    // Keyword matching into decision tree nodes
    let matchedNodeId = 'root';
    if (query.includes('analiz') || query.includes('error') || query.includes('fallo') || query.includes('no funciona') || query.includes('bug')) {
      matchedNodeId = 'debug_analyzer';
    } else if (query.includes('salt') || query.includes('gravedad') || query.includes('plataforma') || query.includes('caer')) {
      matchedNodeId = 'jump_gravity_hub';
    } else if (query.includes('mov') || query.includes('flecha') || query.includes('caminar') || query.includes('tecla') || query.includes('derecha') || query.includes('izquierda')) {
      matchedNodeId = 'movement_hub';
    } else if (query.includes('punto') || query.includes('score') || query.includes('moneda') || query.includes('estrella') || query.includes('vida') || query.includes('game over')) {
      matchedNodeId = 'score_lives_hub';
    } else if (query.includes('pared') || query.includes('laberinto') || query.includes('choc') || query.includes('colisi') || query.includes('enemigo')) {
      matchedNodeId = 'collision_hub';
    } else if (query.includes('mensaje') || query.includes('nivel') || query.includes('enviar') || query.includes('recibir')) {
      matchedNodeId = 'level_messages_hub';
    } else if (query.includes('color') || query.includes('categor') || query.includes('bloque') || query.includes('para qué')) {
      matchedNodeId = 'categories_guide';
    } else if (query.includes('boca abajo') || query.includes('gir') || query.includes('rotaci') || query.includes('rebot')) {
      matchedNodeId = 'debug_rotation_fix';
    } else if (query.includes('bandera') || query.includes('verde') || query.includes('inicio') || query.includes('empezar')) {
      matchedNodeId = 'debug_no_flag';
    } else if (query.includes('por siempre') || query.includes('bucle') || query.includes('repetir')) {
      matchedNodeId = 'debug_missing_forever';
    }

    const targetNode = DECISION_TREE[matchedNodeId] || DECISION_TREE['root'];
    setCurrentNodeId(targetNode.id);

    const botMsg: ChatMessage = {
      id: `bot_q_${Date.now()}`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Te entiendo, ¡vamos a investigar sobre eso! 🔍\n\n${targetNode.question}`,
      mascotMood: targetNode.mascotMood,
      clues: targetNode.clues,
      interactiveOptions: targetNode.options,
      blocks: targetNode.relatedBlocks,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  // Reset conversation
  const handleResetChat = () => {
    playSound('click');
    const rootNode = DECISION_TREE['root'];
    setCurrentNodeId('root');
    setRevealedCluesMap({});
    setMessages([
      {
        id: `msg_reset_${Date.now()}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: '¡Conversación reiniciada! 🐱 ¿En qué reto de Scratch quieres que te acompañe ahora?',
        mascotMood: 'happy',
        interactiveOptions: rootNode.options,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Live State Capture Pill Bar */}
      <div className="p-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <span className="text-amber-400 font-semibold">Objeto:</span>
            <span>{activeSprite?.avatar}</span>
            <span className="font-medium text-white">{activeSprite?.name}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <span className="text-blue-400 font-semibold">Bloques:</span>
            <span className="font-mono text-white">{activeSprite?.blocks.length || 0}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <span className="text-amber-500 font-semibold">Variables:</span>
            <span className="font-mono text-white">
              {projectState.variables.length === 0
                ? '0'
                : projectState.variables.map((v) => `${v.name}=${v.value}`).join(', ')}
            </span>
          </div>

          {projectState.detectedIssues.length > 0 ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-xs text-amber-300 font-semibold animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>{projectState.detectedIssues.length} alerta de lógica</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
              <CheckCircle className="w-3 h-3" />
              <span>Lógica limpia</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleAnalyzeCurrentState}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors"
            title="Analizar estado actual del proyecto"
          >
            <Search className="w-3 h-3" />
            <span>Escanear</span>
          </button>
          <button
            onClick={handleResetChat}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Reiniciar chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          const revealedClueCount = revealedCluesMap[msg.id] ?? 1;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0 shadow-sm">
                  {getMascotEmoji(msg.mascotMood)}
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 shadow-md ${
                  isBot
                    ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-xs'
                    : 'bg-indigo-600 text-white rounded-tr-xs'
                }`}
              >
                {/* Header for captured state badge if this is an analysis report */}
                {msg.capturedStateSnapshot && (
                  <div className="mb-3 p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs flex flex-wrap items-center gap-2 text-slate-300">
                    <span className="font-bold text-amber-400">📊 Estado Inspeccionado:</span>
                    <span>Objeto: {msg.capturedStateSnapshot.spriteName}</span>
                    <span>•</span>
                    <span>{msg.capturedStateSnapshot.blockCount} bloques</span>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">
                      {msg.capturedStateSnapshot.issueCount}{' '}
                      {msg.capturedStateSnapshot.issueCount === 1 ? 'aviso' : 'avisos'}
                    </span>
                  </div>
                )}

                {/* Message Body */}
                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {msg.text}
                </div>

                {/* Socratic Step-by-Step Hints Accordion */}
                {msg.clues && msg.clues.length > 0 && (
                  <div className="mt-3.5 space-y-2 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        Pistas Socráticas Paso a Paso
                      </span>
                      <span className="text-[11px] text-slate-400 lowercase font-normal">
                        (Pista {Math.min(revealedClueCount, msg.clues.length)} de {msg.clues.length}
                        )
                      </span>
                    </div>

                    {msg.clues.slice(0, revealedClueCount).map((clue, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/20 text-xs sm:text-sm text-slate-200 animate-in fade-in duration-200"
                      >
                        <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{clue.title}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{clue.hint}</p>

                        {/* Optional block suggestions attached to clue */}
                        {clue.suggestedBlocks && (
                          <div className="mt-2 pt-2 border-t border-slate-800">
                            <span className="text-[11px] text-slate-400 block mb-1">
                              Bloque sugerido:
                            </span>
                            <div className="space-y-1">
                              {clue.suggestedBlocks.map((b) => (
                                <ScratchBlock key={b.id} block={b} isCompact={true} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Button to unlock next clue */}
                    {revealedClueCount < msg.clues.length && (
                      <button
                        onClick={() => handleRevealNextClue(msg.id, revealedClueCount)}
                        className="w-full mt-1 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>💡 Necesito otra pista (Ver Pista {revealedClueCount + 1})</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Direct Blocks Display if provided */}
                {msg.blocks && msg.blocks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                      Estructura de bloques sugerida:
                    </span>
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                      {msg.blocks.map((b) => (
                        <ScratchBlock key={b.id} block={b} isCompact={true} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Decision Options / Chips */}
                {msg.interactiveOptions && msg.interactiveOptions.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                    {msg.interactiveOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-amber-400 transition-all hover:scale-105 active:scale-95 text-left shadow-xs cursor-pointer"
                      >
                        <span>{opt.text}</span>
                        {opt.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {opt.badge}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-2 text-[10px] text-slate-500 text-right">{msg.timestamp}</div>
              </div>

              {!isBot && (
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 shadow-sm">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Query Bar (Deterministic Natural Language Keyword Mapper) */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Pregúntale a GatiBot (ej: cómo saltar, las vidas, error en moneda, paredes)..."
              className="w-full bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 pr-9 focus:outline-hidden focus:border-amber-400 transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
              🐱
            </span>
          </div>

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all hover:scale-105 active:scale-95 shadow-sm shrink-0"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
          <span>🎯 Método socrático sin API (privado, seguro y educativo)</span>
          <span className="hidden sm:inline text-amber-400/80 font-medium">Primaria (6-12 años)</span>
        </div>
      </div>
    </div>
  );
};
