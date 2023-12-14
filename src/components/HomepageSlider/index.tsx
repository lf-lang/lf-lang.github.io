import clsx from 'clsx';
import { useRef, useState } from 'react';
import { SwitchTransition, CSSTransition } from "react-transition-group";

import Translate from '@docusaurus/Translate';

import styles from './styles.module.css';

import { main, click, target } from './codes';

const titles = [
  <Translate>Architect your application in Lingua Franca</Translate>,
  <Translate>Have interactive diagrams rendered as you type</Translate>,
  <Translate>Write reactive code in the language you like</Translate>,
];

import RockPaperScissor from '@site/static/img/diagram/rps.svg';
import ElaboratedRPS from  '@site/static/img/diagram/elaborate.svg';
import Link from '@docusaurus/Link';

const codes = [
  <>
    {main}
    <div>{"\n\n\n\n\n"}</div>
    <div className={clsx(styles.diagramSVGContainer, styles.codeAbove)}>
      <RockPaperScissor
        title="Lingua Franca Diagram for the RockPaperScissor Program"
        role="img"
        className={styles.diagramSVG}
      />
    </div>
  </>
  ,
  <>
  {click}
  <div className={clsx(styles.diagramSVGContainer, styles.codeAbove)}>
    <ElaboratedRPS
      title="Lingua Franca Diagram for the RockPaperScissor Program with details shown"
      role="img"
      className={styles.diagramSVG}
    />
  </div>
</>,
  target
];

export const CodeContainer = ({
  className,
}: {
  className?: string;
}): JSX.Element => {
  const [page, setPage] = useState(0);
  const refs = [useRef(null), useRef(null), useRef(null)] as (React.LegacyRef<HTMLDivElement> | undefined)[];

  return (
    <div className={clsx(className, styles.codeContainer)}>
      {' '}
      <div className={clsx(styles.codeContainer, styles.title)}>
        <span>{titles[page]}</span>
      </div>
      <div style={{overflowX: "hidden"}}>
        <SwitchTransition mode={"out-in"}>
            <CSSTransition
              key={page}
              nodeRef={refs[page]}
              addEndListener={(done) => {
                refs[page]!.current.addEventListener("transitionend", done, false);
              }}
              classNames={{
                enter: styles.fadeEnter,
                enterActive: styles.fadeEnterActive,
                exit: styles.fadeExit,
                exitActive: styles.fadeExitActive,
              }}
            >
              <div ref={refs[page]} className={clsx(styles.codeContent)}>
                {codes[page]}
              </div>
            </CSSTransition>
          </SwitchTransition>
      </div>
      <div className={clsx(styles.linkButton)}>
      <Link href="https://gitpod.io/new#https://github.com/lf-lang/playground-lingua-franca/tree/main">
        <img src="https://raw.githubusercontent.com/gitpod-io/gitpod/30da76375c996109f243491b23e47feefab7217f/components/dashboard/public/button/open-in-gitpod.svg" />
      </Link>
    </div>
      <button
        className={clsx(styles.advance, "button", "button--primary")}
        onClick={() => {
          setPage((page) => (page + 1) % 3);
        }}
      >
        <svg width="11" height="15" viewBox="0 0 11 15" fill="#2b3137" xmlns="http://www.w3.org/2000/svg"><path d="M0 14.5V0.5L10.5 7L0 14.5Z"></path></svg>
      </button>
    </div>
  );
};
