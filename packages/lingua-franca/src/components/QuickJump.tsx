import * as React from "react";
import { useIntl } from "react-intl";
import { createInternational } from "../lib/createInternational";
import { docCopy } from "../copy/en/documentation";
import { createIntlLink } from "./IntlLink";

// Automatic metadata from npm and VS Marketplace
import { withPrefix } from "gatsby";

export type Props = {
  title: string;
  lang: string;
};
export const QuickJump = (props: Props) => {
  const intl = useIntl();
  const i = createInternational<typeof docCopy>(intl);
  i;

  let betaURL: string | undefined = undefined;

  const IntlLink = createIntlLink(props.lang);

  // TODO: Internationalize these strings
  return <div className="main-content-block">
    <h2 style={{ textAlign: "center" }}>{props.title}</h2>
    <div className="columns">
      <div className="item raised">
        <h4>Get Started</h4>
        <ul>
          <li>
            <IntlLink to="/docs/handbook/overview">Overview</IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/download">Download and Build</IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/tutorial">Tutorial</IntlLink>
          </li>
          <li>
            <IntlLink to="/publications-and-presentations">
              Publications and Presentations
            </IntlLink>
          </li>
        </ul>
      </div>

      <div className="item raised">
        <h4>Individual Reactors</h4>
        <ul>
          <li>
            <IntlLink to="/docs/handbook/write-reactor-c">Reactor C</IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/write-reactor-c++">Reactor C++</IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/write-reactor-py">Reactor Python</IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/write-reactor-ts">Reactor TypeScript</IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/write-reactor-rust">Reactor Rust</IntlLink>
          </li>
        </ul>
      </div>
    </div>
  </div>;
};
