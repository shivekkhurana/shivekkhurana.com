import type { PropsWithChildren } from 'react';

function SEO(
  props: PropsWithChildren<{
    title: string;
    subTitle?: string;
    tags?: string;
    ogType?: string;
    publishedOn?: string;
    authorName?: string;
    canonicalUrl?: string;
    heroImg?: string;
  }>
) {
  const {
    title,
    subTitle,
    tags,
    ogType,
    publishedOn,
    authorName,
    canonicalUrl,
    heroImg,
  } = props;
  return (
    <>
      {/*SEO*/}
      <title>{title}</title>
      {tags && (
        <meta
          name="keywords"
          content={tags}
        />
      )}
      <meta
        name="robots"
        content="index, follow"
      />
      {subTitle && (
        <meta
          name="description"
          content={subTitle}
        />
      )}

      <meta
        property="og:title"
        content={title}
      />
      {subTitle && (
        <meta
          name="og:description"
          content={subTitle}
        />
      )}
      {ogType && (
        <meta
          property="og:type"
          content={ogType}
        />
      )}

      {publishedOn && (
        <meta
          property="article:published_time"
          content={publishedOn}
        />
      )}
      {authorName && (
        <meta
          property="article:author"
          content={authorName}
        />
      )}
      {tags && (
        <meta
          property="article:tag"
          content={tags}
        />
      )}

      {canonicalUrl && (
        <link
          rel="canonical"
          href={canonicalUrl}
        />
      )}
      {heroImg && heroImg.indexOf('https://') === -1 && (
        <meta
          property="og:image"
          content={`https://shivekkhurana.com${heroImg}`}
        />
      )}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />
    </>
  );
}

export default SEO;
