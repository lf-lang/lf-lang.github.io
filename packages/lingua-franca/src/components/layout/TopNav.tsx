import React, { useEffect } from "react"
import { withPrefix } from "gatsby"

import "./TopNav.scss"
import { useIntl } from "react-intl";
import { createIntlLink } from "../IntlLink";
import { setupStickyNavigation } from "./stickyNavigation";

export type Props = {
  lang: string
}

import { navCopy } from "../../copy/en/nav"
import { createInternational } from "../../lib/createInternational"

export const SiteNav = (props: Props) => {
  const i = createInternational<typeof navCopy>(useIntl())
  const IntlLink = createIntlLink(props.lang)
  const loadDocSearch = () => {
    const isDev = document.location.host.includes('localhost')
    let customHandleSelected;

    if (isDev) {
      customHandleSelected = (input, event, suggestion, datasetNumber, context) => {
        const urlToOpen = suggestion.url.replace("www.typescriptlang.org", "localhost:8000").replace("https", "http")
        window.open(urlToOpen)
      }
    }

    // @ts-ignore - this comes from the script above
    docsearch({
      appId: "BGCDYOIYZ5",
      apiKey: '37ee06fa68db6aef451a490df6df7c60',
      indexName: 'lf-lang',
      inputSelector: '.search input',
      handleSelected: customHandleSelected,
    });
  }
  // This extra bit of mis-direction ensures that non-essential code runs after
  // the page is loaded
  useEffect(() => {
    setupStickyNavigation()

    // @ts-ignore - this comes from the script above
    if (window.docsearch) {
      loadDocSearch();
    }
    if (document.getElementById("algolia-search")) return

    const searchScript = document.createElement('script');
    searchScript.id = "algolia-search"
    const searchCSS = document.createElement('link');

    searchScript.src = withPrefix("/js/docsearch.js");
    searchScript.async = true;
    searchScript.onload = () => {
      // @ts-ignore - this comes from the script above
      if (window.docsearch) {
        loadDocSearch();

        searchCSS.rel = 'stylesheet';
        searchCSS.href = withPrefix('/css/docsearch.css');
        searchCSS.type = 'text/css';
        document.body.appendChild(searchCSS);

        document.getElementById("search-form")?.classList.add("search-enabled")
      }
    }

    document.body.appendChild(searchScript);
  }, []);
  return (
    <header dir="ltr">
      <a className="skip-to-main" href="#site-content" tabIndex={0}>{i("skip_to_content")}</a>

      <div id="top-menu" className="up">
        <div className="left below-small">

          <IntlLink id="home-page-logo" to="/" aria-label="Lingua Franca Home Page">
          <picture>
            <source
              media="(min-width: 600px)"
              srcSet={require("../../../../../img/header_logo.svg").default}
            />
            <img
              src={require("../../../../../img/small_logo.svg").default}
            />
          </picture>
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
