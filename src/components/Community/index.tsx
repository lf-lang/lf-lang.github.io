import clsx from "clsx";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Translate from "@docusaurus/Translate";

import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import { TeamRow } from "./profiles";
import { active, past } from "./people";

import { JSX, ReactElement, ReactNode } from "react";
import Link from "@docusaurus/Link";

import ZulipLogo from "@site/static/img/external-logos/zulip-icon-circle.svg";
import GithubLogo from "@site/static/img/external-logos/github-mark.svg";
import RedditLogo from "@site/static/img/external-logos/reddit-logo.svg";

export const SocialMediaCard = ({
  renderedImage,
  name,
  children,
}: {
  renderedImage: ReactElement;
  name: string;
  children: ReactNode;
}) => {
  return (
    <div className="col col--4 margin-bottom--lg">
      <div className="card card--full-height">
        <div className="card__header">
          <div className="avatar avatar--vertical">
            <div className="avatar__photo avatar__photo--xl">
              {renderedImage}
            </div>
            <div className="avatar__intro">
              <Heading as="h4" className="avatar__name">
                {name}
              </Heading>
            </div>
          </div>
        </div>
        <div className="card__body">{children}</div>
      </div>
    </div>
  );
};

export default function Community(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Community"
      description="Intuitive concurrent programming in any language"
    >
      {/* Social media */}
      {/* Active contributors */}
      <div className="section">
        <div className="container">
          <Heading
            as="h2"
            className={clsx("margin-bottom--lg", "text--center")}
          >
            <Translate>Online Places</Translate>
          </Heading>
          <div className={"text--center"}>
            <p>
              <Translate>
                Tap into our online resources to learn more about Lingua Franca,
                provide feedback, connect with our developers, and find out about
                new updates.
              </Translate>
            </p>
          </div>
          <div className={clsx("row")}>
            <SocialMediaCard
              renderedImage={
                <ZulipLogo title="Zulip" width="100%" height="100%" />
              }
              name="Zulip"
            >
              <>
                Have questions, or want to chat with other users?{" "}
                <Link href="https://lf-lang.zulipchat.com/">
                  Join the conversation on Zulip.
                </Link>
              </>
            </SocialMediaCard>
            {/* Tweak github black logo so that its background is always white. */}
            <SocialMediaCard
              renderedImage={
                <GithubLogo
                  title="GitHub"
                  width="100%"
                  height="100%"
                  style={{
                    backgroundColor: "#ffffff",
                    transform: "scale(1.02)",
                  }}
                />
              }
              name="GitHub"
            >
              <>
                Found a bug, or want to provide feedback?{" "}
                <Link href="https://github.com/lf-lang/lingua-franca/issues/new/choose">
                  Tell us on GitHub.
                </Link>
                
              </>
            </SocialMediaCard>
            {/* Tweak X white logo so that its background is always black and it's smaller and centred. */}
            <SocialMediaCard
              renderedImage={
                // Drafted by...... ChatGPT
                <div
                  style={{
                    display: "flex", // Use flexbox to center children
                    justifyContent: "center", // Center horizontally
                    alignItems: "center", // Center vertically
                    backgroundColor: "#242526", // Set the background to black
                  }}
                >
                  <RedditLogo title="Reddit" width="100%" height="100%" />
                </div>
              }
              name="Reddit"
            >
              <>
                Stay up to date. Find us on Reddit at{" "}
                <Link
                  href="https://reddit.com/r/thelflang"
                  title="Lingua Franca on Twitter"
                  target="_blank"
                >
                  r/thelflang
                </Link>
                !
              </>
            </SocialMediaCard>
          </div>
        </div>
      </div>

      {/* Active contributors */}
      <div className="section sectionAlt">
        <div className="container">
          <Heading
            as="h2"
            className={clsx("margin-bottom--lg", "text--center")}
          >
            <Translate>Active Contributors</Translate>
          </Heading>
          <TeamRow people={active} />
        </div>
      </div>

      {/* Past contributors */}
      <div className="section">
        <div className="container">
          <Heading
            as="h2"
            className={clsx("margin-bottom--lg", "text--center")}
          >
            <Translate>Past Contributors</Translate>
          </Heading>
          <TeamRow people={past} />
        </div>
      </div>
    </Layout>
  );
}
