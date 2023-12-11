export const main: JSX.Element = (<pre
  className="shiki material-theme-darker"
  style={{ backgroundColor: "transparent", color: "#EEFFFF" }}
  tabIndex={0}
>
  <code>
    <span className="line">
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}>import</span>
      <span style={{ color: "#FFCB6B" }}> Player</span>
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}> from</span>
      <span style={{ color: "#C3E88D" }}> "../Player.lf"</span>
    </span>
    <br /><br />
    <span className="line">
      <span style={{ color: "#C792EA" }}>main</span>
      <span style={{ color: "#C792EA" }}> reactor</span>
      <span style={{ color: "#FFCB6B" }}> RockPaperScissors</span>
      <span style={{ color: "#EEFFFF" }}> {"{"}</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#EEFFFF" }}>{"  "}player1 </span>
      <span style={{ color: "#89DDFF" }}>=</span>
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}> new</span>
      <span style={{ color: "#FFCB6B" }}> Player</span>
      <span style={{ color: "#EEFFFF" }}>(id</span>
      <span style={{ color: "#89DDFF" }}>=</span>
      <span style={{ color: "#F78C6C" }}>2</span>
      <span style={{ color: "#EEFFFF" }}>)</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#EEFFFF" }}>{"  "}player2 </span>
      <span style={{ color: "#89DDFF" }}>=</span>
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}> new</span>
      <span style={{ color: "#FFCB6B" }}> Player</span>
      <span style={{ color: "#EEFFFF" }}>(id</span>
      <span style={{ color: "#89DDFF" }}>=</span>
      <span style={{ color: "#F78C6C" }}>1</span>
      <span style={{ color: "#EEFFFF" }}>)</span>
    </span>
    <br />
    <span className="line" />
    <br />
    <span className="line">
      <span style={{ color: "#EEFFFF" }}>{"  "}player2</span>
      <span style={{ color: "#89DDFF" }}>.</span>
      <span style={{ color: "#EEFFFF" }}>reveal </span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}> player1</span>
      <span style={{ color: "#89DDFF" }}>.</span>
      <span style={{ color: "#EEFFFF" }}>observe</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#EEFFFF" }}>{"  "}player1</span>
      <span style={{ color: "#89DDFF" }}>.</span>
      <span style={{ color: "#EEFFFF" }}>reveal </span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}> player2</span>
      <span style={{ color: "#89DDFF" }}>.</span>
      <span style={{ color: "#EEFFFF" }}>observe</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#EEFFFF" }}>{"}"}</span>
    </span>
  </code>
</pre>
);

export const click = (<pre
  className="shiki material-theme-darker"
  style={{ backgroundColor: "transparent", color: "#EEFFFF", width: "100%" }}
  tabIndex={0}
>
  <code>
    <span className="line">
      <span style={{ color: "#C792EA" }}>reactor</span>
      <span style={{ color: "#FFCB6B" }}> Player</span>
      <span style={{ color: "#EEFFFF" }}>(id: </span>
      <span style={{ color: "#C792EA" }}>char</span>
      <span style={{ color: "#89DDFF" }}> =</span>
      <span style={{ color: "#F78C6C" }}> 0</span>
      <span style={{ color: "#EEFFFF" }}>) {"{"}</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#C792EA" }}>{"  "}input</span>
      <span style={{ color: "#EEFFFF" }}> observe: </span>
      <span style={{ color: "#C792EA" }}>symbol_t</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#C792EA" }}>{"  "}output</span>
      <span style={{ color: "#EEFFFF" }}> reveal: </span>
      <span style={{ color: "#C792EA" }}>symbol_t</span>
    </span>
    <br />
    <span className="line" style={{"backgroundColor": "#000080"}}>
      <span style={{ color: "#C792EA" }}>{"  "}logical</span>
      <span style={{ color: "#C792EA" }}> action</span>
      <span style={{ color: "#EEFFFF" }}> repeat(</span>
      <span style={{ color: "#F78C6C" }}>1</span>
      <span style={{ color: "#F78C6C" }}> sec</span>
      <span style={{ color: "#EEFFFF" }}>)</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#C792EA" }}>{"  "}state</span>
      <span style={{ color: "#EEFFFF" }}> choice: </span>
      <span style={{ color: "#C792EA" }}>symbol_t</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}>
        {"  "}reaction
      </span>
      <span style={{ color: "#EEFFFF" }}>(startup) {"{"}</span>
      <span style={{ color: "#89DDFF" }}>=</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#545454", fontStyle: "italic" }}>
        {"    "}// Reaction code
      </span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#89DDFF" }}>{"  "}=</span>
      <span style={{ color: "#EEFFFF" }}>{"}"}</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#EEFFFF" }}>{"}"}</span>
    </span>
  </code>
</pre>
);

export const target = (<pre
  className="shiki material-theme-darker"
  style={{ backgroundColor: "transparent", color: "#EEFFFF" }}
  tabIndex={0}
>
  <code>
    <span className="line">
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}>target</span>
      <span style={{ color: "#89DDFF" }}> C</span>
      <span style={{ color: "#EEFFFF" }}>;</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#C792EA" }}>reactor</span>
      <span style={{ color: "#FFCB6B" }}> Player</span>
      <span style={{ color: "#EEFFFF" }}>(id: </span>
      <span style={{ color: "#C792EA" }}>char</span>
      <span style={{ color: "#89DDFF" }}> =</span>
      <span style={{ color: "#F78C6C" }}> 0</span>
      <span style={{ color: "#EEFFFF" }}>) {"{"}</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}>
        {"  "}preamble
      </span>
      <span style={{ color: "#EEFFFF" }}> {"{"}=</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#C792EA" }}>{"    "}const</span>
      <span style={{ color: "#C792EA" }}> char</span>
      <span style={{ color: "#89DDFF" }}>*</span>
      <span style={{ color: "#EEFFFF" }}> symbol_names[] </span>
      <span style={{ color: "#89DDFF" }}>=</span>
      <span style={{ color: "#89DDFF" }}> {"{"}</span>
      <span style={{ color: "#89DDFF" }}>"</span>
      <span style={{ color: "#C3E88D" }}>paper</span>
      <span style={{ color: "#89DDFF" }}>"</span>
      <span style={{ color: "#89DDFF" }}>,</span>
      <span style={{ color: "#89DDFF" }}> "</span>
      <span style={{ color: "#C3E88D" }}>rock</span>
      <span style={{ color: "#89DDFF" }}>"</span>
      <span style={{ color: "#89DDFF" }}>,</span>
      <span style={{ color: "#89DDFF" }}> "</span>
      <span style={{ color: "#C3E88D" }}>scissors</span>
      <span style={{ color: "#89DDFF" }}>"</span>
      <span style={{ color: "#89DDFF" }}>{"}"};</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#EEFFFF" }}>
        {"  "}={"}"}
      </span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}>
        {"  "}reaction
      </span>
      <span style={{ color: "#EEFFFF" }}>(startup, repeat) </span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}> reveal {"{"}=</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#EEFFFF" }}>{"    "}self</span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}>choice </span>
      <span style={{ color: "#89DDFF" }}>=</span>
      <span style={{ color: "#82AAFF" }}> rand</span>
      <span style={{ color: "#89DDFF" }}>()</span>
      <span style={{ color: "#89DDFF" }}> %</span>
      <span style={{ color: "#F78C6C" }}> 3</span>
      <span style={{ color: "#89DDFF" }}>;</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#82AAFF" }}>{"    "}lf_set</span>
      <span style={{ color: "#89DDFF" }}>(</span>
      <span style={{ color: "#EEFFFF" }}>reveal</span>
      <span style={{ color: "#89DDFF" }}>,</span>
      <span style={{ color: "#EEFFFF" }}> self</span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}>choice</span>
      <span style={{ color: "#89DDFF" }}>);</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#EEFFFF" }}>
        {"  "}={"}"}
      </span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}>
        {"  "}reaction
      </span>
      <span style={{ color: "#EEFFFF" }}>(observe) </span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}> repeat {"{"}=</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}>{"    "}if</span>
      <span style={{ color: "#89DDFF" }}> (</span>
      <span style={{ color: "#EEFFFF" }}>observe</span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}>value </span>
      <span style={{ color: "#89DDFF" }}>==</span>
      <span style={{ color: "#EEFFFF" }}> self</span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}>choice</span>
      <span style={{ color: "#89DDFF" }}>)</span>
      <span style={{ color: "#89DDFF" }}> {"{"}</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#82AAFF" }}>{"      "}printf</span>
      <span style={{ color: "#89DDFF" }}>(</span>
      <span style={{ color: "#89DDFF" }}>"</span>
      <span style={{ color: "#C3E88D" }}>Player %d declares a tie.\n</span>
    </span>
    <span className="line">
      <span style={{ color: "#89DDFF" }}>"</span>
      <span style={{ color: "#89DDFF" }}>,</span>
      <span style={{ color: "#EEFFFF" }}> self</span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}>id</span>
      <span style={{ color: "#89DDFF" }}>);</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#82AAFF" }}>{"      "}lf_schedule</span>
      <span style={{ color: "#89DDFF" }}>(</span>
      <span style={{ color: "#F07178" }}>repeat</span>
      <span style={{ color: "#89DDFF" }}>,</span>
      <span style={{ color: "#F78C6C" }}> 0</span>
      <span style={{ color: "#89DDFF" }}>);</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#89DDFF" }}>
        {"    "}
        {"}"}
      </span>
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}> else</span>
      <span style={{ color: "#89DDFF", fontStyle: "italic" }}> if</span>
      <span style={{ color: "#89DDFF" }}> (</span>
      <span style={{ color: "#EEFFFF" }}>observe</span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}>value </span>
      <span style={{ color: "#89DDFF" }}>==</span>
      <span style={{ color: "#89DDFF" }}> (</span>
      <span style={{ color: "#EEFFFF" }}>self</span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}>choice </span>
      <span style={{ color: "#89DDFF" }}>+</span>
      <span style={{ color: "#F78C6C" }}> 1</span>
      <span style={{ color: "#89DDFF" }}>)</span>
      <span style={{ color: "#89DDFF" }}> %</span>
      <span style={{ color: "#F78C6C" }}> 3</span>
      <span style={{ color: "#89DDFF" }}>)</span>
      <span style={{ color: "#89DDFF" }}> {"{"}</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#82AAFF" }}>{"      "}printf</span>
      <span style={{ color: "#89DDFF" }}>(</span>
      <span style={{ color: "#89DDFF" }}>"</span>
      <span style={{ color: "#C3E88D" }}>Player %d won!\n</span>
    </span>
    <span className="line">
      <span style={{ color: "#89DDFF" }}>"</span>
      <span style={{ color: "#89DDFF" }}>,</span>
      <span style={{ color: "#EEFFFF" }}> self</span>
      <span style={{ color: "#89DDFF" }}>-&gt;</span>
      <span style={{ color: "#EEFFFF" }}>id</span>
      <span style={{ color: "#89DDFF" }}>);</span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#89DDFF" }}>
        {"    "}
        {"}"}
      </span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#EEFFFF" }}>
        {"  "}={"}"}
      </span>
    </span>
    <br />
    <span className="line">
      <span style={{ color: "#EEFFFF" }}>{"}"}</span>
    </span>
  </code>
</pre>

);