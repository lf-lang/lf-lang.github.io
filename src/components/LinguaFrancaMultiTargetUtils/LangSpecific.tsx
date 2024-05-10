import { TargetsType, TargetToNameMap } from ".";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import styles from "./styles.module.css";
import CodeBlock from "@theme/CodeBlock";
import { ReactNode, useEffect, useState } from "react";
import { ShikiLFHighlighter } from "../ShikiLFHighlighter";

interface WebpackImportedRawModule {
  default: Readonly<Record<string, string>>;
  [key: string]: unknown;
}

export const LangSpecific = (
  props: Record<TargetsType, ReactNode>,
  // Make ESLint happy
): JSX.Element | false => {
  const propArr: [TargetsType, string?][] = Object.entries(props) as [
    TargetsType,
    string?,
  ][];
  return (
    propArr.length !== 0 && (
      <Tabs groupId="target-languages" queryString>
        {propArr.map(([target, content]) => (
          <TabItem
            key={target}
            value={target}
            // Idk what happened here
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            label={TargetToNameMap.get[target]}
            attributes={{ className: styles.hidden }}
          >
            {content ?? ""}
          </TabItem>
        ))}
      </Tabs>
    )
  );
};

export const NoSelectorTargetCodeBlock = (
  props:
    | ({ lf: boolean } & Record<TargetsType, string | null>)
    | ({ lf: boolean } & Record<
        TargetsType,
        string | Promise<WebpackImportedRawModule | null>
      >),
): JSX.Element => {
  const Component = props.lf ? ShikiLFHighlighter : CodeBlock;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lf, ...targetToCode } = props;
  const newProps: Record<TargetsType, ReactNode> = {} as Record<
    TargetsType,
    ReactNode
  >;
  Object.entries(targetToCode).forEach(
    ([target, content]: [TargetsType, string]) => {
      newProps[target] = <Component language={target}>{content}</Component>;
    },
  );

  return <LangSpecific {...newProps} />;
};
