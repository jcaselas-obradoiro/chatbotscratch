import { PresetScenario } from '../types';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'preset_bug_no_forever',
    title: 'Error común: El sensor no detecta nada',
    category: 'errores',
    icon: '🐛',
    description: 'Tiene un bloque "si tocando..." pero fuera de un bucle "por siempre", por lo que solo comprueba 1 milisegundo al arrancar.',
    spriteName: 'Moneda Dorada',
    spriteAvatar: '🪙',
    initialNodeId: 'debug_analyzer',
    variables: [{ name: 'puntos', value: 0, initialValue: 0 }],
    blocks: [
      {
        id: 'flag_1',
        category: 'events',
        shape: 'hat',
        label: 'al presionar 🟢 bandera verde',
      },
      {
        id: 'if_1',
        category: 'control',
        shape: 'c-block',
        label: 'si <¿tocando [Gato Scratch ▼]?> entonces',
        children: [
          {
            id: 'add_1',
            category: 'variables',
            shape: 'stack',
            label: 'sumar a [puntos ▼] (1)',
          },
          {
            id: 'hide_1',
            category: 'looks',
            shape: 'stack',
            label: 'esconder',
          },
        ],
      },
    ],
  },
  {
    id: 'preset_bug_no_flag',
    title: 'Error común: Bloques sueltos sin inicio',
    category: 'errores',
    icon: '🧩',
    description: 'Hay bloques de movimiento y apariencia pero ningún bloque de sombrero amarillo para indicar cuándo empezar.',
    spriteName: 'Gato Scratch',
    spriteAvatar: '🐱',
    initialNodeId: 'debug_analyzer',
    variables: [{ name: 'vidas', value: 3, initialValue: 3 }],
    blocks: [
      {
        id: 'mov_loose_1',
        category: 'motion',
        shape: 'stack',
        label: 'mover (10) pasos',
      },
      {
        id: 'mov_loose_2',
        category: 'looks',
        shape: 'stack',
        label: 'siguiente disfraz',
      },
      {
        id: 'mov_loose_3',
        category: 'motion',
        shape: 'stack',
        label: 'si toca un borde, rebotar',
      },
    ],
  },
  {
    id: 'preset_bug_no_reset',
    title: 'Error común: Puntos no se reinician a 0',
    category: 'puntuacion',
    icon: '📊',
    description: 'El juego suma puntos correctamente, pero al volver a presionar la bandera verde la variable sigue con el valor anterior.',
    spriteName: 'Estrella Mágica',
    spriteAvatar: '⭐',
    initialNodeId: 'debug_variables_fix',
    variables: [{ name: 'puntos', value: 45, initialValue: 45 }],
    blocks: [
      {
        id: 'flag_star',
        category: 'events',
        shape: 'hat',
        label: 'al presionar 🟢 bandera verde',
      },
      {
        id: 'for_star',
        category: 'control',
        shape: 'c-block',
        label: 'por siempre',
        children: [
          {
            id: 'if_star',
            category: 'control',
            shape: 'c-block',
            label: 'si <¿tocando [Gato Scratch ▼]?> entonces',
            children: [
              {
                id: 'add_star',
                category: 'variables',
                shape: 'stack',
                label: 'sumar a [puntos ▼] (1)',
              },
              {
                id: 'wait_star',
                category: 'control',
                shape: 'stack',
                label: 'esperar (0.5) segundos',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'preset_bug_upside_down',
    title: 'Error común: Personaje boca abajo al rebotar',
    category: 'movimiento',
    icon: '🔄',
    description: 'El personaje se mueve y rebota en los bordes, pero se da la vuelta completamente y camina de cabeza.',
    spriteName: 'Murciélago Volador',
    spriteAvatar: '🦇',
    initialNodeId: 'debug_rotation_fix',
    variables: [],
    blocks: [
      {
        id: 'bat_flag',
        category: 'events',
        shape: 'hat',
        label: 'al presionar 🟢 bandera verde',
      },
      {
        id: 'bat_for',
        category: 'control',
        shape: 'c-block',
        label: 'por siempre',
        children: [
          {
            id: 'bat_move',
            category: 'motion',
            shape: 'stack',
            label: 'mover (8) pasos',
          },
          {
            id: 'bat_bounce',
            category: 'motion',
            shape: 'stack',
            label: 'si toca un borde, rebotar',
          },
        ],
      },
    ],
  },
  {
    id: 'preset_clean',
    title: 'Proyecto nuevo (Lienzo en blanco)',
    category: 'juego',
    icon: '✨',
    description: 'Un proyecto limpio con el Gato Scratch para construir tu propia secuencia de bloques desde cero.',
    spriteName: 'Gato Scratch',
    spriteAvatar: '🐱',
    initialNodeId: 'root',
    variables: [{ name: 'puntos', value: 0, initialValue: 0 }],
    blocks: [
      {
        id: 'clean_flag',
        category: 'events',
        shape: 'hat',
        label: 'al presionar 🟢 bandera verde',
      },
    ],
  },
];
