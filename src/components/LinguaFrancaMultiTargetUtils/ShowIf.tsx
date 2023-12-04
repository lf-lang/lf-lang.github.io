// Using Children is not encouraged, but I can't think of other ways......
import { ReactNode, Children, ReactElement } from 'react';
import { ShowOnly, targets, TargetsType } from '.';
import { LangSpecific } from './LangSpecific';

export const ShowIf = ({
  children,
  ...suppliedTargets
}: Record<TargetsType, boolean> & { children: ReactNode }): JSX.Element => {
  return <></>;
};

export const ShowIfs = ({
  children,
}: {
  children:
    | ReactElement<Record<TargetsType, boolean> & { children: ReactNode }>
    | ReactElement<Record<TargetsType, boolean> & { children: ReactNode }>[];
}): JSX.Element => {
  const propArr = {} as Record<TargetsType, ReactNode>;
  Children.forEach(children, (e) => {
    // TODO: Change to hasOwn
    targets.forEach((target) => {
      // If children doesn't contain target language or is false, do nothing
      if (!(e.props[target] ?? false)) return;
      // Children does contain target language, but it has been declared and propArr contains it
      if (propArr[target] != null)
        throw Error(`Target language ${target} included more than once`);
      // Modify propArr
      propArr[target] = e.props.children;
    });
  });

  return <LangSpecific {...propArr} />;
};

export const ShowIfsInline = ({
  children,
}: {
  children:
    | ReactElement<Record<TargetsType, boolean> & { children: ReactNode }>
    | ReactElement<Record<TargetsType, boolean> & { children: ReactNode }>[];
}): JSX.Element => {
  const propArr = {} as Record<TargetsType, ReactNode>;
  Children.forEach(children, (e) => {
    // TODO: Change to hasOwn
    targets.map((target) => {
      // If children doesn't contain target language or is false, do nothing
      if (!(e.props[target] ?? false)) return;
      // Children does contain target language, but it has been declared and propArr contains it
      if (propArr[target] != null)
        throw Error(`Target language ${target} included more than once`);
      // Modify propArr
      const languageProp = {[target]: true} as Record<"c" | "cpp" | "py" | "rs" | "ts", boolean>;
      <ShowOnly {...languageProp} inline >{e.props.children}</ShowOnly>
    });
  });

  return <LangSpecific {...propArr} />;
};
