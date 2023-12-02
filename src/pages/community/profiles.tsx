// Adapted from https://github.com/facebook/docusaurus/blob/main/website/src/components/TeamProfileCards/index.tsx
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Copyright (c) the Lingua Franca contributors.
 *
 * This source code is licensed under the BSD licence found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import style from './styles.module.css';

type ProfileProps = {
  className?: string;
  name: string;
  blurb: ReactNode;
  githubUrl?: string;
  twitterUrl?: string;
  personalSiteUrl?: string;
  avatar: string;
};

// The div below are NOT bootstrap despite of their names, it's in styles.css for docusaurus theme classic.
// It is actually https://infima.dev/, see https://github.com/facebook/docusaurus/issues/8919

function TeamProfileCard({
  className,
  name,
  blurb,
  avatar,
  githubUrl,
  twitterUrl,
  personalSiteUrl,
}: ProfileProps) {
  return (
    <div className={className}>
      <div className="card card--full-height">
        <div className="card__header">
          <div className="avatar avatar--vertical">
            <img
              className="avatar__photo avatar__photo--xl"
              src={avatar}
              alt={`${name}'s avatar`}
            />
            <div className="avatar__intro">
              <Heading as="h4" className="avatar__name">
                {name}
              </Heading>
            </div>
          </div>
        </div>
        <div className="card__body">{blurb}</div>
        <div className="card__footer">
          <div className="button-group button-group--block">
            {githubUrl && (
              <Link className="button button--secondary" href={githubUrl}>
                GitHub
              </Link>
            )}
            {twitterUrl && (
              <Link className="button button--secondary" href={twitterUrl}>
                Twitter
              </Link>
            )}
            {personalSiteUrl && (
              <Link className="button button--secondary" href={personalSiteUrl}>
                Website
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamProfileCardCol(props: ProfileProps) {
  return (
    <TeamProfileCard {...props} className="col col--4 margin-bottom--lg" />
  );
}

export function TeamRow({ people }: { people: ProfileProps[] }): JSX.Element {
  return (
    <div className="row">
      {people.map((props) => (
        <TeamProfileCardCol {...props} />
      ))}
    </div>
  );
}
