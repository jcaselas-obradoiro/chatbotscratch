import { BlockCategory, ScratchBlockDef } from '../types';

export const CATEGORY_COLORS: Record<
  BlockCategory,
  {
    bg: string;
    border: string;
    text: string;
    nameEs: string;
    badgeBg: string;
    iconColor: string;
  }
> = {
  events: {
    bg: 'bg-[#FFBF00]',
    border: 'border-[#E6AC00]',
    text: 'text-amber-950 font-bold',
    nameEs: 'Eventos',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    iconColor: '#FFBF00',
  },
  control: {
    bg: 'bg-[#FFAB19]',
    border: 'border-[#E59700]',
    text: 'text-amber-950 font-bold',
    nameEs: 'Control',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
    iconColor: '#FFAB19',
  },
  motion: {
    bg: 'bg-[#4C97FF]',
    border: 'border-[#3373CC]',
    text: 'text-white font-bold',
    nameEs: 'Movimiento',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
    iconColor: '#4C97FF',
  },
  looks: {
    bg: 'bg-[#9966FF]',
    border: 'border-[#774DCB]',
    text: 'text-white font-bold',
    nameEs: 'Apariencia',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
    iconColor: '#9966FF',
  },
  sound: {
    bg: 'bg-[#CF63CF]',
    border: 'border-[#BD42BD]',
    text: 'text-white font-bold',
    nameEs: 'Sonido',
    badgeBg: 'bg-pink-100 text-pink-900 border-pink-300',
    iconColor: '#CF63CF',
  },
  sensing: {
    bg: 'bg-[#5CB1D6]',
    border: 'border-[#2E8EB8]',
    text: 'text-white font-bold',
    nameEs: 'Sensores',
    badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    iconColor: '#5CB1D6',
  },
  operators: {
    bg: 'bg-[#59C059]',
    border: 'border-[#389438]',
    text: 'text-white font-bold',
    nameEs: 'Operadores',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    iconColor: '#59C059',
  },
  variables: {
    bg: 'bg-[#FF8C1A]',
    border: 'border-[#DB6E00]',
    text: 'text-white font-bold',
    nameEs: 'Variables',
    badgeBg: 'bg-amber-100 text-amber-950 border-amber-400',
    iconColor: '#FF8C1A',
  },
};

export const AVAILABLE_BLOCKS_PALETTE: ScratchBlockDef[] = [
  // Eventos
  {
    id: 'when_flag_clicked',
    category: 'events',
    shape: 'hat',
    label: 'al presionar 🟢 bandera verde',
  },
  {
    id: 'when_key_pressed',
    category: 'events',
    shape: 'hat',
    label: 'al presionar tecla [espacio ▼]',
  },
  {
    id: 'when_sprite_clicked',
    category: 'events',
    shape: 'hat',
    label: 'al hacer clic en este objeto',
  },
  {
    id: 'broadcast_message',
    category: 'events',
    shape: 'stack',
    label: 'enviar mensaje [mensaje1 ▼]',
  },
  {
    id: 'when_receive_message',
    category: 'events',
    shape: 'hat',
    label: 'al recibir [mensaje1 ▼]',
  },

  // Movimiento
  {
    id: 'move_steps',
    category: 'motion',
    shape: 'stack',
    label: 'mover (10) pasos',
    inputs: { steps: 10 },
  },
  {
    id: 'turn_right',
    category: 'motion',
    shape: 'stack',
    label: 'girar ↻ (15) grados',
  },
  {
    id: 'change_x',
    category: 'motion',
    shape: 'stack',
    label: 'sumar a x: (10)',
    inputs: { dx: 10 },
  },
  {
    id: 'change_y',
    category: 'motion',
    shape: 'stack',
    label: 'sumar a y: (10)',
    inputs: { dy: 10 },
  },
  {
    id: 'set_y',
    category: 'motion',
    shape: 'stack',
    label: 'fijar y a (0)',
  },
  {
    id: 'go_to_xy',
    category: 'motion',
    shape: 'stack',
    label: 'ir a x: (0) y: (0)',
  },
  {
    id: 'if_on_edge_bounce',
    category: 'motion',
    shape: 'stack',
    label: 'si toca un borde, rebotar',
  },
  {
    id: 'set_rotation_style',
    category: 'motion',
    shape: 'stack',
    label: 'fijar estilo de rotación [izquierda-derecha ▼]',
  },

  // Control
  {
    id: 'forever',
    category: 'control',
    shape: 'c-block',
    label: 'por siempre',
    children: [],
  },
  {
    id: 'repeat_n',
    category: 'control',
    shape: 'c-block',
    label: 'repetir (10) veces',
    inputs: { times: 10 },
    children: [],
  },
  {
    id: 'if_then',
    category: 'control',
    shape: 'c-block',
    label: 'si <¿tocando el suelo / borde?> entonces',
    children: [],
  },
  {
    id: 'if_else',
    category: 'control',
    shape: 'c-block',
    label: 'si <...> si no',
    children: [],
  },
  {
    id: 'wait_seconds',
    category: 'control',
    shape: 'stack',
    label: 'esperar (1) segundos',
    inputs: { sec: 1 },
  },
  {
    id: 'stop_all',
    category: 'control',
    shape: 'cap',
    label: 'detener [todos ▼]',
  },

  // Sensores
  {
    id: 'touching_mouse',
    category: 'sensing',
    shape: 'boolean',
    label: '¿tocando [puntero del ratón ▼]?',
  },
  {
    id: 'touching_color',
    category: 'sensing',
    shape: 'boolean',
    label: '¿tocando el color 🔴?',
  },
  {
    id: 'key_pressed_sensor',
    category: 'sensing',
    shape: 'boolean',
    label: '¿tecla [flecha derecha ▼] presionada?',
  },

  // Apariencia
  {
    id: 'say_hello',
    category: 'looks',
    shape: 'stack',
    label: 'decir [¡Hola!] por (2) segundos',
  },
  {
    id: 'next_costume',
    category: 'looks',
    shape: 'stack',
    label: 'siguiente disfraz',
  },
  {
    id: 'show',
    category: 'looks',
    shape: 'stack',
    label: 'mostrar',
  },
  {
    id: 'hide',
    category: 'looks',
    shape: 'stack',
    label: 'esconder',
  },

  // Variables
  {
    id: 'set_variable',
    category: 'variables',
    shape: 'stack',
    label: 'fijar [puntos ▼] a (0)',
  },
  {
    id: 'change_variable',
    category: 'variables',
    shape: 'stack',
    label: 'sumar a [puntos ▼] (1)',
  },
  {
    id: 'show_variable',
    category: 'variables',
    shape: 'stack',
    label: 'mostrar variable [puntos ▼]',
  },
];
