import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { type Targets, TargetToNameMap } from './index';

// String-like keys will preserve insertion ordering. This is hacky but it looks nicer.
export const LanguageSelector = (props: Record<Targets, boolean | null>): JSX.Element => {
  if (Object.values(props).every((val) => (val == false))) {
    throw (new class extends Error {
      constructor() {
        super("LanguageSelector is used, but no language is supplied.");
        this.name = 'IllegalArgumentError';
      }
    }());
  }

  // Reorder languages in the c, cpp, py, rs, ts order.
  // https://stackoverflow.com/a/31102605
  const ordered = Object.keys(props).sort().reduce(
    (obj, key) => {
      obj[key] = props[key];
      return obj;
    },
    {}
  );

  return (
    <>
      <p>This article has examples in the following target languages:</p>
      <Tabs groupId="target-languages" queryString>
        {Object.entries(ordered).map(
          (e: [Targets, boolean], i) => {
            return e[1] && (
              <TabItem key={e[0]} value={e[0]} label={TargetToNameMap.get(e[0])}>
                <></>
              </TabItem>
            );
          }
        )}
      </Tabs>
    </>
  );
};