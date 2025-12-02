import type { ReactNode } from 'react';

export interface QAndA {
  emoji: string;
  question: string;
  answer: React.ComponentType;
}

export interface Feature {
  title: string;
  body: string;
  free: boolean;
}

export interface FreeResource {
  title: string;
  subTitle: string;
  url: string;
}
