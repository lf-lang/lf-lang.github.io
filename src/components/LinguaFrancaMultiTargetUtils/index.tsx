import React, { useState, useEffect, ReactNode } from 'react';
import { LangSpecific } from './LangSpecific';
// This is a rather dirty hack, but it's kinda a necessary evil......
import { useTabs, type TabsProps } from '@docusaurus/theme-common/internal';
import style from "./styles.module.css";

export { LanguageSelector } from './LanguageSelector';
export { DynamicMultiTargetCodeblock } from './DynamicMultiTargetCodeblock';
export { LangSpecific, NoSelectorTargetCodeBlock } from './LangSpecific';
export { ShowIf, ShowIfs } from './ShowIf';

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
  // We "fake" a tab here to receive metadata. This way the website doesn't look weird when things are hidden......
  // useTabs is supposed to be internal though.... But we use it anyway. It could break I guess??
  const fakeTabProps: TabsProps = {
    values: [...TargetToNameMap].map(([target, targetName]) => ({ value: target, label: targetName })),
    children: [],
    groupId: "target-languages",
  };
  const { selectedValue, selectValue, tabValues } = useTabs(fakeTabProps);

  return (
    <div className={suppliedTargets[selectedValue] === true ? null : style.hidden}>
      {children}
    </div>
  );

};

export const LangSpecificInlineForString = (contents: Record<TargetsType, ReactNode>): JSX.Element => {
  // We show all and hide some of them to not hurt SEO.
  const fakeTabProps: TabsProps = {
    values: [...TargetToNameMap].map(([target, targetName]) => ({ value: target, label: targetName })),
    children: [],
    groupId: "target-languages",
  };
  const { selectedValue, selectValue, tabValues } = useTabs(fakeTabProps);

  const propArr: [TargetsType, string?][] = Object.entries(contents) as [
    TargetsType,
    string?
  ][];

  // Because it's inline, we use span instead of div.
  return (<>
    {propArr.map(([target, content]) => (
      <span className={target === selectedValue ? null : style.hidden}>{content}</span>
    ))}
  </>);
}