import { TargetsType, TargetToNameMap } from '.';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import styles from './styles.module.css';
import CodeBlock from '@theme/CodeBlock';
import { ReactNode, useEffect, useState } from 'react';
import { ShikijiLFHighlighter } from '../ShikijiLFHighlighter';

interface WebpackImportedRawModule {
  default: { readonly [key: string]: string };
  [key: string]: unknown;
}

export const LangSpecific = (
  props: Record<TargetsType, ReactNode>
): JSX.Element => {
  const propArr: [TargetsType, string?][] = Object.entries(props) as [
    TargetsType,
    string?
  ][];
  return (
    propArr.length !== 0 && (
      <Tabs groupId="target-languages" queryString>
        {propArr.map(([target, content]) => (
          <TabItem
            key={target}
            value={target}
            label={TargetToNameMap.get[target]}
            attributes={{ className: styles.hidden }}
          >
            {content ?? ''}
          </TabItem>
        ))}
      </Tabs>
    )
  );
};


export const NoSelectorTargetCodeBlock = (
  props:
    ({ allowAsync?: false; lf: boolean } & Record<TargetsType, string>) |
    ({ allowAsync: true; lf: boolean } & Record<TargetsType, string | Promise<WebpackImportedRawModule>>)
): JSX.Element => {
  const Component = props.lf ? ShikijiLFHighlighter : CodeBlock;
  // I know, using === on boolean looks dumb, but this makes TS discriminated union work!
  if (props.allowAsync === true) {
    // Idem. I would like to do destruction above, but that will affect TS type system!
    const { allowAsync, lf, ...targetToCode } = props;
    // Although honestly, this is not really needed. We should prefer static import over this async one.
    const [newProps, setNewProps] = useState<Record<TargetsType, ReactNode>>({} as Record<
      TargetsType,
      ReactNode
    >);

    useEffect(() => {
      (async () => {
        Object.entries(targetToCode).forEach(async ([target, content]: [TargetsType, string | Promise<WebpackImportedRawModule>]) => {
          const resolvedContent = await Promise.resolve(content);
          setNewProps(prev => ({
            [target]: <Component language={target}>{typeof resolvedContent === "string" ? resolvedContent : resolvedContent.default.toString()}</Component>,
            ...prev
          }));
        });
      })();
    }, []);

    return <LangSpecific {...newProps} />;
  } else {
    const { allowAsync, lf, ...targetToCode } = props;
    const newProps: Record<TargetsType, ReactNode> = {} as Record<
      TargetsType,
      ReactNode
    >;
    Object.entries(targetToCode).forEach(([target, content]: [TargetsType, string]) => {
      newProps[target] = <Component language={target}>{content}</Component>;
    });

    return <LangSpecific {...newProps} />;
  }
};
