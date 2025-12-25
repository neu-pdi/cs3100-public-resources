"use client";

import { Tooltip as ChakraTooltip, TooltipTrigger, TooltipContent } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

/**
 * Tooltip component wrapper for Chakra UI v3
 * Provides a simple interface matching the expected API
 */
export function Tooltip({ content, children }: TooltipProps) {
  return (
    <ChakraTooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </ChakraTooltip>
  );
}
