import React, { useState, useEffect } from "react";
import { TargetsType } from "./index";
import { NoSelectorTargetCodeBlock } from "./LangSpecific";
import Translate from "@docusaurus/Translate";

interface WebpackImportedRawModule {
  default: Readonly<Record<string, string>>;
  [key: string]: unknown;
}

export const DynamicMultiTargetCodeblock = ({
  file,
  doNotTransformInMDX,
  ...suppliedTargets
}: {
  file?: string;
  doNotTransformInMDX?: boolean;
} & Record<TargetsType, boolean>): JSX.Element => {
  const [targetToCodeState, setTargetToCodeState] = useState<
    Record<TargetsType, string | null>
  >({} as Record<TargetsType, string | null>);

  useEffect(() => {
    const getCode = async (targetLang: TargetsType) => {
      // Webpack 5 magic, it's not typed so it's really screwed up
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const content: WebpackImportedRawModule = await import(
        `@site/docs/assets/code/${targetLang}/${file}.lf`
      );
      setTargetToCodeState((prevState) => ({
        ...prevState,
        // Idibem
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        [targetLang]: content.default.toString(),
      }));
    };

    if (file != null) {
      Object.entries(suppliedTargets).forEach(
        ([t, pred]: [TargetsType, boolean]) => {
          if (pred == true) {
            getCode(t).catch((e) => console.log(e));
          }
        },
      );
    }
  });

  return (
    <>
      {!doNotTransformInMDX && (
        <b>
          <Translate>
            Warning: DynamicMultiTargetCodeblock is present, but
            DynamicMultiTargetCodeblock is not set. This means corresponding MDX
            plugin that transforms it into code selector and import statements
            is not working correctly!
          </Translate>
        </b>
      )}
      <NoSelectorTargetCodeBlock {...targetToCodeState} lf />
    </>
  );
};
