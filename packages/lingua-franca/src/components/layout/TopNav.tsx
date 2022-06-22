import React from "react"

import "./TopNav.scss"
import { useIntl } from "react-intl";
import { createIntlLink } from "../IntlLink";

export type Props = {
  lang: string
}

import { navCopy } from "../../copy/en/nav"
import { createInternational } from "../../lib/createInternational"

export const SiteNav = (props: Props) => {
  const i = createInternational<typeof navCopy>(useIntl())
  const IntlLink = createIntlLink(props.lang)


  return (
    <header dir="ltr">
      <a className="skip-to-main" href="#site-content" tabIndex={0}>{i("skip_to_content")}</a>

      <div id="top-menu" className="up">
        <div className="left below-small">

          <IntlLink id="home-page-logo" to="/" aria-label="Lingua Franca Home Page">
          <img
            id="lf-logo"
            srcSet={
              `${require("../../../../../img/small_logo.svg").default} 30w, `
              + `${require("../../../../../img/header_logo.svg").default} 125w`
            }
            src={require("../../../../../img/small_logo.svg").default}
            sizes="(max-width: 600px) 30px, 125px"
            alt="Lingua Franca Logo"
          />
          </IntlLink>

          <nav role="navigation">
            <ul>
              <li className="nav-item"><IntlLink to="/download">{i("nav_download")}</IntlLink></li>
              <li className="nav-item"><IntlLink to="/docs/">{i("nav_documentation_short")}</IntlLink></li>
              <li className="nav-item"><IntlLink to="/docs/handbook/overview">{i("nav_handbook")}</IntlLink></li>
              <li className="nav-item"><IntlLink to="/community">{i("nav_community")}</IntlLink></li>
            </ul>
          </nav>

        </div>
      </div>

      <div id="site-content" />
    </header >
  )
}
