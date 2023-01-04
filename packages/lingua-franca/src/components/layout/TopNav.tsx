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
      appId: "3Z0QVXSJE6",
      apiKey: '43408ca337034bd8be6dbdbec06db564',
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
        <div className="right above-small">
          <div className="search-section">
            <div className="nav-item">
              <form id="search-form" className="search top-nav" role="search">
                <svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m10.5 0c.5052 0 .9922.0651042 1.4609.195312.4688.130209.9063.315105 1.3125.554688.4063.239583.7761.52865 1.1094.86719.3386.33333.6276.70312.8672 1.10937s.4245.84375.5547 1.3125.1953.95573.1953 1.46094-.0651.99219-.1953 1.46094-.3151.90625-.5547 1.3125-.5286.77864-.8672 1.11718c-.3333.33334-.7031.61978-1.1094.85938-.4062.2396-.8437.4245-1.3125.5547-.4687.1302-.9557.1953-1.4609.1953-.65104 0-1.27604-.1094-1.875-.3281-.59375-.2188-1.14062-.5339-1.64062-.94534l-6.132818 6.12504c-.098958.0989-.216145.1484-.351562.1484s-.252604-.0495-.351562-.1484c-.0989588-.099-.148438-.2162-.148438-.3516s.0494792-.2526.148438-.3516l6.125002-6.13278c-.41146-.5-.72656-1.04687-.94532-1.64062-.21874-.59896-.32812-1.22396-.32812-1.875 0-.50521.0651-.99219.19531-1.46094s.31511-.90625.55469-1.3125.52604-.77604.85938-1.10937c.33854-.33854.71093-.627607 1.11718-.86719s.84375-.424479 1.3125-.554688c.46875-.1302078.95573-.195312 1.46094-.195312zm0 10c.6198 0 1.2031-.11719 1.75-.35156.5469-.23959 1.0234-.5625 1.4297-.96875.4062-.40625.7265-.88281.9609-1.42969.2396-.54688.3594-1.13021.3594-1.75s-.1198-1.20312-.3594-1.75c-.2344-.54688-.5547-1.02344-.9609-1.42969-.4063-.40625-.8828-.72656-1.4297-.96093-.5469-.23959-1.1302-.35938-1.75-.35938-.61979 0-1.20312.11979-1.75.35938-.54688.23437-1.02344.55468-1.42969.96093s-.72916.88281-.96875 1.42969c-.23437.54688-.35156 1.13021-.35156 1.75s.11719 1.20312.35156 1.75c.23959.54688.5625 1.02344.96875 1.42969s.88281.72916 1.42969.96875c.54688.23437 1.13021.35156 1.75.35156z" fill="#fff" /></svg>
                <span><input id='search-box-top' type="search" placeholder={i("nav_search_placeholder")} aria-label={i("nav_search_aria")} /></span>
                <input type="submit" style={{ display: "none" }} />
              </form>
            </div>
          </div>
        </div>
      </div>

      <div id="site-content" />
    </header >
  )
}
