import clsx from 'clsx';
import { useRef, useState } from 'react';
import { SwitchTransition, CSSTransition } from "react-transition-group";

import Translate from '@docusaurus/Translate';

import styles from './styles.module.css';

import { codeHTML, anotherCode } from './codes';

const titles = [
  <Translate>Architect your application in Lingua Franca</Translate>,
  <Translate>Have diagrams rendered as you type</Translate>,
  <Translate>Write reactive code in the language you like</Translate>,
];

import ExampleSVG from '@site/static/img/diagram/SliderExample.svg';

const codes = [
  codeHTML,
  <div className={styles.diagramSVGContainer}>
    <ExampleSVG
      title="Lingua Franca Diagram for the Program"
      role="img"
      className={styles.diagramSVG}
    />
  </div>,
  anotherCode,
];

export const CodeContainer = ({
  className,
}: {
  className: string;
}): JSX.Element => {
  const [page, setPage] = useState(1);
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
