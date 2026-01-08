// https://claude.ai/share/0e69d802-5558-466f-a0ae-b205ba4608d9
// https://claude.ai/share/f5e21dae-870d-4038-bc8d-6233f664f394

import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface PollSlideProps {
  choices?: string[];
  image?: string;
  username: string;
  codeFormat?: boolean;
}

/**
 * Poll slide component for Poll Everywhere integration.
 * Displays optional image, optional choices, and QR code for voting.
 *
 * @param choices - Array of answer choices (auto-labeled A, B, C, etc.)
 * @param image - Optional image path (relative to static folder)
 * @param username - Poll Everywhere username (e.g., "espertus")
 * @param codeFormat - Whether to format choices as code (default: false)
 */
export default function PollSlide({
  choices,
  image,
  username,
  codeFormat = false
}: PollSlideProps) {
  const qrSrc = useBaseUrl(`/img/lectures/pollev-qr-codes/qr-pollev-${username}.png`);
  const imageSrc = useBaseUrl(image ?? '');
  const pollUrl = `https://pollev.com/${username}`;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: '1em'
      }}>

        <div style={{ flex: 1 }}>
          {image && (
            <img
              src={imageSrc}
              alt="Poll image"
              style={{ maxHeight: '40vh', maxWidth: '100%', marginBottom: '1em' }}
            />
          )}

          {choices && choices.length > 0 && (
            <div style={{ fontSize: '1.0em' }}>
              {choices.map((choice, index) => (
                <p key={index} style={{ margin: '0.5em 0' }}>
                  <strong>{letters[index]}.</strong>{' '}
                  {codeFormat ? <code>{choice}</code> : choice}
                </p>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginLeft: '2em' }}>
          <img
            src={qrSrc}
            alt="Poll Everywhere QR Code"
            style={{ height: '30vh' }}
          />
          <p style={{ fontSize: '0.8em', marginTop: '0.5em' }}>
            Text <strong>{username}</strong> to 22333 if the<br />URL isn't working for you.
          </p>
        </div>

      </div>

      <p style={{ textAlign: 'right', marginTop: '1em' }}>
        <a href={pollUrl}>{pollUrl}</a>
      </p>
    </>
  );
}