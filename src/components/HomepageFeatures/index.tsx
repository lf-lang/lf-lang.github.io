import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import { ReactElement } from "react";
import Translate from "@docusaurus/Translate";

interface FeatureItem {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
}

import Mountain from "@site/static/img/undraw_docusaurus_mountain.svg";
import Tree from "@site/static/img/undraw_docusaurus_tree.svg";
import SaurusReact from "@site/static/img/undraw_docusaurus_react.svg";

const FeatureList: FeatureItem[] = [
  {
    title: "Composable",
    Svg: Mountain,
    description: (
      <Translate>
        Reactors are composable software components with inputs, outputs, and
        local state.
      </Translate>
    ),
  },
  {
    title: "Concurrent",
    Svg: Tree,
    description: (
      <Translate>
        Reactions to events are concurrent unless there is an explicit
        dependency between them.
      </Translate>
    ),
  },
  {
    title: "Deterministic",
    Svg: SaurusReact,
    description: (
      <Translate>
        Lingua Franca programs are deterministic by default and therefore easy
        to test.
      </Translate>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function TwoColumns({
  col1,
  col2,
  alt,
}: {
  col1: ReactElement;
  col2: ReactElement;
  alt?: boolean;
}) {
  return (
    <div className={clsx("container", "section", { sectionAlt: alt })}>
      <div className="row">
        <div className="col col--6">{col1}</div>
        <div className="col col--6">{col2}</div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
