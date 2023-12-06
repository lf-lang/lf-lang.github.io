import Translate from "@docusaurus/Translate";

const codeHTML: JSX.Element = (
    <pre
    className="shiki material-theme-darker"
    style={{ backgroundColor: "transparent", color: "#EEFFFF" }}
    tabIndex={0}
    >
    <code>
    <span style={{ color: "#89DDFF", fontStyle: "italic" }}>target</span>
      <span style={{ color: "#EEFFFF" }}>
        {" "}C
      </span>
      <br/>
    <span style={{ color: "#EEFFFF" }}>
        import B, C from "Foo.lf"
      </span>
      <br/>
    <span style={{ color: "#EEFFFF" }}>
        reactor A {"{"}
    </span>
    <br/>
    <span style={{ color: "#C792EA" }}>{"    "}timer</span>
      <span style={{ color: "#EEFFFF" }}> t(</span>
      <span style={{ color: "#F78C6C" }}>0</span>
      <span style={{ color: "#EEFFFF" }}>, 10ms)</span>
      <br/>
      <span style={{ color: "#C792EA" }}>{"    "}output</span>
      <span style={{ color: "#EEFFFF" }}> o: </span>
      <span style={{ color: "#C792EA" }}>int</span>
      <br/>
      <span style={{ color: "#C792EA" }}>{"    "}state</span>
      <span style={{ color: "#C792EA" }}> s</span>
      <span style={{ color: "#EEFFFF" }}>: </span>
      <span style={{ color: "#C792EA" }}>int</span>
      <span style={{ color: "#89DDFF" }}> =</span>
      <span style={{ color: "#F78C6C" }}> 0</span>
      <br/>
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}>
        {"    "}reaction
      </span>
      <span style={{ color: "#EEFFFF" }}>(t) </span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}> o {"{="}</span>
      <br/>
      
      <span style={{ color: "#EEFFFF" }}>{"      "}self</span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}>s</span>
      <span style={{ color: "#89DDFF" }}>++</span>
      <span style={{ color: "#EEFFFF" }}>;</span>
      <br/>
      <span style={{ color: "#EEFFFF" }}>{"      "}lf_set(o, self</span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}>s);</span>
      <br/>
      <span style={{ color: "#EEFFFF" }}>{"    "}</span>
      <span style={{ color: "#89DDFF" }}>=</span>
      <span style={{ color: "#EEFFFF" }}>
        {"}"}
      <br/>
        {"}"}
      </span>
      <br/>  
        <span style={{ color: "#C792EA" }}>main</span>
        <span style={{ color: "#C792EA" }}> reactor</span>
        <span style={{ color: "#EEFFFF" }}>
            {" "}
            {"{"}
            <br/>
            {"    "}a{" "}
        </span>
        <span style={{ color: "#89DDFF" }}>=</span>
        <span style={{ color: "#89DDFF", fontStyle: "italic" }}> new</span>
        <span style={{ color: "#FFCB6B" }}> A</span>
        <span style={{ color: "#EEFFFF" }}>()
        <br/>
        {"    "}b </span>
        <span style={{ color: "#89DDFF" }}>=</span>
        <span style={{ color: "#89DDFF", fontStyle: "italic" }}> new</span>
        <span style={{ color: "#EEFFFF" }}>[</span>
        <span style={{ color: "#F78C6C" }}>4</span>
        <span style={{ color: "#EEFFFF" }}>] B()
        <br/>
        {"    "}c </span>
        <span style={{ color: "#89DDFF" }}>=</span>
        <span style={{ color: "#89DDFF", fontStyle: "italic" }}> new</span>
        <span style={{ color: "#FFCB6B" }}> C</span>
        <span style={{ color: "#EEFFFF" }}>()
        <br/>
        {"    "}(a</span>
        <span style={{ color: "#89DDFF" }}>.</span>
        <span style={{ color: "#EEFFFF" }}>o)</span>
        <span style={{ color: "#89DDFF" }}>+</span>
        <span style={{ color: "#89DDFF" }}> -&gt;</span>
        <span style={{ color: "#EEFFFF" }}> b</span>
        <span style={{ color: "#89DDFF" }}>.</span>
        <span style={{ color: "#EEFFFF" }}>i
        <br/>
        {"    "}b</span>
        <span style={{ color: "#89DDFF" }}>.</span>
        <span style={{ color: "#EEFFFF" }}>o </span>
        <span style={{ color: "#89DDFF" }}>-&gt;</span>
        <span style={{ color: "#EEFFFF" }}> c</span>
        <span style={{ color: "#89DDFF" }}>.</span>
        <span style={{ color: "#EEFFFF" }}>i
        <br/>
        {"}"}</span>
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
        borderRadius: ".5rem",
        padding: 0,
      }}
      className={className}
    > <div
        style={{
          borderRadius: ".5rem .5rem 0     0",
          fontSize: "1.2rem",
          color: "white",
          backgroundColor: "#242526",
      }}>
        <span style={{
            padding: "1rem"
        }}>
            <Translate>
            Architect your application in Lingua Franca
            </Translate>
        </span>
        </div>
      {codeHTML}
    </div>
  );
};
