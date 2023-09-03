import * as React from "react"
import { Layout } from "../../components/layout"
import { createInternational } from "../../lib/createInternational"
import { useIntl } from "react-intl"
import { Intl } from "../../components/Intl"

import "./css/community.scss"
import { comCopy } from "../../copy/en/community"

const Row = (props: { children: any, className?: string }) => <div className={[props.className, "row"].join(" ")}>{props.children}</div>
const Col = (props: { children: any, className?: string }) => <div className={[props.className, "col1"].join(" ")}>{props.children}</div>
const Col2 = (props: { children: any, className?: string }) => <div className={[props.className, "col2"].join(" ")}>{props.children}</div>

const active = [
  {
    name: "Peter Donovan",
    image: "https://avatars.githubusercontent.com/u/33707478?v=4",
    country: "🇺🇸",
    continentish: "North America",
    blurb: "Student Assistant at UC Berkeley.",
  },
  {
    name: "Clément Fournier",
    image: "https://avatars.githubusercontent.com/u/24524930?v=4",
    country: "🇩🇪",
    continentish: "Europe",
    blurb: "Master student at TU Dresden.",
  },
  {
    name: "Hokeun Kim",
    url: "https://hokeun.github.io/",
    image: "https://avatars.githubusercontent.com/u/2585943?v=4",
    country: "🇰🇷",
    continentish: "East Asia",
    blurb: "Assistant Professor at Hanyang University.",
  },
  {
    name: "Edward A. Lee",
    url: "http://people.eecs.berkeley.edu/~eal/",
    image: "https://avatars.githubusercontent.com/u/8513334?v=4",
    country: "🇺🇸",
    continentish: "North America",
    blurb: "Professor in the Graduate School at UC Berkeley."
  },
  {
    name: "Shaokai Lin",
    url: "https://shaokai.io",
    image: "https://avatars.githubusercontent.com/u/7968955?v=4",
    country: "🇺🇸",
    continentish: "North America",
    blurb: "Graduate Student at UC Berkeley."
  },
  {
    name: "Marten Lohstroh",
    url: "http://people.eecs.berkeley.edu/~marten/",
    image: "https://avatars.githubusercontent.com/u/19938940?v=4",
    twitter: "https://twitter.com/martenlohstroh",
    country: "🇺🇸",
    continentish: "North America",
    blurb: "Postdoctoral researcher at UC Berkeley.",
  },
  {
    name: "Johannes Hayeß",
    image: "https://avatars.githubusercontent.com/u/7195008?v=4",
    country: "🇩🇪",
    continentish: "Europe",
    blurb: "Master's Student at TU Dresden.",
  },
  {
    name: "Christian Menard",
    url: "https://cfaed.tu-dresden.de/investigators-institutions/compiler-construction/ccc-staff/christian-menard",
    image: "https://avatars.githubusercontent.com/u/6460123?v=4",
    country: "🇩🇪",
    continentish: "Europe",
    blurb: "Graduate Student at TU Dresden.",
  },
  {
    name: "Anirudh Rengarajan",
    image: "https://avatars.githubusercontent.com/u/44007330?v=4",
    country: "🇺🇸",
    continentish: "North America",
    blurb: "M.S. student @ UC Berkeley.",
  },
  {
    name: "Alexander Schulz-Rosengarten",
    image: "https://avatars.githubusercontent.com/u/25612037?v=4",
    country: "🇩🇪",
    continentish: "Europe",
    blurb: "Graduate student at Kiel University.",
  },
]

const past = [
  {
    name: "Soroush Bateni",
    url: "https://personal.utdallas.edu/~soroush/",
    image: "https://avatars.githubusercontent.com/u/4221770?v=4",
    country: "🇺🇸",
    continentish: "North America",
    blurb: "Software Engineer at Apple."
  },
  {
    name: "Matt Chorlian",
    image: "https://avatars.githubusercontent.com/u/70343891?v=4",
    country: "🇺🇸",
    continentish: "North America",
    blurb: "Applied Math and CS student at UC Berkeley."
  },
  {
    name: "Martin Schoeberl",
    image: "https://avatars.githubusercontent.com/u/650648?v=4",
    country: "🇩🇰",
    continentish: "Europe",
    blurb: "Professor at TU Denmark.",
  },
  {
    name: "Matt Weber",
    image: "https://avatars.githubusercontent.com/u/3513451?v=4",
    country: "🇺🇸",
    continentish: "North America",
    blurb: "Software Engineer at Anyscale."
  },
  {
    name: "Hou Seng (Steven) Wong",
    image: "https://avatars.githubusercontent.com/u/46389172?v=4",
    country: "🇺🇸",
    continentish: "North America",
    blurb: "Software Development Engineer at Amazon AWS.",
  },
]


type Props = {
  pageContext: any
}

export const Comm: React.FC<Props> = props => {
  const intl = useIntl()
  const i = createInternational<typeof comCopy>(intl)

  return (
    <Layout title={i("com_layout_title")} description={i("com_layout_description")} lang={props.pageContext.lang}>
      <div className="raised main-content-block container community" style={{ marginTop: "80px" }}>
        <Row>
          <Col className="sidebar">
            <h2>{i("com_connect_online")}</h2>
            <p className="banner-text">{i("com_connect_online_description")}</p>
          </Col>

          <Col2 className="callouts">
            <div className="callout">
              <a aria-labelledby="stack-header" className="icon publication img-circle" href="/publications-and-presentations" title="Lingua Franca Publications and Presentations" target="_blank"></a>
              <div className="text">
                <a href="/publications-and-presentations" id="stack-header" title="Lingua Franca Publications and Presentations" target="_blank">
                  <h3 className="community-callout-headline">Publications</h3>
                </a>
                {i("com_online_publications_desc")}
              </div>
            </div>
            <div className="callout">
              <a aria-labelledby="github-header" className="icon bug img-circle" href="https://github.com/lf-lang/lingua-franca/issues/new/choose" title="Create a new GitHub Issue on the Lingua Franca repo" target="_blank" />
              <div className="text">
                <a href="https://github.com/lf-lang/lingua-franca/issues/new/choose" id="github-header" target="_blank" title="Create a new GitHub Issue on the Lingua Franca repo">
                  <h3 className="community-callout-headline">GitHub</h3>
                </a>
                {i("com_online_github_desc")}{" "}
                <a href="https://github.com/lf-lang/lingua-franca/issues/new/choose" target="_blank" title="Create a new GitHub Issue on the Lingua Franca repo">{i("com_online_github_href")}</a>
              </div>
            </div>
            <div className="callout">
              <a aria-labelledby="twitter-header" className="icon twitter img-circle" href="https://twitter.com/thelflang" target="_blank" title="The Lingua Franca team on Twitter" />
              <div className="text">
                <a href="https://twitter.com/thelflang" id="twitter-header" target="_blank" title="Follow Lingua Franca on Twitter">
                  <h3 className="community-callout-headline">Twitter</h3>
                </a>
                {i("com_online_twitter_desc") + " "}
                <a href="https://twitter.com/thelflang" title="Lingua Franca on Twitter" target="_blank">{i("com_online_twitter_href")}</a>!
              </div>
            </div>
            <div className="callout">
              <a aria-labelledby="zulip-header" className="icon zulip img-circle" href="https://lf-lang.zulipchat.com/" title="Join the conversation on Zulip" target="_blank" />
              <div className="text">
                <a href="https://lf-lang.zulipchat.com/" id="zulip-header" target="_blank" title="Join the conversation on Zulip">
                  <h3 className="community-callout-headline">Zulip</h3>
                </a>
                {i("com_online_zulip_desc")}{" "}
                <a href="https://lf-lang.zulipchat.com/" target="_blank" title="Join the conversation on Zulip">{i("com_online_zulip_href")}</a>
              </div>
            </div>
          </Col2>
        </Row>
      </div>

      <div className="raised main-content-block container community">
        <h3 className="centered-highlight">Active Contributors</h3>
        <div className="events">

          <div className="callouts">
            {active.map(({name, image, country, url, twitter, blurb}, index) => (
              <Col className="callout" key={index}>
                <img src={image} className="icon img-square" alt={"logo of " + name} />
                <div>
                  <h5 className="community-callout-headline">{name}</h5>
                  <h6 className="blurb">{blurb}</h6>
                  <div className="text">{country}<br />
                    {" "}{url? <a rel="noopener" target="blank" href={url} title={"Website for " + name}>Website</a> 
                    : null}
                    {" "}{twitter ? <a rel="noopener" target="blank" href={twitter} title={"Twitter page for " + name}>Twitter</a> : null}
                  </div>
                </div>
              </Col>
            ))}
          </div>
        </div>
      </div>

      <div className="raised main-content-block container community">
        <h3 className="centered-highlight">Past Contributors</h3>
        <div className="events">

          <div className="callouts">
            {past.map(({name, image, country, url, twitter, blurb}, index) => (
              <Col className="callout" key={index}>
                <img src={image} className="icon img-square" alt={"logo of " + name} />
                <div>
                  <h5 className="community-callout-headline">{name}</h5>
                  <h6 className="blurb">{blurb}</h6>
                  <div className="text">{country}<br />
                    {" "}{url? <a rel="noopener" target="blank" href={url} title={"Website for " + name}>Website</a> 
                    : null}
                    {" "}{twitter ? <a rel="noopener" target="blank" href={twitter} title={"Twitter page for " + name}>Twitter</a> : null}
                  </div>
                </div>
              </Col>
            ))}
          </div>
        </div>
      </div>
    </Layout >
    
  )
}

export default (props: Props) => (
  <Intl locale={props.pageContext.lang}>
    <Comm {...props} />
  </Intl>
)
