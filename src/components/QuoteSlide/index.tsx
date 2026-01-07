// https://claude.ai/share/91411c22-222b-47b5-b7e4-bd991c05c8c5
// https://claude.ai/share/0e69d802-5558-466f-a0ae-b205ba4608d9

import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

type Size = 'auto' | 'short' | 'medium' | 'long';

interface QuoteSlideProps {
  quote: string;
  attribution?: string;
  imageSrc?: string;
  imageAlt?: string;
  accentColor?: string;
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
  attribution,
  imageSrc,
  imageAlt,
  accentColor = '#9370DB',
  size = 'auto',
}: QuoteSlideProps) {
  const resolvedSize = size === 'auto' ? getAutoSize(quote) : size;
  const { fontSize, imageHeight } = sizePresets[resolvedSize];

  // Handle baseUrl for absolute paths
  const resolvedImageSrc = imageSrc && imageSrc.startsWith('/')
    ? useBaseUrl(imageSrc)
    : imageSrc;

  return (
    <>
      <div style={{display: 'flex', alignItems: 'flex-start', gap: '1.5em'}}>
        {resolvedImageSrc && (
          <img
            src={resolvedImageSrc}
            alt={imageAlt || 'Portrait'}
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
        </blockquote>
      </div>
      {attribution && (
        <p style={{fontSize: '0.6em', color: '#999', marginTop: '0.5em'}}>
          {attribution}
        </p>
      )}
    </>
  );
}
