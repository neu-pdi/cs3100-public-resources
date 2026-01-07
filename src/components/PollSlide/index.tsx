// https://claude.ai/share/0e69d802-5558-466f-a0ae-b205ba4608d9

import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface PollSlideProps {
  choices: string[];
  username: string;
  codeFormat?: boolean;
}

/**
 * Poll slide component for Poll Everywhere integration.
 * Displays multiple choices and QR code for voting.
 *
 * @param choices - Array of answer choices (auto-labeled A, B, C, etc.)
 * @param username - Poll Everywhere username (e.g., "espertus")
 * @param codeFormat - Whether to format choices as code (default: false)
 */
export default function PollSlide({
  choices,
  username,
  codeFormat = false
}: PollSlideProps) {
  const qrSrc = useBaseUrl(`/img/lectures/pollev-qr-codes/qr-pollev-${username}.png`);
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

        <div style={{fontSize: '1.0em'}}>
          {choices.map((choice, index) => (
            <p key={index} style={{margin: '0.5em 0'}}>
              <strong>{letters[index]}.</strong>{' '}
              {codeFormat ? <code>{choice}</code> : choice}
            </p>
          ))}
        </div>

        <div style={{textAlign: 'center'}}>
          <img
            src={qrSrc}
            alt="Poll Everywhere QR Code"
            style={{height: '30vh'}}
          />
          <p style={{fontSize: '0.8em', marginTop: '0.5em'}}>
            Text <strong>{username}</strong> to 22333 if the<br/>URL isn't working for you.
          </p>
        </div>

      </div>

      <p style={{textAlign: 'right', marginTop: '1em'}}>
        <a href={pollUrl}>{pollUrl}</a>
      </p>
    </>
  );
}
