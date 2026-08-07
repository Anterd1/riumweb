import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Clock3, Network, Workflow } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const paths = [
  { id: 'input-agent', d: 'M92 94 C150 94 164 174 235 174', delay: 0 },
  { id: 'data-agent', d: 'M92 174 C150 174 164 174 235 174', delay: .7 },
  { id: 'team-agent', d: 'M92 254 C150 254 164 174 235 174', delay: 1.4 },
  { id: 'agent-output', d: 'M265 174 C336 174 350 104 408 104', delay: .35 },
  { id: 'agent-action', d: 'M265 174 C336 174 350 244 408 244', delay: 1.05 }
];

const FlowMap = ({ copy, reduceMotion }) => (
  <figure
    className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#15171C] p-5 sm:min-h-[500px] sm:p-8"
    role="img"
    aria-labelledby="agentic-flow-title agentic-flow-description"
  >
    <figcaption className="sr-only">
      <span id="agentic-flow-title">{copy.visualTitle}</span>
      <span id="agentic-flow-description">{copy.visualDescription}</span>
    </figcaption>
    <div className="rium-grid absolute inset-0 opacity-60" aria-hidden="true" />
    <div className="absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-8 sm:top-8">
      <span className="font-mono text-[10px] uppercase tracking-[.18em] text-white/40">{copy.mapLabel}</span>
      <span className="flex items-center gap-2 rounded-full border border-[#DFFF4F]/25 bg-[#DFFF4F]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#DFFF4F]">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-[#DFFF4F]"
          animate={reduceMotion ? undefined : { opacity: [.35, 1, .35] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        {copy.active}
      </span>
    </div>

    <div className="absolute inset-x-4 bottom-5 top-20 sm:inset-x-8 sm:bottom-8">
      <svg className="h-full w-full" viewBox="0 0 500 340" aria-hidden="true">
        <defs>
          <filter id="agentic-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {paths.map((path) => (
          <g key={path.id}>
            <path d={path.d} fill="none" stroke="rgba(255,255,255,.13)" strokeWidth="1.5" />
            <motion.path
              d={path.d}
              fill="none"
              stroke="#5B72FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="7 12"
              animate={reduceMotion ? undefined : { strokeDashoffset: [38, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: path.delay }}
            />
            {!reduceMotion && (
              <motion.circle
                r="4"
                fill="#DFFF4F"
                filter="url(#agentic-glow)"
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: '100%' }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', delay: path.delay }}
                style={{ offsetPath: `path("${path.d}")` }}
              />
            )}
          </g>
        ))}

        {[94, 174, 254].map((y, index) => (
          <motion.g
            key={y}
            animate={reduceMotion ? undefined : { opacity: [.55, 1, .55] }}
            transition={{ duration: 3, repeat: Infinity, delay: index * .5 }}
          >
            <circle cx="72" cy={y} r="20" fill="#101114" stroke="rgba(255,255,255,.25)" />
            <circle cx="72" cy={y} r="5" fill="#5B72FF" />
          </motion.g>
        ))}

        <motion.g
          animate={reduceMotion ? undefined : { scale: [1, 1.045, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '250px 174px' }}
        >
          <circle cx="250" cy="174" r="43" fill="#5B72FF" />
          <circle cx="250" cy="174" r="31" fill="#101114" stroke="#DFFF4F" strokeWidth="1.5" />
          <circle cx="250" cy="174" r="7" fill="#DFFF4F" />
        </motion.g>

        {[104, 244].map((y, index) => (
          <motion.g
            key={y}
            animate={reduceMotion ? undefined : { y: [0, index ? 4 : -4, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: index * .8 }}
          >
            <rect x="408" y={y - 28} width="72" height="56" rx="18" fill={index ? '#DFFF4F' : '#F2F0E9'} />
            <path d={`M430 ${y}h28`} stroke="#101114" strokeWidth="3" strokeLinecap="round" />
            <path d={`M450 ${y - 8}l8 8-8 8`} fill="none" stroke="#101114" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        ))}
      </svg>

      <div className="pointer-events-none absolute inset-0 font-mono text-[9px] uppercase tracking-[.12em] text-white/50 sm:text-[10px]">
        <span className="absolute left-[1%] top-[13%]">{copy.nodes.tools}</span>
        <span className="absolute left-[1%] top-[37%]">{copy.nodes.data}</span>
        <span className="absolute left-[1%] top-[61%]">{copy.nodes.teams}</span>
        <span className="absolute left-1/2 top-[61%] -translate-x-1/2 text-center text-[#DFFF4F]">{copy.nodes.agent}</span>
        <span className="absolute right-[1%] top-[11%] text-right text-[#101114] sm:right-[2%]">{copy.nodes.decisions}</span>
        <span className="absolute right-[1%] top-[55%] text-right text-[#101114] sm:right-[2%]">{copy.nodes.actions}</span>
      </div>
    </div>
  </figure>
);

const AgenticDigitalization = () => {
  const { i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const isSpanish = i18n.language?.startsWith('es');
  const copy = isSpanish ? {
    kicker: 'Digitalización agéntica',
    title: 'Tu operación aprende a moverse sola.',
    intro: 'Digitalización agéntica significa convertir procesos que hoy dependen de copiar, perseguir y coordinar información en flujos capaces de avanzar con reglas claras y supervisión humana.',
    difference: 'No se trata de sumar otra herramienta. Diseñamos agentes que conectan las que ya usas, entienden el contexto de cada tarea y llevan el trabajo al siguiente paso. Así tu equipo compite con una operación más ágil, consistente y difícil de imitar.',
    benefits: [
      { icon: Workflow, title: 'Automatizar flujos', description: 'Las tareas repetitivas avanzan entre sistemas sin depender de cadenas de mensajes o capturas manuales.' },
      { icon: Network, title: 'Conectar la operación', description: 'Herramientas, datos y equipos comparten el contexto necesario para tomar mejores decisiones.' },
      { icon: Clock3, title: 'Devolver tiempo humano', description: 'Las personas se concentran en criterio, creatividad y relaciones; los agentes coordinan el trabajo rutinario.' }
    ],
    mapLabel: 'Flujo operativo',
    active: 'Coordinando',
    visualTitle: 'Mapa de un flujo agéntico',
    visualDescription: 'Herramientas, datos y equipos convergen en un agente que coordina decisiones y acciones.',
    nodes: { tools: 'Herramientas', data: 'Datos', teams: 'Equipos', agent: 'Agente', decisions: 'Decisiones', actions: 'Acciones' }
  } : {
    kicker: 'Agentic digitalization',
    title: 'Your operation learns to move on its own.',
    intro: 'Agentic digitalization means turning processes that depend on copying, chasing and coordinating information into flows that can move forward with clear rules and human oversight.',
    difference: 'This is not about adding another tool. We design agents that connect the ones you already use, understand each task’s context and move work to its next step. Your team competes with an operation that is faster, more consistent and harder to imitate.',
    benefits: [
      { icon: Workflow, title: 'Automate workflows', description: 'Repetitive tasks move between systems without relying on message chains or manual data entry.' },
      { icon: Network, title: 'Connect operations', description: 'Tools, data and teams share the context they need to make better decisions.' },
      { icon: Clock3, title: 'Give time back to people', description: 'People focus on judgment, creativity and relationships while agents coordinate routine work.' }
    ],
    mapLabel: 'Operational flow',
    active: 'Coordinating',
    visualTitle: 'Map of an agentic workflow',
    visualDescription: 'Tools, data and teams converge into an agent that coordinates decisions and actions.',
    nodes: { tools: 'Tools', data: 'Data', teams: 'Teams', agent: 'Agent', decisions: 'Decisions', actions: 'Actions' }
  };

  return (
    <section id="agentic-digitalization" className="overflow-hidden bg-[#101114] py-24 text-white md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <div>
            <p className="rium-kicker mb-6 text-[#DFFF4F]"><span className="h-2 w-2 rounded-full bg-[#DFFF4F]" />{copy.kicker}</p>
            <h2 className="max-w-4xl text-5xl font-semibold leading-[.94] tracking-[-.055em] md:text-7xl">{copy.title}</h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-white/65 lg:justify-self-end">{copy.intro}</p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-stretch">
          <div className="flex flex-col">
            <p className="max-w-xl text-xl font-medium leading-relaxed text-white/90 md:text-2xl">{copy.difference}</p>
            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {copy.benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.article
                    key={benefit.title}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: .6 }}
                    transition={{ duration: .55, delay: index * .1, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-[auto_1fr] gap-4 py-6"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#5B72FF] text-white"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight">{benefit.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/55">{benefit.description}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <FlowMap copy={copy} reduceMotion={reduceMotion} />
        </div>
      </div>
    </section>
  );
};

export default AgenticDigitalization;
