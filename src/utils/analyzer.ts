import { DetectedIssue, ProjectState, ScratchBlockDef } from '../types';

export function analyzeProjectState(state: ProjectState): DetectedIssue[] {
  const activeSprite = state.sprites.find((s) => s.id === state.activeSpriteId);
  if (!activeSprite) return [];

  const issues: DetectedIssue[] = [];
  const blocks = activeSprite.blocks;

  if (blocks.length === 0) {
    issues.push({
      id: 'empty_stack',
      severity: 'tip',
      title: '¡Tu objeto aún no tiene bloques!',
      description: 'Este personaje está esperando tus instrucciones para cobrar vida.',
      socraticClue: '¿Qué bloque de la categoría amarilla de Eventos usamos siempre para empezar a jugar al presionar la bandera?',
      suggestedCategory: 'events',
      suggestedBlock: 'al presionar bandera verde',
    });
    return issues;
  }

  // 1. Check for starting Hat block
  const hasHatBlock = blocks.some((b) => b.shape === 'hat');
  if (!hasHatBlock) {
    issues.push({
      id: 'no_hat_block',
      severity: 'error',
      title: 'Falta un bloque de inicio (sombrero)',
      description: 'Los bloques están sueltos y no saben en qué momento deben ejecutarse.',
      socraticClue: 'Fíjate en la parte superior. ¿Cómo sabrá Scratch cuándo arrancar el juego si no hay un bloque con forma redondeada arriba?',
      suggestedCategory: 'events',
      suggestedBlock: 'al presionar bandera verde',
    });
  }

  // Helper to recursively collect all blocks
  const allBlocksFlat: ScratchBlockDef[] = [];
  function collect(list: ScratchBlockDef[]) {
    for (const b of list) {
      allBlocksFlat.push(b);
      if (b.children && b.children.length > 0) {
        collect(b.children);
      }
    }
  }
  collect(blocks);

  const blockIds = allBlocksFlat.map((b) => b.id);

  // 2. Check for empty C-blocks (forever or if with no children)
  const emptyCBlock = allBlocksFlat.find(
    (b) => b.shape === 'c-block' && (!b.children || b.children.length === 0)
  );
  if (emptyCBlock) {
    issues.push({
      id: 'empty_c_block',
      severity: 'warning',
      title: `El bloque "${emptyCBlock.label}" está vacío por dentro`,
      description: 'Has colocado una estructura de control, pero no tiene ninguna acción en su interior.',
      socraticClue: '¿Qué acción quieres que ocurra repetidamente o cuando se cumpla la condición? Arrastra un bloque dentro de su "boca".',
      suggestedCategory: 'motion',
      suggestedBlock: 'mover (10) pasos',
    });
  }

  // 3. Classic Bug: "If" block placed directly under flag without "forever"
  const hasIfOutsideForever = blocks.some(
    (b) => b.id.startsWith('if') || b.label.toLowerCase().includes('si <')
  );
  const hasForever = blockIds.includes('forever');

  if (hasIfOutsideForever && !hasForever) {
    issues.push({
      id: 'if_without_forever',
      severity: 'error',
      title: '¿Tu sensor sólo comprueba una milésima de segundo?',
      description: 'El bloque "si... entonces" se ejecuta sólo una vez justo al pulsar la bandera verde y luego se apaga.',
      socraticClue: 'Para que el juego esté vigilando durante TODA la partida si tocas la moneda o el obstáculo, ¿qué bloque naranja de Control debe envolver al "si"?',
      suggestedCategory: 'control',
      suggestedBlock: 'por siempre',
    });
  }

  // 4. Check for variable initialization
  const hasPointsVar = state.variables.some((v) =>
    v.name.toLowerCase().includes('puntos') || v.name.toLowerCase().includes('score')
  );
  const hasChangeVariable = blockIds.includes('change_variable');
  const hasSetVariable = blockIds.includes('set_variable');

  if (hasPointsVar && hasChangeVariable && !hasSetVariable) {
    issues.push({
      id: 'var_not_reset',
      severity: 'warning',
      title: 'Los puntos no se reinician al empezar',
      description: 'Sumas puntos al jugar, pero cuando vuelves a pulsar la bandera verde sigues con la puntuación anterior.',
      socraticClue: '¿Dónde y con qué bloque naranja de Variables debemos fijar los puntos a 0 nada más presionar la bandera verde?',
      suggestedCategory: 'variables',
      suggestedBlock: 'fijar puntos a 0',
    });
  }

  // 5. Rotation style issue: Sprite goes upside down
  const hasTurnOrBounce =
    blockIds.includes('turn_right') || blockIds.includes('if_on_edge_bounce');
  const hasRotationStyle = blockIds.includes('set_rotation_style');

  if (hasTurnOrBounce && !hasRotationStyle) {
    issues.push({
      id: 'rotation_flip',
      severity: 'tip',
      title: 'Evitar que el personaje se ponga boca abajo',
      description: 'Al rebotar o cambiar de dirección, el personaje puede girar en 360° y quedar del revés.',
      socraticClue: 'En la categoría azul de Movimiento hay un bloque para que solo mire a izquierda o derecha. ¿Sabes cuál es?',
      suggestedCategory: 'motion',
      suggestedBlock: 'fijar estilo de rotación [izquierda-derecha]',
    });
  }

  // 6. Rapid Points Glitch (Touching without wait or hide)
  const touchingBlocks = allBlocksFlat.filter((b) => b.id.includes('touching') || b.id.includes('if_then'));
  if (touchingBlocks.length > 0 && hasChangeVariable && !blockIds.includes('wait_seconds') && !blockIds.includes('hide')) {
    issues.push({
      id: 'rapid_score_bug',
      severity: 'tip',
      title: '¡Cuidado con la suma infinita de puntos!',
      description: 'Si tocas un objeto y la variable suma puntos, puede sumar decenas de puntos en un solo segundo si no escondes el objeto o esperas un momento.',
      socraticClue: '¿Qué bloque de Apariencia o Control podemos añadir justo después de sumar puntos para que no se repita de golpe?',
      suggestedCategory: 'looks',
      suggestedBlock: 'esconder',
    });
  }

  return issues;
}
