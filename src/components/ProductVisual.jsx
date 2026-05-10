function renderSvg(type) {
  const shared = 'fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"';

  switch (type) {
    case "knob":
      return `<svg viewBox="0 0 220 160" aria-hidden="true"><circle cx="110" cy="68" r="34" ${shared} /><path d="M110 102v22" ${shared} /></svg>`;
    case "flush":
      return `<svg viewBox="0 0 220 160" aria-hidden="true"><rect x="32" y="48" width="156" height="64" rx="18" ${shared} /><path d="M70 80h80" ${shared} /></svg>`;
    case "profile":
      return `<svg viewBox="0 0 220 160" aria-hidden="true"><path d="M34 108h118l34-56H68l-34 56Z" ${shared} /></svg>`;
    case "connector":
      return `<svg viewBox="0 0 220 160" aria-hidden="true"><path d="M56 56h58v46H68l-12 12V56Z" ${shared} /><path d="M116 58h50l-18 22 18 22h-50" ${shared} /></svg>`;
    case "lock":
      return `<svg viewBox="0 0 220 160" aria-hidden="true"><rect x="70" y="44" width="80" height="88" rx="20" ${shared} /><circle cx="110" cy="88" r="12" ${shared} /></svg>`;
    case "hinge":
      return `<svg viewBox="0 0 220 160" aria-hidden="true"><rect x="42" y="46" width="58" height="68" rx="12" ${shared} /><rect x="120" y="46" width="58" height="68" rx="12" ${shared} /><path d="M110 44v72" ${shared} /></svg>`;
    case "slide":
      return `<svg viewBox="0 0 220 160" aria-hidden="true"><path d="M38 92h144" ${shared} /><path d="M54 68h112" ${shared} /><path d="M70 116h80" ${shared} /></svg>`;
    case "support":
      return `<svg viewBox="0 0 220 160" aria-hidden="true"><path d="M56 112 96 48" ${shared} /><path d="M96 48h52" ${shared} /><path d="M92 96h58" ${shared} /></svg>`;
    case "handle":
    default:
      return `<svg viewBox="0 0 220 160" aria-hidden="true"><path d="M58 110V72c0-12 10-22 22-22h60c12 0 22 10 22 22v38" ${shared} /></svg>`;
  }
}

export default function ProductVisual({ type = "handle", compact = false, image = "", alt = "" }) {
  if (image) {
    return (
      <div className={`product-visual ${compact ? "compact" : ""}`}>
        <img src={image} alt={alt} loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={`product-visual ${compact ? "compact" : ""}`}
      dangerouslySetInnerHTML={{ __html: renderSvg(type) }}
    />
  );
}
