import { ReactNode } from "react";
import styles from './styles.module.css'
import Link from '@docusaurus/Link';
import Image from '@theme/IdealImage';
import Heading from '@theme/Heading';
import clsx from 'clsx';
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
const linkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="75" viewBox="0 0 24 24" width="75" style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
    }}>
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
    </svg>
);

export const NotablePaper = ({
    pdfFirstPage,
    conference,
    title,
    authors,
    abstract,
    doilink,
    pdflink,
    links,
}: {
    pdfFirstPage: string | Promise<any>; // Imported image to the first page of the PDF
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
                <Link href={pdflink} className={clsx(styles.paperThumbnail)}>
                    <div className={styles["cardIcon"]}>{linkIcon}</div>
                    <Image
                        img={pdfFirstPage}
                        width={225}
                        placeholder="blur"
                        alt="title"
                        className={styles.paperPreviewImage}
                    />
                </Link>

                <div>
                    <b>{conference}</b>
                    <Heading as="h2">
                        <Link href={doilink} className={styles.titleLink}>{title}</Link>
                    </Heading>
                    <p className={clsx(styles.authors)}>{authors}</p>
                    <p>{abstract}</p>
                    {links && links.length !== 0 && links.map(([content, href], index) => (
                        <div className={styles.smallLinks}>
                            <Link href={href}>{content}</Link> <p>{index !== links.length - 1 ? "/" : ""}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}