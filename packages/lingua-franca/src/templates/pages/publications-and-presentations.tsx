import * as React from "react"
import { createIntlLink } from "../../components/IntlLink"
import { Intl } from "../../components/Intl"
import { Layout } from "../../components/layout"
import { QuickJump } from "../../components/QuickJump"


type Props = {
  pageContext: any
  b: NewableFunction
}

const changeExample = (code: string) => document.getElementById("code-example")!.textContent = code
const changeExample2 = (code: string) => document.getElementById("code-run")!.textContent = code

const Index: React.FC<Props> = (props) => {
  const Link = createIntlLink(props.pageContext.lang)

  return <Layout title="Published Papers" description="Academic publications in reverse-chronological order" lang={props.pageContext.lang}>
    <div className="raised main-content-block">
    <p><i>Note: Lingua Franca is an evolving language, and the older papers below may use a syntax that does not match the current syntax. Nevertheless, these papers are useful for understanding the principles.</i></p>
    <h2 id="published-papers">Published Papers</h2>

<p>In reverse chronological order: </p>
<ul>
<li><p><strong>LET&#39;23</strong>: Edward A. Lee and Marten Lohstroh, &quot;<a href="https://www.icyphy.org/publications/2023_LeeLohstroh/">Generalizing Logical Execution Time</a>,&quot; in <i>Principles of Systems Design - Essays Dedicated to Thomas A. Hensinzer on the Occasion of his 60th Birthday</i>, LNCS 13660, July 2023, to appear.</p>
</li>
<li><p><strong>CAL_IC&#39;23</strong>: Edward A. Lee, Soroush Bateni, Shaokai Lin, Marten Lohstroh, and Christian Menard,  &quot;<a href="https://doi.org/10.34133/icomputing.0013">Trading Off Consistency and Availability in Tiered Heterogeneous Distributed Systems</a>,&quot; Intelligent Computing, vol. 2, no. Article 0013, pp. 1-23, February 15 2023.</p>
</li>
<li><p><strong>Modes&#39;23</strong>: Alexander Schulz-Rosengarten, Reinhard von Hanxleden,Marten Lohstroh, Soroush Bateni, Edward A. Lee, &quot;<a href="https://arxiv.org/abs/2301.09597">Modal Reactors</a>,&quot; arXiv:2301.09597 [cs.PL], January 23, 2023.</p>
</li>
<li><p><strong>CAL&#39;23</strong>: Edward A. Lee, Ravi Akella, Soroush Bateni, Shaokai Lin, Marten Lohstroh, Christian Menard, &quot;<a href="https://arxiv.org/abs/2301.08906">Consistency vs. Availability in Distributed Real-Time Systems</a>,&quot; arXiv:2301.08906 [cs.DC], January 21, 2023.</p>
</li>
<li><p><strong>NG-RES&#39;23</strong>: Erling Rennemo Jellum, Shaokai Lin, Peter Donovan, Efsane Soyer, Fuzail Shakir, Torleiv Bryne, Milica Orlandic, Marten Lohstroh, Edward A. Lee, &quot;<a href="https://doi.org/10.4230/OASIcs.NG-RES.2023.3">Beyond the Threaded Programming Model on Real-Time Operating Systems</a>,&quot; Workshop on Next Generation Real-Time Embedded Systems (NG-RES), January 18 2023.</p>
</li>
<li><p><strong>Perf&#39;23</strong>: Christian Menard, Marten Lohstroh, Soroush Bateni, Matthew Chorlian, Arthur Deng, Peter Donovan, Clément Fournier, Shaokai Lin, Felix Suchert, Tassilo Tanneberger, Hokeun Kim, Jeronimo Castrillon and Edward A. Lee, "<a href="https://arxiv.org/abs/2301.02444">High-Performance Deterministic Concurrency using Lingua Franca</a>,&quot; arXiv:2301.02444 [cs.PL], Jan. 9, 2023</p>
</li>
<li><p><strong>Xronos&#39;22</strong>: Soroush Bateni, Marten Lohstroh, Hou Seng Wong, Rohan Tabish, Hokeun Kim, Shaokai Lin, Christian Menard, Cong Liu, and Edward A. Lee, "<a href="https://arxiv.org/abs/2207.09555">Xronos: Predictable Coordination for Safety-Critical Distributed Embedded Systems</a>,&quot;	arXiv:2207.09555 [cs.DC], July 19, 2022.</p>
</li>
<li><p><strong>ISoLA&#39;21</strong>: Edward A. Lee and Marten Lohstroh, &quot;<a href="https://doi.org/10.1007/978-3-030-89159-6_15">Time for All Programs, Not Just Real-Time Programs</a>,&quot; Proc. Int. Symp. on Leveraging Applications of Formal Methods (ISoLA), Rhodes, Greece, October 17-29, 2021.</p>
</li>
<li><p><strong>CAL&#39;21</strong>: Edward A. Lee, Soroush Bateni, Shaokai Lin, Marten Lohstroh, Christian Menard, &quot;<a href="https://arxiv.org/abs/2109.07771">Quantifying and Generalizing the CAP Theorem</a>,&quot; arXiv:2109.07771 [cs.DC], Sep. 16, 2021.</p>
</li>
<li><p><strong>TECS&#39;21</strong>: Marten Lohstroh, Christian Menard, Soroush Bateni, and Edward A. Lee, &quot;<a href="https://dl.acm.org/doi/10.1145/3448128">Toward a Lingua Franca for Deterministic Concurrent Systems</a>,&quot; <em>ACM Transactions on Embedded Computing Systems</em> (TECS), 20(4), May 2021.</p>
</li>
<li><p><strong>Doctoral Thesis</strong>: Marten Lohstroh, &quot;<a href="https://www2.eecs.berkeley.edu/Pubs/TechRpts/2020/EECS-2020-235.html">Reactors: A Deterministic Model of Concurrent Computation for Reactive Systems</a>&quot;, UC Berkeley, EECS Department.</p>
</li>
<li><p><strong>FDL&#39;20:</strong> Marten Lohstroh, Christian Menard, Alexander Schulz-Rosengarten, Matthew Weber, Jeronimo Castrillon, Edward A. Lee, &quot;<a href="https://people.eecs.berkeley.edu/~marten/pdf/Lohstroh_etAl_FDL20.pdf">A Language for Deterministic Coordination Across Multiple Timelines</a>,&quot; Forum on Design Languages (FDL), Kiel, Germany, September, 2020.</p>
</li>
<li><p><strong>DATE&#39;20:</strong> Christian Menard, Andrés Goens, Marten Lohstroh, Jeronimo Castrillon, &quot;<a href="https://arxiv.org/pdf/1912.01367">Achieving Determinism in Adaptive AUTOSAR</a>,&quot; Proceedings of the 2020 Design, Automation and Test in Europe Conference (DATE), EDA Consortium, Mar 2020, doi: <a href="https://doi.org/10.23919/DATE48585.2020.9116430">10.23919/DATE48585.2020.9116430</a>.</p>
</li>
<li><p><strong>RTSS&#39;19:</strong> Marten Lohstroh and Edward A. Lee, &quot;<a href="https://ieeexplore.ieee.org/document/9052189">Work-in-Progress: Real-Time Reactors in C</a>,&quot; Proceedings of the Real-Time Systems Symposium (RTSS), Hong Kong, Dec. 2019. doi: <a href="https://doi.org/10.1109/RTSS46320.2019.00067">10.1109/RTSS46320.2019.00067</a>.</p>
</li>
<li><p><strong>CyPhy&#39;19:</strong> Marten Lohstroh, I&ntilde;igo Incer Romeo, Andr&eacute;s Goens, Patricia Derler, Jeronimo Castrillon, Edward A. Lee, and Alberto Sangiovanni-Vincentelli, &quot;<a href="https://people.eecs.berkeley.edu/~marten/pdf/Lohstroh_etAl_CyPhy19.pdf">Reactors: A Deterministic Model for Composable Reactive Systems</a>,&quot; Model-Based Design of Cyber Physical Systems (CyPhy&#39;19), Held in conjunction with ESWEEK 2019, New York, NY, Oct. 17-18, 2019.</p>
</li>
<li><p><strong>EMSOFT&#39;19:</strong> Marten Lohstroh, Martin Schoeberl, Mathieu Jan, Edward Wang, Edward A. Lee &quot;<a href="https://ptolemy.berkeley.edu/publications/papers/19/LohstrohEtAl_IroncladTiming_EMSOFT_2019.pdf">Work-in-Progress: Programs with Ironclad Timing Guarantees</a>,&quot; ACM SIGBED International Conference on Embedded Software (EMSOFT), New York, NY, October 13-18, 2019.</p>
</li>
<li><p><strong>FDL&#39;19:</strong> Marten Lohstroh and Edward A. Lee, &quot;<a href="https://ptolemy.berkeley.edu/publications/papers/19/Lohstroh_Lee_DeterministicActors_FDL_2019.pdf">Deterministic Actors</a>,&quot; Forum on Design Languages (FDL), Southampton, UK, September, 2019.</p>
</li>
<li><p><strong>DAC&#39;19</strong> Marten Lohstroh, Martin Schoeberl, Andres Goens, Armin Wasicek, Christopher Gill, Marjan Sirjani, Edward A. Lee, &quot;<a href="https://ptolemy.berkeley.edu/publications/papers/19/LohstrohEtAl_Reactors_DAC_2019.pdf">Invited: Actors Revisited for Time-Critical Systems</a>,&quot; Design Automation Conference (DAC), June, 2019.</p>
</li>
</ul>
<h2 id="presentations">Presentations</h2>
<ul>
<li><p><a href="https://youtu.be/WlQ8oXG1K8c">Time for All Programs, Not Just Real-Time Programs</a>, invited talk by Edward A. Lee,  Oct. 25 2021, ISoLA, Rhodes, Greece</p>
</li>
<li><p><a href="https://github.com/lf-lang/lingua-franca/wiki/Tutorial">Video recordings</a> of a four-hour Lingua Franca Tutorial offered at EMSOFT, Oct. 8, 2021.</p>
</li>
<li><p><a href="https://www.youtube.com/watch?v=vMIrJgZz4G8">Video recording</a> of talk by Marten Lohstroh on &quot;<a href="https://www.tecosa.center.kth.se/event/tecosa-seminar-deterministic-reactive-software-for-embedded-edge-and-cloud-systems/">Deterministic Reactive Software for Embedded, Edge, and Cloud Systems</a>,&quot; at KTH, Center for Trustworthy Edge Computing Systems and Applications (TECoSA), June 3, 2021.</p>
</li>
<li><p><a href="https://youtu.be/46OXz55qhFA">Video recording</a> of talk by Efsane Soyer on &quot;[Hardware-Supported Timing-Critical Software in Lingua Franca,&quot; at <a href="https://cps-vo.org/group/cps-pimtg21/program-agenda">NSF CPS PI Meeting</a>, June 2, 2021. (<strong>Received best graduate student presentation award!</strong>)</p>
</li>
<li><p><a href="https://www.youtube.com/watch?v=6YBtnBO7wdg">Video recording</a> of talk by Marten Lohstroh on Making Mainstream Programming Languages Deterministic Again, at 27th International Open Workshop on Synchronous Programming (Synchron), November 25-27, 2020</p>
</li>
<li><p>Marten Lohstroh, Christian Menard, Alexander Schulz-Rosengarten, Matthew Weber, Jeronimo Castrillon, Edward A. Lee, &quot;<a href="https://github.com/lf-lang/website-lingua-franca/tree/main/packages/lingua-franca/static/assets/slides/Lohstroh_etAl_FDL20.pdf">A Language for Deterministic Coordination Across Multiple Timelines</a>,&quot; (Slides only) Forum on Design Languages (FDL), Kiel, Germany, September, 2020.</p>
</li>
<li><p><a href="https://www.youtube.com/watch?v=DkUjmbUU1zc">Video recording</a> of a presentation by Christian Menard, Achieving Determinism in Adaptive AUTOSAR, at virtual 23rd DATE conference 2020.</p>
</li>
<li><p><a href="https://youtu.be/Bk0ST1ckAsI">Video recording</a> of a guest lecture by Edward A. Lee, Reactors and Lingua Franca: A Programming Model for Cyberphysical Systems, April 16, 2020.</p>
</li>
<li><p><a href="https://youtu.be/TsE3vEzZFpI">Video recording</a> of a presentation by Edward A. Lee of two Lingua Franca examples, Reflex Game and Distributed, at &quot;virtual&quot; group lunch on 04-15-20.</p>
</li>
<li><p>Marten Lohstroh, I&ntilde;igo Incer Romeo, Andr&eacute;s Goens, Patricia Derler, Jeronimo Castrillon, Edward A. Lee, and Alberto Sangiovanni-Vincentelli, &quot;<a href="https://github.com/lf-lang/website-lingua-franca/tree/main/packages/lingua-franca/static/assets/slides/Lohstroh_etAl_CyPhy19.pdf">Reactors: A Deterministic Model for Composable Reactive Systems</a>,&quot; (Slides only) Model-Based Design of Cyber Physical Systems (CyPhy&#39;19), Held in conjunction with ESWEEK 2019, New York, NY, Oct. 18. </p>
</li>
<li><p>Marten Lohstroh, Martin Schoeberl, Mathieu Jan, Edward Wang, Edward A. Lee &quot;<a href="https://github.com/lf-lang/website-lingua-franca/tree/main/packages/lingua-franca/static/assets/slides/Lohstroh_etAl_EMSOFT19.pdf">Work-in-Progress: Programs with Ironclad Timing Guarantees</a>,&quot; (Slides only) ACM SIGBED International Conference on Embedded Software (EMSOFT), New York, NY, October 14.</p>
</li>
<li><p>Marten Lohstroh and Edward A. Lee &quot;<a href="https://github.com/lf-lang/website-lingua-franca/tree/main/packages/lingua-franca/static/assets/slides/Lohstroh_Lee_FDL19.pdf">Deterministic Actors</a>,&quot; (Slides only) Forum on Design Languages (FDL), Southampton, UK, September 3, 2019.</p>
</li>
<li><p>Edward A. Lee, &quot;<a href="https://github.com/lf-lang/website-lingua-franca/tree/main/packages/lingua-franca/static/assets/slides/Lee_ActorsRevisited_CyPhy.pdf">Actors Revisited for Predictable Systems</a>,&quot; (Slides only) Model-Based Design of Cyber-Physical Systems (CyPhy), New York, Oct. 17, 2019.</p>
</li>
</ul>
<h2 id="press-coverage">Press Coverage</h2>
<ul>
<li>&quot;<a href="https://semiengineering.com/toward-a-lingua-franca-for-intelligent-system-design/">Toward A Lingua Franca For Intelligent System Design</a>,&quot; by Frank Schirrmeister, <em>Semiconductor Engineering</em>, September 26, 2019.</li>
</ul>

    </div>
    <QuickJump title="Learning Resources" lang={props.pageContext.lang} />

  </Layout>
}

export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>
