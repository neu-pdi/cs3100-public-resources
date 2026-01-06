import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

/**
 * Image component that automatically handles baseUrl for Docusaurus.
 * Use this instead of <img> tags in MDX files to ensure images work
 * correctly with arbitrary baseUrl configurations.
 */
export default function Img({ src, ...props }: ImgProps) {
  // If src starts with /, it's an absolute path from static folder
  // useBaseUrl will prepend the baseUrl automatically
  const imageSrc = src.startsWith('/') ? useBaseUrl(src) : src;
  
  return <img src={imageSrc} {...props} />;
}

