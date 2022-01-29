import * as React from "react"
import { Layout } from "../../components/layout"
import { graphql } from "gatsby"
import { createInternational } from "../../lib/createInternational"
import { useIntl } from "react-intl"
import { Intl } from "../../components/Intl"

import "./css/community.scss"
import { comCopy } from "../../copy/en/community"
import { QuickJump } from "../../components/QuickJump"

const Row = (props: { children: any, className?: string }) => <div className={[props.className, "row"].join(" ")}>{props.children}</div>
const Col = (props: { children: any, className?: string }) => <div className={[props.className, "col1"].join(" ")}>{props.children}</div>
const Col2 = (props: { children: any, className?: string }) => <div className={[props.className, "col2"].join(" ")}>{props.children}</div>


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
              <a aria-labelledby="github-header" className="icon bug img-circle" href="https://github.com/lf-lang/lf-lang.github.io/issues/new/choose" title="Create a new GitHub Issue on the Lingua Franca repo" target="_blank" />
              <div className="text">
                <a href="https://github.com/lf-lang/lf-lang.github.io/issues/new/choose" id="github-header" title="Create a new GitHub Issue on the Lingua Franca repo">
                  <h3 className="community-callout-headline">GitHub</h3>
                </a>
                {i("com_online_github_desc")}{" "}
                <a href="https://github.com/lf-lang/lf-lang.github.io/issues/new/choose" title="Create a new GitHub Issue on the Lingua Franca repo">{i("com_online_github_href")}</a>
              </div>
            </div>
            <div className="callout">
              <a aria-labelledby="twitter-header" className="icon twitter img-circle" href="https://twitter.com/thelflang" target="_blank" title="The Lingua Franca team on Twitter" />
              <div className="text">
                <a href="https://twitter.com/thelflang" id="twitter-header" target="_blank" title="Follow Lingua Franca on Twitter">
                  <h3 className="community-callout-headline">Twitter</h3>
                </a>
                {i("com_online_twitter_desc") + " "}
                <a href="https://twitter.com/thelflang" title="Lingua Franca on Twitter" target="_blank">@thelflang</a>!
              </div>
            </div>

          </Col2>
        </Row>
      </div>

    <QuickJump title="Learning Resources" lang={props.pageContext.lang} />
    </Layout >
    
  )
}

export default (props: Props) => (
  <Intl locale={props.pageContext.lang}>
    <Comm {...props} />
  </Intl>
)
