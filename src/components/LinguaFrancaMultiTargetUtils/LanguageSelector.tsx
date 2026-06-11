import Tabs from "@theme/Tabs";
import { type TargetsType, TargetToNameMap, compareTargets } from "./index";
import Translate from "@docusaurus/Translate";

// String-like keys will preserve insertion ordering. This is hacky but it looks nicer.
export const LanguageSelector = (
  props: Record<TargetsType, boolean | null>,
): JSX.Element => {
  if (Object.values(props).every((val) => val == false)) {
    throw new (class extends Error {
      constructor() {
        super("LanguageSelector is used, but no language is supplied.");
        this.name = "IllegalArgumentError";
      }
    })();
  }

  const tabValues = Object.entries(props)
    .filter(([_, exist]: [string, boolean | null]) => exist === true)
    .sort(([a], [b]) => compareTargets(a as TargetsType, b as TargetsType));

  return (
    <>
      <p>
        <Translate>
          This article has examples in the following target languages:
        </Translate>
      </p>
      <Tabs
        groupId="target-languages"
        queryString
        values={tabValues.map(([lang]: [TargetsType, boolean | null]) => ({
          value: lang,
          label: TargetToNameMap.get(lang),
        }))}
        children={[]}
      />
    </>
  );
};
