import clsx from 'clsx';
import { useState } from 'react';

import Translate from '@docusaurus/Translate';

import styles from './styles.module.css';

const codeHTML: JSX.Element = (
  <pre
    className="shiki material-theme-darker"
    style={{ backgroundColor: 'transparent', color: '#EEFFFF' }}
    tabIndex={0}
  >
    <code>
      <span className="line">
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}>target</span>
        <span style={{ color: '#89DDFF' }}> C</span>
        <span style={{ color: '#EEFFFF' }}>;</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}>import</span>
        <span style={{ color: '#FFCB6B' }}> Bar</span>
        <span style={{ color: '#EEFFFF' }}>, </span>
        <span style={{ color: '#FFCB6B' }}>Baz</span>
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}> from</span>
        <span style={{ color: '#C3E88D' }}> "External.lf"</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#C792EA' }}>reactor</span>
        <span style={{ color: '#FFCB6B' }}> Foo</span>
        <span style={{ color: '#EEFFFF' }}> {'{'}</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#C792EA' }}>{'    '}timer</span>
        <span style={{ color: '#EEFFFF' }}> t(</span>
        <span style={{ color: '#F78C6C' }}>0</span>
        <span style={{ color: '#EEFFFF' }}>, 10ms)</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#C792EA' }}>{'    '}output</span>
        <span style={{ color: '#EEFFFF' }}> o: </span>
        <span style={{ color: '#C792EA' }}>int</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#C792EA' }}>{'    '}state</span>
        <span style={{ color: '#EEFFFF' }}> s: </span>
        <span style={{ color: '#C792EA' }}>int</span>
        <span style={{ color: '#EEFFFF' }}> = </span>
        <span style={{ color: '#F78C6C' }}>0</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}>
          {'    '}reaction
        </span>
        <span style={{ color: '#EEFFFF' }}>(t) </span>
        <span style={{ color: '#89DDFF' }}>-&gt;</span>
        <span style={{ color: '#EEFFFF' }}> o {'{'}=</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>{'      '}self</span>
        <span style={{ color: '#89DDFF' }}>-&gt;</span>
        <span style={{ color: '#EEFFFF' }}>s</span>
        <span style={{ color: '#89DDFF' }}>++;</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#82AAFF' }}>{'      '}lf_set</span>
        <span style={{ color: '#89DDFF' }}>(</span>
        <span style={{ color: '#EEFFFF' }}>o</span>
        <span style={{ color: '#89DDFF' }}>,</span>
        <span style={{ color: '#EEFFFF' }}> self</span>
        <span style={{ color: '#89DDFF' }}>-&gt;</span>
        <span style={{ color: '#EEFFFF' }}>s</span>
        <span style={{ color: '#89DDFF' }}>);</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>
          {'    '}={'}'}
        </span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>{'}'}</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#C792EA' }}>main</span>
        <span style={{ color: '#C792EA' }}> reactor</span>
        <span style={{ color: '#EEFFFF' }}> {'{'}</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>{'    '}a </span>
        <span style={{ color: '#89DDFF' }}>=</span>
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}> new</span>
        <span style={{ color: '#FFCB6B' }}> Foo</span>
        <span style={{ color: '#EEFFFF' }}>()</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>{'    '}b </span>
        <span style={{ color: '#89DDFF' }}>=</span>
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}> new</span>
        <span style={{ color: '#EEFFFF' }}>[</span>
        <span style={{ color: '#F78C6C' }}>4</span>
        <span style={{ color: '#EEFFFF' }}>] Bar()</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>{'    '}c </span>
        <span style={{ color: '#89DDFF' }}>=</span>
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}> new</span>
        <span style={{ color: '#FFCB6B' }}> Baz</span>
        <span style={{ color: '#EEFFFF' }}>()</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>{'    '}(a</span>
        <span style={{ color: '#89DDFF' }}>.</span>
        <span style={{ color: '#EEFFFF' }}>o)</span>
        <span style={{ color: '#89DDFF' }}>+</span>
        <span style={{ color: '#89DDFF' }}> -&gt;</span>
        <span style={{ color: '#EEFFFF' }}> b</span>
        <span style={{ color: '#89DDFF' }}>.</span>
        <span style={{ color: '#EEFFFF' }}>i</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>{'    '}b</span>
        <span style={{ color: '#89DDFF' }}>.</span>
        <span style={{ color: '#EEFFFF' }}>o </span>
        <span style={{ color: '#89DDFF' }}>-&gt;</span>
        <span style={{ color: '#EEFFFF' }}> c</span>
        <span style={{ color: '#89DDFF' }}>.</span>
        <span style={{ color: '#EEFFFF' }}>i</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>{'}'}</span>
      </span>
    </code>
  </pre>
);

const anotherCode = (
  <pre
    className="shiki material-theme-darker"
    style={{ backgroundColor: 'transparent', color: '#EEFFFF' }}
    tabIndex={0}
  >
    <code>
      <span className="line">
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}>target</span>
        <span style={{ color: '#89DDFF' }}> C</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#C792EA' }}>reactor</span>
        <span style={{ color: '#FFCB6B' }}> Foo</span>
        <span style={{ color: '#EEFFFF' }}> {'{'}</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#C792EA' }}>{'  '}timer</span>
        <span style={{ color: '#EEFFFF' }}> t(</span>
        <span style={{ color: '#F78C6C' }}>0</span>
        <span style={{ color: '#EEFFFF' }}>, 10ms)</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#C792EA' }}>{'  '}output</span>
        <span style={{ color: '#EEFFFF' }}> o: </span>
        <span style={{ color: '#C792EA' }}>int</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#C792EA' }}>{'  '}state</span>
        <span style={{ color: '#EEFFFF' }}> s: </span>
        <span style={{ color: '#C792EA' }}>int</span>
        <span style={{ color: '#EEFFFF' }}> = </span>
        <span style={{ color: '#F78C6C' }}>0</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}>
          {'  '}reaction
        </span>
        <span style={{ color: '#EEFFFF' }}>(t) </span>
        <span style={{ color: '#89DDFF' }}>-&gt;</span>
        <span style={{ color: '#EEFFFF' }}> o {'{'}=</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>{'    '}self</span>
        <span style={{ color: '#89DDFF' }}>-&gt;</span>
        <span style={{ color: '#EEFFFF' }}>s</span>
        <span style={{ color: '#89DDFF' }}>++;</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#82AAFF' }}>{'    '}printf</span>
        <span style={{ color: '#89DDFF' }}>(</span>
        <span style={{ color: '#89DDFF' }}>"</span>
        <span style={{ color: '#C3E88D' }}>115141919810</span>
        <span style={{ color: '#89DDFF' }}>"</span>
        <span style={{ color: '#89DDFF' }}>);</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#82AAFF' }}>{'    '}lf_set</span>
        <span style={{ color: '#89DDFF' }}>(</span>
        <span style={{ color: '#EEFFFF' }}>o</span>
        <span style={{ color: '#89DDFF' }}>,</span>
        <span style={{ color: '#EEFFFF' }}> self</span>
        <span style={{ color: '#89DDFF' }}>-&gt;</span>
        <span style={{ color: '#EEFFFF' }}>s</span>
        <span style={{ color: '#89DDFF' }}>);</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>
          {'  '}={'}'}
        </span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}>
          {'  '}reaction
        </span>
        <span style={{ color: '#EEFFFF' }}>(startup) </span>
        <span style={{ color: '#89DDFF' }}>-&gt;</span>
        <span style={{ color: '#EEFFFF' }}> o {'{'}=</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#82AAFF' }}>{'    '}lf_set</span>
        <span style={{ color: '#89DDFF' }}>(</span>
        <span style={{ color: '#EEFFFF' }}>o</span>
        <span style={{ color: '#89DDFF' }}>,</span>
        <span style={{ color: '#F78C6C' }}> 420</span>
        <span style={{ color: '#89DDFF' }}>);</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>{'    '}self</span>
        <span style={{ color: '#89DDFF' }}>-&gt;</span>
        <span style={{ color: '#EEFFFF' }}>s </span>
        <span style={{ color: '#89DDFF' }}>=</span>
        <span style={{ color: '#F78C6C' }}> 2147483647</span>
        <span style={{ color: '#89DDFF' }}>;</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}>
          {'    '}if
        </span>
        <span style={{ color: '#89DDFF' }}> (</span>
        <span style={{ color: '#F78C6C' }}>0x24</span>
        <span style={{ color: '#89DDFF' }}> ==</span>
        <span style={{ color: '#F78C6C' }}> 0b101001001</span>
        <span style={{ color: '#89DDFF' }}>)</span>
        <span style={{ color: '#89DDFF' }}> {'{'}</span>
        <span style={{ color: '#82AAFF' }}> printf</span>
        <span style={{ color: '#89DDFF' }}>(</span>
        <span style={{ color: '#89DDFF' }}>"</span>
        <span style={{ color: '#C3E88D' }}>smart \n</span>
      </span>
      <span className="line">
        <span style={{ color: '#89DDFF' }}>"</span>
        <span style={{ color: '#89DDFF' }}>);</span>
        <span style={{ color: '#89DDFF' }}> {'}'}</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>
          {'  '}={'}'}
        </span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#EEFFFF' }}>{'}'}</span>
      </span>
    </code>
  </pre>
);

const titles = [
  <Translate>Architect your application in Lingua Franca</Translate>,
  <Translate>Have diagrams rendered as you type</Translate>,
  <Translate>Write reactive code in the language you like</Translate>,
];

import MultiportPlaceholder from '@site/static/img/diagram/Multiport.svg';

const codes = [
  codeHTML,
  <div className={styles.diagramSVGContainer}>
    <MultiportPlaceholder
      title="Lingua Franca Diagram: Multiport"
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
      <div
        className={styles.advance}
        onClick={() => {
          setPage((page) => (page + 1) % 3);
        }}
      >
        {' '}
        -{'>'}{' '}
      </div>
    </div>
  );
};
