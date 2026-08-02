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
  const seoImage =
    heroImg && heroImg.indexOf('https://') === -1
      ? `https://shivekkhurana.com${heroImg}`
      : heroImg;

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
          property="og:description"
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
      {seoImage && (
        <meta
          property="og:image"
          content={seoImage}
        />
      )}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        name="twitter:title"
        content={title}
      />
      {subTitle && (
        <meta
          name="twitter:description"
          content={subTitle}
        />
      )}
      {seoImage && (
        <meta
          name="twitter:image"
          content={seoImage}
        />
      )}
    </>
  );
}

export default SEO;
