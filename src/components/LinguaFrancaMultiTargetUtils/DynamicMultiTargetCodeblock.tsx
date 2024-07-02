/**
 * #### DynamicMultiTargetCodeblock
 *
 * Warnings:
 * - This is not working properly with versioning and will have issues with Webpack performance!
 * - This is not working properly now! Need to fix the file path in `content` in `DynamicMultiTargetCodeblock.tsx`.
 *
 * This utility allows you to only supply a LF filename and all files will be dynamically imported. The issue is Webpack is not intelligent enough so if you use it, it will probably load all LF files in `assets`. Also, because relative import appears to be impossible, using it will always get you the latest code examples. See `src/components/LinguaFrancaMultiTargetUtils/DynamicMultiTargetCodeblock.tsx`.
 *
 * ##### Examples
 *
 * ```tsx
 * <DynamicMultiTargetCodeblock c cpp ts rs py file="HelloWorld" />
 * ```
 *
 * To suppress warnings, add
 *
 * ```tsx
 * <DynamicMultiTargetCodeblock doNotTransformInMDX c cpp ts rs py file="HelloWorld" />
 * ```
 *
 * #### DynamicMultiTargetCodeblock with TransformDynamicLFFileImportToStatic
 *
 * Warning: This is an experiment and should not be used in production!
 *
 * A way to make `DynamicMultiTargetCodeblock` more sane is to use remark and preprocess it into a bunch of import statements and a `NoSelectorTargetCodeBlock`.
 *
 * `src/remark/TransformDynamicLFFileImportToStatic.ts` is a remark plugin that does so. It looks like a disaster and I don't understand it anymore 5 months after writing it.
 *
 * To use DynamicMultiTargetCodeBlock, add it to `docusaurus.config.ts` as a ReMark preprocessor.
 *
 * But don't use it.`
 */

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
