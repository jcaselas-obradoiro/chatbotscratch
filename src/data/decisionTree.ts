import { DecisionNode } from '../types';

export const DECISION_TREE: Record<string, DecisionNode> = {
  root: {
    id: 'root',
    question: '¡Hola! Soy GatiBot 🐱, tu ayudante para programar en Scratch. ¿En qué puedo guiarte hoy?',
    mascotMood: 'happy',
    options: [
      {
        id: 'opt_analyze',
        text: '🔍 Analizar mi código actual (buscar fallos)',
        icon: 'Search',
        nextNodeId: 'debug_analyzer',
        badge: 'Recomendado',
      },
      {
        id: 'opt_movement',
        text: '🏃 ¿Cómo muevo a mi personaje?',
        icon: 'Move',
        nextNodeId: 'movement_hub',
      },
      {
        id: 'opt_jump',
        text: '🦘 ¿Cómo hago un salto o gravedad?',
        icon: 'ArrowUpCircle',
        nextNodeId: 'jump_gravity_hub',
      },
      {
        id: 'opt_score',
        text: '⭐ Puntuación, vidas y monedas',
        icon: 'Award',
        nextNodeId: 'score_lives_hub',
      },
      {
        id: 'opt_collision',
        text: '🧱 Colisiones (paredes, laberintos, enemigos)',
        icon: 'ShieldAlert',
        nextNodeId: 'collision_hub',
      },
      {
        id: 'opt_messages',
        text: '✉️ Enviar mensajes y cambiar de nivel',
        icon: 'Mail',
        nextNodeId: 'level_messages_hub',
      },
      {
        id: 'opt_categories',
        text: '🎨 ¿Para qué sirve cada color de bloque?',
        icon: 'Palette',
        nextNodeId: 'categories_guide',
      },
    ],
  },

  // --- ANALIZADOR DE ESTADO EN VIVO ---
  debug_analyzer: {
    id: 'debug_analyzer',
    question: 'He echado un vistazo al objeto que tienes seleccionado y a tus bloques. ¿Qué problema estás experimentando?',
    mascotMood: 'detective',
    autoAnalyze: true,
    options: [
      {
        id: 'opt_not_working',
        text: 'Pulso la bandera verde pero no hace nada',
        nextNodeId: 'debug_no_flag',
      },
      {
        id: 'opt_only_once',
        text: 'Solo funciona 1 segundo y luego se para',
        nextNodeId: 'debug_missing_forever',
      },
      {
        id: 'opt_wrong_points',
        text: 'La puntuación no se reinicia o suma números raros',
        nextNodeId: 'debug_variables_fix',
      },
      {
        id: 'opt_upside_down',
        text: 'Mi personaje se pone cabeza abajo al girar',
        nextNodeId: 'debug_rotation_fix',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Volver al menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  debug_no_flag: {
    id: 'debug_no_flag',
    question: '¡Pensemos como detectives de código! 🕵️\nPara que un objeto sepa CUÁNDO debe empezar a moverse, necesita una orden inicial.',
    mascotMood: 'thinking',
    clues: [
      {
        level: 1,
        title: 'Pista 1: El color del inicio',
        hint: 'Los bloques que inician programas son de color amarillo (Eventos) y tienen la parte superior curva como un sombrero.',
        suggestedCategory: 'events',
      },
      {
        level: 2,
        title: 'Pista 2: El bloque clave',
        hint: 'Busca el bloque "al presionar bandera verde" y colócalo arriba del todo de tu columna de bloques.',
        suggestedCategory: 'events',
        suggestedBlocks: [
          {
            id: 'hint_flag',
            category: 'events',
            shape: 'hat',
            label: 'al presionar 🟢 bandera verde',
          },
        ],
      },
      {
        level: 3,
        title: 'Pista 3: ¿Cómo queda conectado?',
        hint: '¡Fíjate que encaje como una pieza de puzzle! Todos los demás bloques deben ir debajo de la bandera.',
        suggestedCategory: 'events',
      },
    ],
    options: [
      {
        id: 'opt_solved_flag',
        text: '¡Genial, ya le he puesto la bandera verde!',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_still_stuck',
        text: 'Sigue sin moverse, ¿qué más puede ser?',
        nextNodeId: 'debug_missing_forever',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  debug_missing_forever: {
    id: 'debug_missing_forever',
    question: '¡Este es el misterio más común en Scratch! 🔍\nEl ordenador lee el código tan rápido (en 1 milésima de segundo) que si comprueba el "si" una sola vez, se apaga de inmediato.',
    mascotMood: 'explaining',
    clues: [
      {
        level: 1,
        title: 'Pista 1: El bucle infinito',
        hint: 'Para que el ordenador vigile durante TODO el juego si tocas una tecla o un objeto, necesitamos que lo repita sin parar.',
        suggestedCategory: 'control',
      },
      {
        level: 2,
        title: 'Pista 2: El bloque envoltorio',
        hint: 'Ve a la categoría naranja de Control y busca el bloque "por siempre" con forma de letra C.',
        suggestedCategory: 'control',
        suggestedBlocks: [
          {
            id: 'hint_forever',
            category: 'control',
            shape: 'c-block',
            label: 'por siempre',
            children: [
              {
                id: 'hint_if',
                category: 'control',
                shape: 'c-block',
                label: 'si <...> entonces',
                children: [],
              },
            ],
          },
        ],
      },
      {
        level: 3,
        title: 'Pista 3: La estructura correcta',
        hint: 'Mete el bloque "si ... entonces" DENTRO de la boca del "por siempre". Así estará vigilando constantemente.',
        suggestedCategory: 'control',
      },
    ],
    options: [
      {
        id: 'opt_solved_forever',
        text: '¡Funciona! Ahora ya vigila todo el tiempo',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_more_help',
        text: '¿Cómo hago para moverlo con teclas?',
        nextNodeId: 'movement_keys',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  debug_variables_fix: {
    id: 'debug_variables_fix',
    question: '¡Las variables son como cajitas donde guardamos números! 📦\nHay una gran diferencia entre "fijar" (dar un valor) y "sumar" (cambiar por).',
    mascotMood: 'thinking',
    clues: [
      {
        level: 1,
        title: 'Pista 1: Inicializar al inicio',
        hint: 'Nada más presionar la bandera verde, debes poner los puntos a 0 usando el bloque "fijar puntos a 0".',
        suggestedCategory: 'variables',
      },
      {
        level: 2,
        title: 'Pista 2: Sumar cuando ocurra algo bueno',
        hint: 'Cuando toques la estrella o moneda, usa "sumar a puntos 1". ¡Cuidado de no usar fijar aquí!',
        suggestedCategory: 'variables',
        suggestedBlocks: [
          {
            id: 'hint_set',
            category: 'variables',
            shape: 'stack',
            label: 'fijar [puntos ▼] a (0)',
          },
          {
            id: 'hint_change',
            category: 'variables',
            shape: 'stack',
            label: 'sumar a [puntos ▼] (1)',
          },
        ],
      },
      {
        level: 3,
        title: 'Pista 3: Evitar puntos infinitos',
        hint: 'Si tocas la moneda, la moneda debe "esconderse" o "esperar 0.5 seg" para no sumar 50 puntos en un segundo.',
        suggestedCategory: 'looks',
      },
    ],
    options: [
      {
        id: 'opt_var_done',
        text: '¡Arreglado! Ya cuenta los puntos correctamente',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_var_more',
        text: '¿Cómo pongo un sistema de vidas?',
        nextNodeId: 'score_lives_hub',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  debug_rotation_fix: {
    id: 'debug_rotation_fix',
    question: '¡A veces el gato Scratch se vuelve gimnasta y se pone del revés! 🤸‍♂️\nEso pasa porque el estilo de rotación por defecto gira en 360 grados.',
    mascotMood: 'happy',
    clues: [
      {
        level: 1,
        title: 'Pista 1: Estilo de rotación',
        hint: 'En la categoría azul de Movimiento hay un bloque que le dice a Scratch: "Solo mira hacia la izquierda o hacia la derecha".',
        suggestedCategory: 'motion',
      },
      {
        level: 2,
        title: 'Pista 2: El bloque exacto',
        hint: 'Busca "fijar estilo de rotación [izquierda-derecha]" y colócalo debajo de la bandera verde.',
        suggestedCategory: 'motion',
        suggestedBlocks: [
          {
            id: 'hint_rot',
            category: 'motion',
            shape: 'stack',
            label: 'fijar estilo de rotación [izquierda-derecha ▼]',
          },
        ],
      },
    ],
    options: [
      {
        id: 'opt_rot_solved',
        text: '¡Listo, ya no se da la vuelta!',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  // --- MOVIMIENTO ---
  movement_hub: {
    id: 'movement_hub',
    question: '¡Vamos a darle vida a tu personaje! ¿Cómo quieres que sea su movimiento?',
    mascotMood: 'explaining',
    options: [
      {
        id: 'opt_m_keys',
        text: '🕹️ Con las flechas del teclado o teclas WASD',
        nextNodeId: 'movement_keys',
      },
      {
        id: 'opt_m_auto',
        text: '🔄 Movimiento automático (patrullar y rebotar)',
        nextNodeId: 'movement_auto',
      },
      {
        id: 'opt_m_mouse',
        text: '🖱️ Siguiendo el puntero del ratón',
        nextNodeId: 'movement_mouse',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  movement_keys: {
    id: 'movement_keys',
    question: 'Para mover con las teclas tenemos dos formas. ¿Cuál prefieres aprender?',
    mascotMood: 'thinking',
    clues: [
      {
        level: 1,
        title: 'Forma 1 (Para empezar): Con bloques de eventos amarillos',
        hint: 'Usa "al presionar tecla [flecha derecha]" y añade "sumar a x: 10". Para la izquierda, "sumar a x: -10".',
        suggestedCategory: 'events',
      },
      {
        level: 2,
        title: 'Forma 2 (Movimiento suave de videojuego pro): Con bucle por siempre y sensores',
        hint: 'Bandera verde ➔ Por siempre ➔ Si ¿tecla flecha derecha presionada? entonces ➔ sumar a x: 10.',
        suggestedCategory: 'sensing',
        suggestedBlocks: [
          {
            id: 'm_flag',
            category: 'events',
            shape: 'hat',
            label: 'al presionar 🟢 bandera verde',
          },
          {
            id: 'm_forever',
            category: 'control',
            shape: 'c-block',
            label: 'por siempre',
            children: [
              {
                id: 'm_if_right',
                category: 'control',
                shape: 'c-block',
                label: 'si <¿tecla [flecha derecha ▼] presionada?> entonces',
                children: [
                  {
                    id: 'm_change_x',
                    category: 'motion',
                    shape: 'stack',
                    label: 'sumar a x: (10)',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    options: [
      {
        id: 'opt_tested_keys',
        text: '¡Lo he probado y se mueve genial!',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_up_down',
        text: '¿Y para subir y bajar (eje Y)?',
        nextNodeId: 'movement_up_down',
      },
      {
        id: 'opt_back_mov',
        text: '⬅️ Volver a opciones de movimiento',
        nextNodeId: 'movement_hub',
      },
    ],
  },

  movement_up_down: {
    id: 'movement_up_down',
    question: '¡Recuerda los ejes de la pantalla! 📐\n• El eje **X** va de izquierda a derecha ↔️\n• El eje **Y** va de abajo hacia arriba ↕️',
    mascotMood: 'explaining',
    clues: [
      {
        level: 1,
        title: 'Pista para subir (Flecha Arriba)',
        hint: 'Usa el bloque "sumar a y: 10" (número positivo hace que suba).',
        suggestedCategory: 'motion',
      },
      {
        level: 2,
        title: 'Pista para bajar (Flecha Abajo)',
        hint: 'Usa el bloque "sumar a y: -10" (el signo menos hace que baje hacia el suelo).',
        suggestedCategory: 'motion',
        suggestedBlocks: [
          {
            id: 'm_up',
            category: 'motion',
            shape: 'stack',
            label: 'sumar a y: (10)',
          },
          {
            id: 'm_down',
            category: 'motion',
            shape: 'stack',
            label: 'sumar a y: (-10)',
          },
        ],
      },
    ],
    options: [
      {
        id: 'opt_up_down_done',
        text: '¡Entendido, ya se mueve en 4 direcciones!',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  movement_auto: {
    id: 'movement_auto',
    question: '¿Quieres que un enemigo o personaje patrulle de un lado a otro rebotando en las paredes?',
    mascotMood: 'explaining',
    clues: [
      {
        level: 1,
        title: 'Pista 1: Tres bloques mágicos',
        hint: 'Necesitas bandera verde, un bucle "por siempre", y dentro: "mover 10 pasos" y "si toca un borde, rebotar".',
        suggestedCategory: 'motion',
      },
      {
        level: 2,
        title: 'Pista 2: Evitar que quede boca abajo',
        hint: 'Añade al inicio "fijar estilo de rotación [izquierda-derecha]" para que camine derecho.',
        suggestedCategory: 'motion',
        suggestedBlocks: [
          {
            id: 'auto_flag',
            category: 'events',
            shape: 'hat',
            label: 'al presionar 🟢 bandera verde',
          },
          {
            id: 'auto_rot',
            category: 'motion',
            shape: 'stack',
            label: 'fijar estilo de rotación [izquierda-derecha ▼]',
          },
          {
            id: 'auto_for',
            category: 'control',
            shape: 'c-block',
            label: 'por siempre',
            children: [
              {
                id: 'auto_step',
                category: 'motion',
                shape: 'stack',
                label: 'mover (6) pasos',
              },
              {
                id: 'auto_bounce',
                category: 'motion',
                shape: 'stack',
                label: 'si toca un borde, rebotar',
              },
            ],
          },
        ],
      },
    ],
    options: [
      {
        id: 'opt_auto_ok',
        text: '¡Ya patrulla mi enemigo!',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  movement_mouse: {
    id: 'movement_mouse',
    question: '¿Quieres que el personaje siga al ratón como una mira o una linterna?',
    mascotMood: 'happy',
    clues: [
      {
        level: 1,
        title: 'Pista: El sensor del puntero',
        hint: 'Bandera verde ➔ Por siempre ➔ En Movimiento busca "ir a [puntero del ratón]".',
        suggestedCategory: 'motion',
      },
    ],
    options: [
      {
        id: 'opt_mouse_ok',
        text: '¡Funciona de maravilla!',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  // --- SALTO Y GRAVEDAD ---
  jump_gravity_hub: {
    id: 'jump_gravity_hub',
    question: '¡Hacer saltar al personaje es uno de los mejores momentos al crear un juego! 🦘 ¿Qué nivel de salto quieres programar?',
    mascotMood: 'thinking',
    options: [
      {
        id: 'opt_jump_simple',
        text: '🟢 Salto sencillo (ideal para empezar)',
        nextNodeId: 'jump_simple',
      },
      {
        id: 'opt_jump_physics',
        text: '🟣 Salto realista con gravedad (juego de plataformas)',
        nextNodeId: 'jump_gravity_physics',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  jump_simple: {
    id: 'jump_simple',
    question: 'Un salto sencillo se divide en dos fases:\n1️⃣ El personaje sube varios pasos.\n2️⃣ El personaje baja el mismo número de pasos.',
    mascotMood: 'explaining',
    clues: [
      {
        level: 1,
        title: 'Pista 1: El bucle repetir',
        hint: 'Usa "al presionar tecla [espacio]". Luego pon un bloque "repetir 10 veces" con "sumar a y: 10".',
        suggestedCategory: 'control',
      },
      {
        level: 2,
        title: 'Pista 2: La caída',
        hint: 'Justo debajo, pon otro "repetir 10 veces" pero con "sumar a y: -10" para volver al suelo.',
        suggestedCategory: 'motion',
        suggestedBlocks: [
          {
            id: 'j_key',
            category: 'events',
            shape: 'hat',
            label: 'al presionar tecla [espacio ▼]',
          },
          {
            id: 'j_up_rep',
            category: 'control',
            shape: 'c-block',
            label: 'repetir (10) veces',
            children: [
              {
                id: 'j_up_y',
                category: 'motion',
                shape: 'stack',
                label: 'sumar a y: (10)',
              },
            ],
          },
          {
            id: 'j_down_rep',
            category: 'control',
            shape: 'c-block',
            label: 'repetir (10) veces',
            children: [
              {
                id: 'j_down_y',
                category: 'motion',
                shape: 'stack',
                label: 'sumar a y: (-10)',
              },
            ],
          },
        ],
      },
    ],
    options: [
      {
        id: 'opt_jump_simple_ok',
        text: '¡Salta muy bien!',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_jump_physics_next',
        text: 'Quiero probar con plataformas y suelo',
        nextNodeId: 'jump_gravity_physics',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  jump_gravity_physics: {
    id: 'jump_gravity_physics',
    question: 'Para una gravedad continua como en Mario Bros 🍄 necesitamos:\n• Una variable llamada `gravedad` o `velocidad_y`\n• Comprobar si está tocando el suelo.',
    mascotMood: 'detective',
    clues: [
      {
        level: 1,
        title: 'Pista 1: La fuerza hacia abajo',
        hint: 'En un bucle "por siempre", haz "sumar a y: (-4)" todo el tiempo para que caiga.',
        suggestedCategory: 'motion',
      },
      {
        level: 2,
        title: 'Pista 2: Detener la caída en el suelo',
        hint: 'Si <¿tocando el color verde del suelo?>, entonces no debe caer más (o "sumar a y: 4" para rebotar sobre él).',
        suggestedCategory: 'sensing',
      },
    ],
    options: [
      {
        id: 'opt_grav_ok',
        text: '¡Entendido! Lo voy a implementar',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  // --- PUNTUACIÓN Y VIDAS ---
  score_lives_hub: {
    id: 'score_lives_hub',
    question: '¡Las variables hacen que un juego sea emocionante! 🏆 ¿Qué quieres crear?',
    mascotMood: 'happy',
    options: [
      {
        id: 'opt_coin_score',
        text: '🪙 Conseguir puntos al tocar monedas o estrellas',
        nextNodeId: 'score_coins',
      },
      {
        id: 'opt_lives_damage',
        text: '❤️ Perder vidas con enemigos y Game Over',
        nextNodeId: 'score_lives',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  score_coins: {
    id: 'score_coins',
    question: 'Para sumar puntos al recoger una moneda o estrella:\n¿En qué objeto vas a poner el código, en el gato o en la moneda?',
    mascotMood: 'explaining',
    clues: [
      {
        level: 1,
        title: 'Pista 1: Crear la variable',
        hint: 'Ve a Variables (color naranja oscuro) ➔ Crear una variable ➔ Ponle de nombre "Puntos".',
        suggestedCategory: 'variables',
      },
      {
        level: 2,
        title: 'Pista 2: Inicializar y detectar',
        hint: 'En la moneda: Bandera verde ➔ fijar puntos a 0 ➔ mostrar ➔ por siempre: si <¿tocando [Gato]?>, sumar a puntos 1 y esconder.',
        suggestedCategory: 'variables',
        suggestedBlocks: [
          {
            id: 'c_flag',
            category: 'events',
            shape: 'hat',
            label: 'al presionar 🟢 bandera verde',
          },
          {
            id: 'c_set',
            category: 'variables',
            shape: 'stack',
            label: 'fijar [puntos ▼] a (0)',
          },
          {
            id: 'c_show',
            category: 'looks',
            shape: 'stack',
            label: 'mostrar',
          },
          {
            id: 'c_for',
            category: 'control',
            shape: 'c-block',
            label: 'por siempre',
            children: [
              {
                id: 'c_if',
                category: 'control',
                shape: 'c-block',
                label: 'si <¿tocando [Gato ▼]?> entonces',
                children: [
                  {
                    id: 'c_add',
                    category: 'variables',
                    shape: 'stack',
                    label: 'sumar a [puntos ▼] (1)',
                  },
                  {
                    id: 'c_hide',
                    category: 'looks',
                    shape: 'stack',
                    label: 'esconder',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    options: [
      {
        id: 'opt_coins_ok',
        text: '¡Las monedas ya suman puntos y desaparecen!',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  score_lives: {
    id: 'score_lives',
    question: '¡Para las vidas hacemos una cuenta atrás! ❤️\n1. Empiezas con 3 vidas.\n2. Al tocar un enemigo, restas 1 vida (`sumar a vidas: -1`).\n3. Si vidas = 0 ➔ ¡Fin del juego!',
    mascotMood: 'thinking',
    clues: [
      {
        level: 1,
        title: 'Pista: El bloque de fin de partida',
        hint: 'En la categoría naranja de Control tienes el bloque "detener [todos]" para parar el juego cuando vidas llegue a 0.',
        suggestedCategory: 'control',
      },
    ],
    options: [
      {
        id: 'opt_lives_ok',
        text: '¡Ya tengo vidas y Game Over!',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  // --- COLISIONES Y LABERINTO ---
  collision_hub: {
    id: 'collision_hub',
    question: 'Las colisiones son la magia que hace que los videojuegos parezcan sólidos 🧱 ¿Qué tipo de colisión necesitas?',
    mascotMood: 'explaining',
    options: [
      {
        id: 'opt_maze',
        text: '🌀 Laberinto: No atravesar paredes',
        nextNodeId: 'collision_maze',
      },
      {
        id: 'opt_enemy',
        text: '👾 Enemigo: Rebotar o reiniciar posición al tocarlo',
        nextNodeId: 'collision_enemy',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  collision_maze: {
    id: 'collision_maze',
    question: '¿Tu personaje atraviesa las paredes del laberinto como un fantasma? 👻\n¡El secreto está en el "paso atrás"!',
    mascotMood: 'detective',
    clues: [
      {
        level: 1,
        title: 'Pista 1: El truco del rebote inverso',
        hint: 'Si te mueves 10 pasos hacia adelante y tocas la pared negra, debes inmediatamente mover -10 pasos hacia atrás.',
        suggestedCategory: 'sensing',
      },
      {
        level: 2,
        title: 'Pista 2: La estructura del laberinto',
        hint: 'mover 10 pasos ➔ si <¿tocando el color [negro]?> entonces ➔ mover -10 pasos.',
        suggestedCategory: 'motion',
        suggestedBlocks: [
          {
            id: 'col_for',
            category: 'control',
            shape: 'c-block',
            label: 'por siempre',
            children: [
              {
                id: 'col_step',
                category: 'motion',
                shape: 'stack',
                label: 'mover (5) pasos',
              },
              {
                id: 'col_if',
                category: 'control',
                shape: 'c-block',
                label: 'si <¿tocando el color [negro]?> entonces',
                children: [
                  {
                    id: 'col_undo',
                    category: 'motion',
                    shape: 'stack',
                    label: 'mover (-5) pasos',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    options: [
      {
        id: 'opt_maze_ok',
        text: '¡Las paredes ya son sólidas!',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  collision_enemy: {
    id: 'collision_enemy',
    question: 'Al tocar un enemigo o trampa, lo mejor es enviar al héroe de vuelta a la casilla de salida.',
    mascotMood: 'explaining',
    clues: [
      {
        level: 1,
        title: 'Pista: Coordenadas de inicio',
        hint: 'Dentro de "si <¿tocando [Enemigo]?>", usa el bloque "ir a x: (-200) y: (-100)" para reubicar al jugador.',
        suggestedCategory: 'motion',
      },
    ],
    options: [
      {
        id: 'opt_enemy_ok',
        text: '¡Reinicio perfecto al tocar trampas!',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  // --- MENSAJES Y NIVELES ---
  level_messages_hub: {
    id: 'level_messages_hub',
    question: 'Los mensajes ✉️ (Broadcast) son como teléfonos secretos entre objetos y escenarios. Permiten coordinar niveles, victorias o apariciones de jefes.',
    mascotMood: 'explaining',
    clues: [
      {
        level: 1,
        title: 'Pista 1: El que envía el mensaje',
        hint: 'Cuando llegas a la meta: usa "enviar [Nivel 2]" en la categoría amarilla de Eventos.',
        suggestedCategory: 'events',
      },
      {
        level: 2,
        title: 'Pista 2: El que recibe el mensaje',
        hint: 'En el Fondo o en los nuevos objetos: pon "al recibir [Nivel 2]" ➔ "siguiente fondo" o "mostrar".',
        suggestedCategory: 'events',
        suggestedBlocks: [
          {
            id: 'msg_send',
            category: 'events',
            shape: 'stack',
            label: 'enviar mensaje [Nivel 2 ▼]',
          },
          {
            id: 'msg_rec',
            category: 'events',
            shape: 'hat',
            label: 'al recibir [Nivel 2 ▼]',
          },
        ],
      },
    ],
    options: [
      {
        id: 'opt_msg_ok',
        text: '¡Ya sé cambiar de nivel con mensajes!',
        nextNodeId: 'solved_celebration',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  // --- GUÍA DE CATEGORÍAS ---
  categories_guide: {
    id: 'categories_guide',
    question: 'Scratch organiza sus bloques en 8 familias de colores. ¿Sobre cuál quieres aprender?',
    mascotMood: 'explaining',
    options: [
      {
        id: 'opt_cat_events',
        text: '🟡 Eventos (¿Cuándo pasa algo?)',
        nextNodeId: 'cat_events_info',
      },
      {
        id: 'opt_cat_control',
        text: '🟠 Control (Bucles y Decisiones)',
        nextNodeId: 'cat_control_info',
      },
      {
        id: 'opt_cat_motion',
        text: '🔵 Movimiento (Posición, Giros, Ejes)',
        nextNodeId: 'cat_motion_info',
      },
      {
        id: 'opt_cat_sensing',
        text: '🔷 Sensores (Colores, Teclas, Ratón)',
        nextNodeId: 'cat_sensing_info',
      },
      {
        id: 'opt_cat_vars',
        text: '🟧 Variables (Puntos, Vidas, Nombres)',
        nextNodeId: 'cat_vars_info',
      },
      {
        id: 'opt_back_root',
        text: '⬅️ Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  cat_events_info: {
    id: 'cat_events_info',
    question: '🟡 **Eventos**: Son los disparadores. Tienen forma de sombrero porque van arriba del todo. Ejemplos: presionar bandera verde, pulsar tecla, hacer clic en el objeto o recibir mensajes.',
    mascotMood: 'happy',
    options: [
      {
        id: 'opt_cat_back',
        text: '⬅️ Ver otra categoría',
        nextNodeId: 'categories_guide',
      },
      {
        id: 'opt_root',
        text: '🏠 Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  cat_control_info: {
    id: 'cat_control_info',
    question: '🟠 **Control**: Son los directores de orquesta. Tienen forma de "C" para abrazar otros bloques. Ejemplos: "por siempre" (repite sin parar), "repetir 10" y "si ... entonces" (toma decisiones).',
    mascotMood: 'happy',
    options: [
      {
        id: 'opt_cat_back',
        text: '⬅️ Ver otra categoría',
        nextNodeId: 'categories_guide',
      },
      {
        id: 'opt_root',
        text: '🏠 Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  cat_motion_info: {
    id: 'cat_motion_info',
    question: '🔵 **Movimiento**: Controlan la posición (x, y), la velocidad y la orientación (dirección) de los personajes en la pantalla de 480x360 píxeles.',
    mascotMood: 'happy',
    options: [
      {
        id: 'opt_cat_back',
        text: '⬅️ Ver otra categoría',
        nextNodeId: 'categories_guide',
      },
      {
        id: 'opt_root',
        text: '🏠 Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  cat_sensing_info: {
    id: 'cat_sensing_info',
    question: '🔷 **Sensores**: Son los ojos y oídos del personaje. Tienen forma puntiaguda de rombo (hexágono) para encajar dentro de los bloques "si". Detectan si tocas colores, teclas o el ratón.',
    mascotMood: 'happy',
    options: [
      {
        id: 'opt_cat_back',
        text: '⬅️ Ver otra categoría',
        nextNodeId: 'categories_guide',
      },
      {
        id: 'opt_root',
        text: '🏠 Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  cat_vars_info: {
    id: 'cat_vars_info',
    question: '🟧 **Variables**: Son memorias para guardar datos que cambian durante el juego: puntuación, vidas, tiempo restante o récord.',
    mascotMood: 'happy',
    options: [
      {
        id: 'opt_cat_back',
        text: '⬅️ Ver otra categoría',
        nextNodeId: 'categories_guide',
      },
      {
        id: 'opt_root',
        text: '🏠 Menú principal',
        nextNodeId: 'root',
      },
    ],
  },

  // --- CELEBRACIÓN DE ÉXITO ---
  solved_celebration: {
    id: 'solved_celebration',
    question: '🎉 ¡Enhorabuena, programador! Has aplicado la lógica y resuelto el reto. ¡Así es como aprenden los verdaderos creadores de videojuegos!',
    mascotMood: 'celebrating',
    options: [
      {
        id: 'opt_next_feature',
        text: '🚀 Añadir otra mecánica a mi proyecto',
        nextNodeId: 'root',
      },
      {
        id: 'opt_re_analyze',
        text: '🔍 Volver a escanear mi código actual',
        nextNodeId: 'debug_analyzer',
      },
    ],
  },
};
