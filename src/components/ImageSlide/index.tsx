// https://claude.ai/share/91411c22-222b-47b5-b7e4-bd991c05c8c5

import React from 'react';

type ImagePlacement = 'left' | 'right';

interface ImageSlideProps {
  aboveText?: React.ReactNode;
  sideText?: React.ReactNode;
  belowText?: React.ReactNode;
  source?: string;
  imageSrc: string;
  imageAlt?: string;
  imagePlacement?: ImagePlacement;
  imageHeight?: string;
}

export default function ImageSlide({
  aboveText,
  sideText,
  belowText,
  source,
  imageSrc,
  imageAlt,
  imagePlacement = 'right',
  imageHeight = '40vh',
}: ImageSlideProps) {
  const image = (
    <img
      src={imageSrc}
      alt={imageAlt || ''}
      style={{ maxHeight: imageHeight, borderRadius: '4px' }}
    />
  );

  const sideContent = sideText && (
    <div style={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{sideText}</div>
  );

  return (
    <>
      {aboveText && <div style={{ marginBottom: '1em' }}>{aboveText}</div>}

      {sideText ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5em' }}>
          {imagePlacement === 'left' ? (
            <>
              {image}
              {sideContent}
            </>
          ) : (
            <>
              {sideContent}
              {image}
            </>
          )}
        </div>
      ) : (
        <div>{image}</div>
      )}

      {belowText && <div style={{ marginTop: '1em' }}>{belowText}</div>}

      {source && (
        <p style={{ fontSize: '0.6em', color: '#999', marginTop: '0.5em' }}>
          {source}
        </p>
      )}
    </>
  );
}