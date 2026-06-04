import { useTabs, type TabsProps } from "@docusaurus/theme-common/internal";
import { TargetToNameMap, type TargetsType } from ".";

/**
 * Inline text that reflects the target language chosen in the page's
 * LanguageSelector (same tab group as ShowIf / ShowOnly).
 */
export const TargetLanguage = (): JSX.Element => {
  const fakeTabProps: TabsProps = {
    values: [...TargetToNameMap].map(([target, targetName]) => ({
      value: target,
      label: targetName,
    })),
    children: [],
    groupId: "target-languages",
  };
  const { selectedValue } = useTabs(fakeTabProps);
  const name =
    TargetToNameMap.get(selectedValue as TargetsType) ?? selectedValue;
  return <>{name}</>;
};
