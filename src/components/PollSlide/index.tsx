// https://claude.ai/share/0e69d802-5558-466f-a0ae-b205ba4608d9
// https://claude.ai/share/f5e21dae-870d-4038-bc8d-6233f664f394
// https://claude.ai/share/7ed992aa-5a2a-4035-b57a-09bdb4d23f5b

import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface PollSlideProps {
  choices?: string[];
  image?: string;
  code?: string;
  language?: string;
  username?: string;
  codeFormat?: boolean;
  bottomText?: string;
}

/**
 * Poll slide component for Poll Everywhere integration.
 * Displays optional image, optional code block, optional choices, and QR code for voting.
 *
 * @param choices - Array of answer choices (auto-labeled A, B, C, etc.)
 * @param image - Optional image path (relative to static folder)
 * @param code - Optional code snippet to display
 * @param language - Language for code syntax highlighting (default: "java")
 * @param username - Poll Everywhere username (e.g., "espertus"); If omitted, logo is shown
 * @param codeFormat - Whether to format choices as code (default: false)
 * @param bottomText - Optional additional text displayed below the choices
 */
export default function PollSlide({
  choices,
  image,
  code,
  language = 'java',
  username,
  codeFormat = false,
  bottomText
}: PollSlideProps) {
  // All useBaseUrl calls at top level to satisfy React hooks rules
  const qrSrc = useBaseUrl(`/img/lectures/poll-ev/qr-pollev-${username}.png`);
  const logoSrc = useBaseUrl('/img/lectures/poll-ev/poll-ev.png');
  const imageSrc = useBaseUrl(image || '');
  const pollUrl = username ? `https://pollev.com/${username}` : '';

  // Dedent code by removing common leading whitespace
  const dedent = (str: string): string => {
    const lines = str.split('\n');
    // Remove empty first/last lines from template literal formatting
    if (lines[0]?.trim() === '') lines.shift();
    if (lines[lines.length - 1]?.trim() === '') lines.pop();

    // Find minimum indentation (ignoring empty lines)
    const minIndent = lines
      .filter(line => line.trim().length > 0)
      .reduce((min, line) => {
        const match = line.match(/^(\s*)/);
        const indent = match ? match[1].length : 0;
        return Math.min(min, indent);
      }, Infinity);

    // Remove that indentation from all lines
    return lines
      .map(line => line.slice(minIndent === Infinity ? 0 : minIndent))
      .join('\n');
  };

  const formattedCode = code ? dedent(code) : '';

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: '1em',
        gap: '2em'
      }}>

        <div style={{ flex: 1 }}>
          {image && (
            <img
              src={imageSrc}
              alt="Poll image"
              style={{ maxHeight: '40vh', maxWidth: '100%', marginBottom: '1em' }}
            />
          )}

          {code && (
            <pre style={{
              fontSize: '0.7em',
              textAlign: 'left',
              margin: 0,
              marginBottom: choices ? '1em' : 0
            }}>
              <code className={`language-${language}`}>{formattedCode}</code>
            </pre>
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

          {bottomText && (
            <p style={{ fontSize: '0.85em', fontStyle: 'italic', marginTop: '1em' }}>
              {bottomText}
            </p>
          )}
        </div>

        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <img
            src={username ? qrSrc : logoSrc}
            alt="Poll Everywhere QR Code"
            style={{ height: '30vh' }}
          />
          {username && (
            <p style={{ fontSize: '0.8em', marginTop: '0.5em' }}>
              Text <strong>{username}</strong> to 22333 if the<br />URL isn't working for you.
            </p>
          )}
        </div>

      </div>

      {username && (
        <p style={{ textAlign: 'right', marginTop: '1em' }}>
          <a href={pollUrl}>{pollUrl}</a>
        </p>
      )}
    </>
  );
}
