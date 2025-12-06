import React from 'react';
import type { PropsWithChildren } from 'react';

function ArticleStructuredData(
  props: PropsWithChildren<{
    title: string;
    subTitle?: string;
    heroImg: string;
    publishedOn: string;
    url: string;
    authorName: string;
    tags: string;
  }>
) {
  const { title, subTitle, heroImg, publishedOn, url, authorName, tags } =
    props;

  const sd = `
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title}",
    "image": "https://shivekkhurana.com${heroImg}",
    "author": "${authorName}",
    "keywords": "${tags}",
    "publisher": "Shivek Khurana",
    "url": "${url}",
    "datePublished": "${publishedOn}",
    "description": "${subTitle || ''}",
  }`;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: sd,
      }}
    />
  );
}

export default ArticleStructuredData;
