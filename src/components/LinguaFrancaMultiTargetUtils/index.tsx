import React, { useState, useEffect, ReactNode } from 'react';
import { LangSpecific } from './LangSpecific';
// This is a rather dirty hack, but it's kinda a necessary evil......
import { useTabs, type TabsProps } from '@docusaurus/theme-common/internal';
import style from "./styles.module.css";

export { LanguageSelector } from './LanguageSelector';
export { DynamicMultiTargetCodeblock } from './DynamicMultiTargetCodeblock';
export { LangSpecific, NoSelectorTargetCodeBlock } from './LangSpecific';
export { ShowIf, ShowIfs, ShowIfsInline } from './ShowIf';

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
  inline,
  ...suppliedTargets
}: Record<TargetsType, boolean> & {
  children: ReactNode;
  inline?: boolean;
}): JSX.Element => {
  // We "fake" a tab here to receive metadata. This way the website doesn't look weird when things are hidden......
  // useTabs is supposed to be internal though.... But we use it anyway. It could break I guess??
  const fakeTabProps: TabsProps = {
    values: [...TargetToNameMap].map(([target, targetName]) => ({ value: target, label: targetName })),
    children: [],
    groupId: "target-languages",
  };
  const { selectedValue, selectValue, tabValues } = useTabs(fakeTabProps);
  const ShowOnlyTag = inline === true ? "span" : "div";

  return (
    <ShowOnlyTag className={suppliedTargets[selectedValue] === true ? undefined : style.hidden}>
      {children}
    </ShowOnlyTag>
  );
};
