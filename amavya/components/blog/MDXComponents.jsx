/**
 * Composants stylisés pour les articles MDX d'AMAVYA.
 * Toute balise markdown utilise ces composants quand on rend le contenu.
 */
const MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-12 scroll-mt-24 text-2xl font-semibold tracking-tight text-paper sm:text-3xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 scroll-mt-24 text-xl font-semibold text-paper"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mt-5 leading-relaxed text-paper/85" {...props} />
  ),
  a: (props) => (
    <a
      className="text-gold-bright underline decoration-gold/40 underline-offset-4 transition-colors hover:decoration-gold"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-paper" {...props} />
  ),
  em: (props) => <em className="text-paper/95" {...props} />,
  ul: (props) => (
    <ul className="mt-5 flex flex-col gap-2.5 pl-5 text-paper/85 [&>li]:list-disc [&>li]:marker:text-gold-bright" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-5 flex list-decimal flex-col gap-2.5 pl-6 text-paper/85 marker:font-semibold marker:text-gold-bright" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-7 border-l-2 border-gold/60 bg-white/[0.03] py-3 pl-5 pr-3 text-lg italic leading-relaxed text-paper/90"
      {...props}
    />
  ),
  hr: () => (
    <hr className="my-10 border-0 bg-[linear-gradient(90deg,transparent,rgba(240,210,122,0.4),transparent)] [height:1px]" />
  ),
  code: (props) => (
    <code
      className="rounded-md border border-gold/20 bg-white/5 px-1.5 py-0.5 text-[0.92em] text-gold-bright"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-4 text-sm leading-relaxed text-paper/90"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-white/10 bg-white/[0.03] px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gold-bright"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-white/5 px-4 py-2 text-paper/85" {...props} />
  ),
};

export default MDXComponents;
