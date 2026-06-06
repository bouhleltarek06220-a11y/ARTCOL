/**
 * Embed pour une vidéo Higgsfield / Kling / autre.
 * Accepte une URL MP4 ou une URL d'embed iframe (YouTube, Vimeo).
 * Si frontmatter "video" est vide, le composant n'affiche rien (no-op).
 */
export default function ArticleVideo({ src, poster, caption }) {
  if (!src) return null;
  const isIframe =
    src.includes("youtube.com") ||
    src.includes("youtu.be") ||
    src.includes("vimeo.com");
  return (
    <figure className="my-10 overflow-hidden rounded-2xl border border-gold/15 bg-black">
      <div className="aspect-video w-full">
        {isIframe ? (
          <iframe
            src={src}
            title={caption || "Vidéo"}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
          />
        ) : (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            src={src}
            poster={poster}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      {caption && (
        <figcaption className="px-4 py-3 text-center text-xs text-muted-soft">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
