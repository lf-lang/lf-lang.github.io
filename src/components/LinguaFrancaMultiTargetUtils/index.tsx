import React, { useState, useEffect, ReactNode } from 'react';
export { LanguageSelector } from './LanguageSelector';
export { DynamicMultiTargetCodeblock } from './DynamicMultiTargetCodeblock';
export { LangSpecific, NoSelectorTargetCodeBlock } from './LangSpecific';
export { ShowIf, ShowIfs } from './ShowIf';
import { LangSpecific } from './LangSpecific';

// See https://danielbarta.com/literal-iteration-typescript/
export const targets = ['c', 'cpp', 'py', 'rs', 'ts'] as const;
export type TargetsType = typeof targets[number];

export const TargetToNameMap: Map<TargetsType, string> = new Map([
  ['c', 'C'],
  ['cpp', 'C++'],
  ['py', 'Python'],
  ['rs', 'Rust'],
  ['ts', 'TypeScript'],
]);
export const TargetToOrderingMap: Map<TargetsType, number> = new Map([
  ['c', 0],
  ['cpp', 100],
  ['py', 200],
  ['rs', 300],
  ['ts', 400],
]);

export const ShowOnly = ({
  children,
  ...suppliedTargets
}: Record<TargetsType, boolean> & {
  children: ReactNode;
}): JSX.Element => {
  const newProp: Record<TargetsType, ReactNode> = {} as Record<
    TargetsType,
    ReactNode
  >;
  targets.forEach((e) => {
    // Convert JSX.Element[] to be JSX.Element
    newProp[e] = suppliedTargets[e] ? children : null;
  });

  useEffect(() => {
    console.log(newProp);
  }, []);

  return <LangSpecific {...newProp} />;
};
