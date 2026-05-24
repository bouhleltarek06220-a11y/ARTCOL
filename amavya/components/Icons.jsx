/* Icônes vectorielles légères (stroke), style ligne moderne. */

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconAgent(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <path d="M12 7V4M9 12h.01M15 12h.01M9 16h6" />
      <path d="M2 12h2M20 12h2" />
    </svg>
  );
}

export function IconCRM(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 11a3 3 0 1 0-1-5.83" />
      <path d="M21 20a6 6 0 0 0-5-5.91" />
    </svg>
  );
}

export function IconAutomation(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 8.5 13 12l-1 3.5L11 12z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconProspection(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

export function IconSaaS(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 17a4 4 0 0 1 0-8 5 5 0 0 1 9.7-1.5A4.5 4.5 0 0 1 18 17z" />
      <path d="M12 12v5M9.5 14.5 12 17l2.5-2.5" />
    </svg>
  );
}

export function IconFormation(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8l9-4 9 4-9 4z" />
      <path d="M7 10v5c0 1.1 2.2 2 5 2s5-.9 5-2v-5" />
      <path d="M21 8v5" />
    </svg>
  );
}

export function IconShield(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconSpark(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4z" />
    </svg>
  );
}
