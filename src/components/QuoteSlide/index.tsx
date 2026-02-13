import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

type Size = 'auto' | 'short' | 'medium' | 'long';

interface QuoteSlideProps {
  /** The quote text (without quotation marks - they are added automatically) */
  quote: string;
  /** Who said the quote, displayed inside the blockquote */
  author?: string;
  /** Image source, publication info, or other metadata (displayed below the slide) */
  credit?: string;
  /** Path to an image (typically a portrait of the author) */
  imageSrc?: string;
  /** Alt text for the image (defaults to author if not specified) */
  imageAlt?: string;
  /** Color for the blockquote left border */
  accentColor?: string;
  /** Controls font size and image height: 'short', 'medium', 'long', or 'auto' (default) */
  size?: Size;
}

const sizePresets = {
  short: {
    fontSize: '1em',
    imageHeight: '40vh',
  },
  medium: {
    fontSize: '0.9em',
    imageHeight: '35vh',
  },
  long: {
    fontSize: '0.8em',
    imageHeight: '30vh',
  },
};

function getAutoSize(quote: string): keyof typeof sizePresets {
  const len = quote.length;
  if (len < 100) return 'short';
  if (len < 300) return 'medium';
  return 'long';
}

export default function QuoteSlide({
  quote,
  author,
  credit,
  imageSrc,
  imageAlt,
  accentColor = '#9370DB',
  size = 'auto',
}: QuoteSlideProps) {
  const resolvedSize = size === 'auto' ? getAutoSize(quote) : size;
  const { fontSize, imageHeight } = sizePresets[resolvedSize];

  const baseUrlResult = useBaseUrl(imageSrc || '');
  const resolvedImageSrc = imageSrc && imageSrc.startsWith('/')
    ? baseUrlResult
    : imageSrc;

  return (
    <>
      <div style={{display: 'flex', alignItems: 'flex-start', gap: '1.5em'}}>
        {resolvedImageSrc && (
          <img
            src={resolvedImageSrc}
            alt={imageAlt || author || 'Portrait'}
            style={{maxHeight: imageHeight, borderRadius: '4px'}}
          />
        )}
        <blockquote style={{
          fontSize,
          fontStyle: 'italic',
          borderLeft: `4px solid ${accentColor}`,
          paddingLeft: '1em',
          textAlign: 'left',
          margin: 0,
        }}>
          "{quote}"
          {author && (
            <footer style={{
              fontSize: '0.7em',
              fontStyle: 'normal',
              color: '#666',
              marginTop: '0.5em',
            }}>
              — {author}
            </footer>
          )}
        </blockquote>
      </div>
      {credit && (
        <p style={{fontSize: '0.5em', color: '#777', textAlign: 'left', marginTop: '0.5em'}}>
          {credit}
        </p>
      )}
    </>
  );
}
