import clsx from 'clsx';
import { useState } from 'react';

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

  return (
    <div className={clsx(className, styles.codeContainer)}>
      {' '}
      <div className={clsx(styles.codeContainer, styles.title)}>
        <span>{titles[page]}</span>
      </div>
      <div className={clsx(styles.codeContent, styles.fadeIn)}>
        {codes[page]}
      </div>
      <button
        className={styles.advance}
        onClick={() => {
          setPage((page) => (page + 1) % 3);
        }}
      >
        <svg width="11" height="15" viewBox="0 0 11 15" fill="#2b3137" xmlns="http://www.w3.org/2000/svg"><path d="M0 14.5V0.5L10.5 7L0 14.5Z"></path></svg>
      </button>
    </div>
  );
};
