import React, { useState, useEffect, useMemo } from 'react';
import { ProjectState } from './types';
import { analyzeProjectState } from './utils/analyzer';
import { PRESET_SCENARIOS } from './data/presets';
import { Header } from './components/Header';
import { ProjectInspector } from './components/ProjectInspector';
import { ChatPanel } from './components/ChatPanel';

export default function App() {
  // Initialize with the classic "Missing Forever Loop" preset scenario
  const defaultPreset = PRESET_SCENARIOS[0];

  const [projectState, setProjectState] = useState<ProjectState>(() => {
    const initialState: ProjectState = {
      activeSpriteId: 'sprite_1',
      sprites: [
        {
          id: 'sprite_1',
          name: defaultPreset.spriteName,
          avatar: defaultPreset.spriteAvatar,
          x: 0,
          y: 0,
          direction: 90,
          rotationStyle: 'all-around',
          costume: 'disfraz1',
          blocks: JSON.parse(JSON.stringify(defaultPreset.blocks)),
        },
      ],
      variables: JSON.parse(JSON.stringify(defaultPreset.variables)),
      detectedIssues: [],
    };
    initialState.detectedIssues = analyzeProjectState(initialState);
    return initialState;
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [analysisTriggerCounter, setAnalysisTriggerCounter] = useState(0);

  // Recalculate detected issues whenever sprites, blocks, or variables change
  useEffect(() => {
    const issues = analyzeProjectState(projectState);
    setProjectState((prev) => {
      // Avoid unnecessary state updates if issues are identical
      const prevIds = prev.detectedIssues.map((i) => i.id).join(',');
      const nextIds = issues.map((i) => i.id).join(',');
      if (prevIds === nextIds) return prev;
      return {
        ...prev,
        detectedIssues: issues,
      };
    });
  }, [projectState.sprites, projectState.variables, projectState.activeSpriteId]);

  const handleTriggerAnalysis = () => {
    setAnalysisTriggerCounter((c) => c + 1);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Header Bar */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* Main Two-Column Layout: Project Workspace & Socratic Chatbot */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Interactive Project State & Scratch Block Inspector */}
        <div className="w-full lg:w-[52%] xl:w-[50%] h-1/2 lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800">
          <ProjectInspector
            state={projectState}
            onUpdateState={setProjectState}
            onTriggerAnalysisInChat={handleTriggerAnalysis}
          />
        </div>

        {/* Right Side: Socratic Chatbot Panel */}
        <div className="w-full lg:w-[48%] xl:w-[50%] h-1/2 lg:h-full flex flex-col">
          <ChatPanel
            projectState={projectState}
            externalTriggerAnalysis={analysisTriggerCounter}
          />
        </div>
      </div>
    </div>
  );
}
