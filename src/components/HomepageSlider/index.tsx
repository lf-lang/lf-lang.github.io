const highlightedCode = (
<pre
  className="shiki material-theme-lighter"
  style={{ backgroundColor: "#FAFAFA", color: "#90A4AE" }}
  tabIndex={0}
>
  <code>
    <span className="line hide-lf-only">
      <span style={{ color: "#39ADB5", fontStyle: "italic" }}>target</span>
      <span style={{ color: "#39ADB5" }}> C</span>
      <span style={{ color: "#90A4AE" }}>;</span>
    </span>
    {"\n"}
    <span className="line hide-lf-only">
      <span style={{ color: "#9C3EDA" }}>main</span>
      <span style={{ color: "#9C3EDA" }}> reactor</span>
      <span style={{ color: "#E2931D" }}> Alignment</span>
      <span style={{ color: "#90A4AE" }}> {"{"}</span>
    </span>
    {"\n"}
    <span className="line hide-lf-only">
      <span style={{ color: "#9C3EDA" }}>{"  "}state</span>
      <span style={{ color: "#90A4AE" }}> s: </span>
      <span style={{ color: "#9C3EDA" }}>int</span>
      <span style={{ color: "#90A4AE" }}> = </span>
      <span style={{ color: "#F76D47" }}>0</span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#9C3EDA" }}>{"  "}timer</span>
      <span style={{ color: "#90A4AE" }}> t1(</span>
      <span style={{ color: "#F76D47" }}>100</span>
      <span style={{ color: "#F76D47" }}> msec</span>
      <span style={{ color: "#90A4AE" }}>, </span>
      <span style={{ color: "#F76D47" }}>100</span>
      <span style={{ color: "#F76D47" }}> msec</span>
      <span style={{ color: "#90A4AE" }}>)</span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#39ADB5", fontStyle: "italic" }}>
        {"  "}reaction
      </span>
      <span style={{ color: "#90A4AE" }}>(t1) {"{"}=</span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#6182B8" }}>{"    "}printf</span>
      <span style={{ color: "#39ADB5" }}>(</span>
      <span style={{ color: "#39ADB5" }}>"</span>
      <span style={{ color: "#91B859" }}>%d</span>
      <span style={{ color: "#39ADB5" }}>"</span>
      <span style={{ color: "#39ADB5" }}>,</span>
      <span style={{ color: "#90A4AE" }}> self</span>
      <span style={{ color: "#39ADB5" }}>-&gt;</span>
      <span style={{ color: "#90A4AE" }}>s</span>
      <span style={{ color: "#39ADB5" }}>);</span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#90A4AE" }}>{"    "}self</span>
      <span style={{ color: "#39ADB5" }}>-&gt;</span>
      <span style={{ color: "#90A4AE" }}>s </span>
      <span style={{ color: "#39ADB5" }}>+=</span>
      <span style={{ color: "#F76D47" }}> 1</span>
      <span style={{ color: "#39ADB5" }}>;</span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#90A4AE" }}>
        {"  "}={"}"}
      </span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#39ADB5", fontStyle: "italic" }}>
        {"  "}reaction
      </span>
      <span style={{ color: "#90A4AE" }}>(t2) {"{"}=</span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#90A4AE" }}>{"    "}self</span>
      <span style={{ color: "#39ADB5" }}>-&gt;</span>
      <span style={{ color: "#90A4AE" }}>s </span>
      <span style={{ color: "#39ADB5" }}>-=</span>
      <span style={{ color: "#F76D47" }}> 2</span>
      <span style={{ color: "#39ADB5" }}>;</span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#90A4AE" }}>
        {"  "}={"}"}
      </span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#39ADB5", fontStyle: "italic" }}>
        {"  "}reaction
      </span>
      <span style={{ color: "#90A4AE" }}>(t4) {"{"}=</span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#6182B8" }}>{"    "}printf</span>
      <span style={{ color: "#39ADB5" }}>(</span>
      <span style={{ color: "#39ADB5" }}>"</span>
      <span style={{ color: "#91B859" }}>s = %d</span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#39ADB5" }}>"</span>
      <span style={{ color: "#39ADB5" }}>,</span>
      <span style={{ color: "#90A4AE" }}> self</span>
      <span style={{ color: "#39ADB5" }}>-&gt;</span>
      <span style={{ color: "#90A4AE" }}>s</span>
      <span style={{ color: "#39ADB5" }}>);</span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#90A4AE" }}>
        {"  "}={"}"}
      </span>
    </span>
    {"\n"}
    <span className="line">
      <span style={{ color: "#90A4AE" }}>{"}"}</span>
    </span>
  </code>
</pre>
);