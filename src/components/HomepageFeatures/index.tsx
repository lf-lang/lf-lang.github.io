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

import Determinism from "@site/static/img/deterministic.svg";
import Timing from "@site/static/img/timing.svg";
import Distribution from "@site/static/img/distribution.svg";

const FeatureList: FeatureItem[] = [
  {
    title: "Deterministic Concurrency",
    Svg: Determinism,
    description: (
      <Translate>
        Lingua Franca offers a straightforward way to write deterministic multi-threaded and distributed applications, eliminating concerns about thread management, synchronization, and race conditions.
      </Translate>
    ),
  },
  {
    title: "Built-in Timing Semantics",
    Svg: Timing,
    description: (
      <Translate>
        Timing is embedded within Lingua Franca's core, empowering developers to handle time-sensitive tasks with precision and without the complex timing logic typically required in concurrent programming.
      </Translate>
    ),
  },
  {
    title: "Simplified Distribution",
    Svg: Distribution,
    description: (
      <Translate>
        Lingua Franca enables seamless transition from single to distributed system architectures with minimal modifications, abstracting away the complexities of distributed systems programming.
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
    <div className={clsx("section", { sectionAlt: alt })}>
      <div className="container">
        <div className="row">
          <div className="col col--6">{col1}</div>
          <div className="col col--6">{col2}</div>
        </div>
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
