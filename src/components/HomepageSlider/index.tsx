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
        <span style={{ color: '#C792EA' }}>reactor</span>
        <span style={{ color: '#FFCB6B' }}> Adder</span>
        <span style={{ color: '#EEFFFF' }}> {'{'}</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#C792EA' }}>{'    '}input</span>
        <span style={{ color: '#EEFFFF' }}>[4] i: </span>
        <span style={{ color: '#C792EA' }}>int</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}>
          {'    '}reaction
        </span>
        <span style={{ color: '#EEFFFF' }}>(i) {'{'}=</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#C792EA' }}>{'      '}int</span>
        <span style={{ color: '#EEFFFF' }}> sum </span>
        <span style={{ color: '#89DDFF' }}>=</span>
        <span style={{ color: '#EEFFFF' }}> i</span>
        <span style={{ color: '#89DDFF' }}>[</span>
        <span style={{ color: '#F78C6C' }}>0</span>
        <span style={{ color: '#89DDFF' }}>]-&gt;</span>
        <span style={{ color: '#EEFFFF' }}>value</span>
        <span style={{ color: '#89DDFF' }}>;</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#89DDFF', fontStyle: 'italic' }}>
          {'      '}for
        </span>
        <span style={{ color: '#89DDFF' }}> (</span>
        <span style={{ color: '#C792EA' }}>int</span>
        <span style={{ color: '#EEFFFF' }}> j</span>
        <span style={{ color: '#89DDFF' }}>=</span>
        <span style={{ color: '#F78C6C' }}>1</span>
        <span style={{ color: '#89DDFF' }}>;</span>
        <span style={{ color: '#EEFFFF' }}> j </span>
        <span style={{ color: '#89DDFF' }}>&lt;</span>
        <span style={{ color: '#EEFFFF' }}> i_width</span>
        <span style={{ color: '#89DDFF' }}>;</span>
        <span style={{ color: '#EEFFFF' }}> j</span>
        <span style={{ color: '#89DDFF' }}>++)</span>
        <span style={{ color: '#89DDFF' }}> {'{'}</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#F07178' }}>{'        '}sum </span>
        <span style={{ color: '#89DDFF' }}>+=</span>
        <span style={{ color: '#EEFFFF' }}> i</span>
        <span style={{ color: '#89DDFF' }}>[</span>
        <span style={{ color: '#F07178' }}>j</span>
        <span style={{ color: '#89DDFF' }}>]-&gt;</span>
        <span style={{ color: '#EEFFFF' }}>value</span>
        <span style={{ color: '#89DDFF' }}>;</span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#89DDFF' }}>
          {'      '}
          {'}'}
        </span>
      </span>
      <br />
      <span className="line">
        <span style={{ color: '#82AAFF' }}>{'      '}printf</span>
        <span style={{ color: '#89DDFF' }}>(</span>
        <span style={{ color: '#89DDFF' }}>"</span>
        <span style={{ color: '#C3E88D' }}>Sum: %d\n</span>
      </span>
      <span className="line">
        <span style={{ color: '#89DDFF' }}>"</span>
        <span style={{ color: '#89DDFF' }}>,</span>
        <span style={{ color: '#EEFFFF' }}> sum</span>
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
    </code>
  </pre>
);

export const CodeContainer = ({
  className,
}: {
  className: string;
}): JSX.Element => {
  return (
    <div
      style={{
        minWidth: '600px',
        minHeight: '337px',
        backgroundColor: '#10425D',
        fontSize: '1rem',
        borderRadius: "1rem"
      }}
      className={className}
    >
      {codeHTML}
    </div>
  );
};
