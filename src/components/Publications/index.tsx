import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import clsx from "clsx";
import { NotablePaper } from "./notable";
import perf23image from "@site/static/img/publications/perf23.png";
import emsoft23image from "@site/static/img/publications/emsoft23.png";
import tecs21image from "@site/static/img/publications/tecs21.png";
import {
  copypastaPublications,
  copypastaTalks,
  copypastaPress,
} from "./copypasta";

const notablePapers = [
  {
    pdfFirstPage: perf23image,
    conference: "TACO 2023",
    title: "High-performance Deterministic Concurrency Using Lingua Franca",
    authors:
      "Christian Menard, Marten Lohstroh, Soroush Bateni, Matthew Chorlian, Arthur Deng, Peter Donovan, Clément Fournier, Shaokai Lin, Felix Suchert, Tassilo Tanneberger, Hokeun Kim, Jeronimo Castrillon, Edward A. Lee",
    abstract:
      "Actor frameworks and similar reactive programming techniques are widely used for building concurrent systems. They promise to be efficient and scale well to a large number of cores or nodes in a distributed system. However, they also expose programmers to nondeterminism, which often makes implementations hard to understand, debug, and test. The recently proposed reactor model is a promising alternative that enables efficient deterministic concurrency. In this paper, we show that determinacy does neither imply a loss in expressivity nor in performance. To show this, we evaluate Lingua Franca (LF), a reactor-oriented coordination language that equips mainstream programming languages with a concurrency model that automatically takes advantage of opportunities to exploit parallelism that do not introduce nondeterminism. Our implementation of the Savina benchmark suite demonstrates that, in terms of execution time, the runtime performance of LF programs even exceeds popular and highly optimized actor frameworks. We compare against Akka and CAF, which LF outperforms by 1.86x and 1.42x, respectively.",
    doilink: "https://dl.acm.org/doi/10.1145/3617687",
    pdflink: "https://dl.acm.org/doi/pdf/10.1145/3617687",
  },
  {
    pdfFirstPage: emsoft23image,
    conference: "EMSOFT 23",
    title: "Consistency vs. Availability in Distributed Cyber-Physical Systems",
    authors:
      "Edward A. Lee, Ravi Akella, Soroush Bateni, Shaokai Lin, Marten Lohstroh, Christian Menard",
    abstract:
      "In distributed applications, Brewer’s CAP theorem tells us that when networks become partitioned (P), one must give up either consistency (C) or availability (A). Consistency is agreement on the values of shared variables; availability is the ability to respond to reads and writes accessing those shared variables. Availability is a real-time property whereas consistency is a logical property. We extend consistency and availability to refer to cyber-physical properties such as the state of the physical system and delays in actuation. We have further extended the CAP theorem to relate quantitative measures of these two properties to quantitative measures of communication and computation latency (L), obtaining a relation called the CAL theorem that is linear in a max-plus algebra. This paper shows how to use the CAL theorem in various ways to help design cyber-physical systems. We develop a methodology for systematically trading off availability and consistency in application-specific ways and to guide the system designer when putting functionality in end devices, in edge computers, or in the cloud. We build on the Lingua Franca coordination language to provide system designers with concrete analysis and design tools to make the required tradeoffs in deployable embedded software.",
    doilink: "https://dl.acm.org/doi/10.1145/3609119",
    pdflink: "https://dl.acm.org/doi/pdf/10.1145/3609119",
  },
  {
    pdfFirstPage: tecs21image,
    conference: "TECS 21",
    title: "Toward a Lingua Franca for Deterministic Concurrent Systems",
    authors:
      "Marten Lohstroh, Christian Menard, Soroush Bateni, Edward A. Lee.",
    abstract:
      "Many programming languages and programming frameworks focus on parallel and distributed computing. Several frameworks are based on actors, which provide a more disciplined model for concurrency than threads. The interactions between actors, however, if not constrained, admit nondeterminism. As a consequence, actor programs may exhibit unintended behaviors and are less amenable to rigorous testing. We show that nondeterminism can be handled in a number of ways, surveying dataflow dialects, process networks, synchronous-reactive models, and discrete-event models. These existing approaches, however, tend to require centralized control, pose challenges to modular system design, or introduce a single point of failure. We describe “reactors,” a new coordination model that combines ideas from several of these approaches to enable determinism while preserving much of the style of actors. Reactors promote modularity and allow for distributed execution. By using a logical model of time that can be associated with physical time, reactors also provide control over timing. Reactors also expose parallelism that can be exploited on multicore machines and in distributed configurations without compromising determinacy.",
    doilink: "https://dl.acm.org/doi/10.1145/3448128",
    pdflink: "https://dl.acm.org/doi/pdf/10.1145/3448128",
  },
];

export default () => {
  return (
    <Layout description="Publications of the Lingua Franca">
      <div className="section">
        <div className="container">
          <Heading
            as="h2"
            className={clsx("margin-bottom--lg", "text--center")}
          >
            Featured Publications
          </Heading>
          {notablePapers.map((value) => (
            <NotablePaper {...value} />
          ))}
        </div>
      </div>

      {/*TODO: Use the .bib file instead, or at least make this more modular, or use Markdown??? */}
      <div className="section sectionAlt">
        <div className="container">
          <Heading
            as="h2"
            className={clsx("margin-bottom--lg", "text--center")}
          >
            All Publications
          </Heading>
          {copypastaPublications}
        </div>
      </div>

      <div className="section">
        <div className="container">
          <Heading
            as="h2"
            className={clsx("margin-bottom--lg", "text--center")}
          >
            Presentations
          </Heading>
          {copypastaTalks}
        </div>
      </div>
      <div className="section sectionAlt">
        <div className="container">
          <Heading
            as="h2"
            className={clsx("margin-bottom--lg", "text--center")}
          >
            Press Coverage
          </Heading>
          {copypastaPress}
        </div>
      </div>
    </Layout>
  );
};
