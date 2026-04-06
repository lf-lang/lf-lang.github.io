import { ReactNode } from "react";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import clsx from "clsx";
/**
 * Copyright (c) the Lingua Franca contributors.
 *
 * This source code is licensed under the BSD licence found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * https://github.com/hydro-project/hydroflow/blob/bc35a5a5e05ccc3990bb3c430129f0a735bc8c0a/docs/src/pages/research.js#L8
 *
 * Copyright 2023 Hydroflow Contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

export const NotablePaper = ({
  conference,
  title,
  authors,
  abstract,
  doilink,
  pdflink,
  links,
}: {
  conference: ReactNode; // Conference name
  title: ReactNode; // Title
  authors: ReactNode;
  abstract: ReactNode;
  doilink: string;
  pdflink: string;
  links?: [string, string][]; // Additional links, a list of [content, href]
}) => {
  return (
    <div className="margin-bottom--lg">
      <div className={styles.paperContainer}>
        <div>
          <b>{conference}</b>
          <Heading as="h2">
            <Link href={doilink} className={styles.titleLink}>
              {title}
            </Link>
          </Heading>
          <p className={clsx(styles.authors)}>{authors}</p>
          <p className="margin-bottom--sm">
            <Link href={pdflink}>Download PDF</Link>
          </p>
          <p>{abstract}</p>
          {links &&
            links.length !== 0 &&
            links.map(([content, href], index) => (
              <div className={styles.smallLinks}>
                <Link href={href}>{content}</Link>{" "}
                <p>{index !== links.length - 1 ? "/" : ""}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
