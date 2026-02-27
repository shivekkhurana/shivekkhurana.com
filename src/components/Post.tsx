import React from 'react';
import {
  getAuthorBySlug,
  getPostsBySlugs,
  getRecentPosts,
} from '@src/domain/content';
import Markdown from '@src/components/Markdown';
import PostClosing from '@src/components/PostClosing';
import PostListContainer from '@src/components/PostListContainer';
import { convertDateString } from '@src/utils/time';
import type {
  Post as PostContentType,
  Author as AuthorContentType,
} from '@contentlayer/generated';

import image from '@src/utils/image';
import str from '@src/utils/string';
import Img from '@src/components/Img';

const shareUrls = {
  twitter: (link = '', message = '') =>
    `https://twitter.com/intent/tweet/?text=${encodeURIComponent(
      message
    )}&url=${encodeURIComponent(link)}`,
  facebook: (link = '') => `https://facebook.com/sharer/sharer.php?u=${link}`,
  linkedin: (link = '', message = '') =>
    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      link
    )}
    &title=${encodeURIComponent(message)}&summary=${encodeURIComponent(
      message
    )}&source=${encodeURIComponent(link)}`,
  mail: (link = '', subject: string, body: string) =>
    `mailto:?subject=${encodeURIComponent(
      subject || ''
    )}&body=${encodeURIComponent((body && `${body}\n\n${link}`) || link)}`,
  whatsapp: (link = '', message = '') =>
    `whatsapp://send?text=${encodeURIComponent(message)}%20${encodeURIComponent(
      link
    )}`,
  telegram: (link = '', message = '') =>
    `https://telegram.me/share/url?text=${encodeURIComponent(
      message
    )}&url=${encodeURIComponent(link)}`,
  hn: (link = '', message = '') =>
    `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
      link
    )}&t=${encodeURIComponent(message)}`,
};

function Share({ title, url }: { title: string; url: string }) {
  return (
    <div className="flex">
      <a
        href={shareUrls.twitter(url, `${title} by @shivek_khurana`)}
        className="pointer"
        target="_blank"
      >
        Twitter
      </a>
    </div>
  );
}

const AuthorImage = ({ profilePicture, name }: AuthorContentType) => {
  const optimizedPaths = image.getOptimizedPaths(profilePicture);
  return (
    <img
      src={optimizedPaths.w80}
      className="rounded-full w-[48px] h-[48px]"
      alt={name}
    />
  );
};

const Author = ({
  slug,
  publishedOn,
  postSlug,
}: {
  slug: string;
  publishedOn: string;
  postSlug: string;
}) => {
  const author = getAuthorBySlug(slug);
  return (
    <div className="flex flex-col md:flex-row mt-4 md:items-center justify-between gap-3">
      <div className="flex items-center">
        <div className="w-[56px]">
          <AuthorImage {...author} />
        </div>
        <div className="pt-1">
          <div className="font-bold text-sm">{author.name}</div>
          <div className="text-sm opacity-60 mb-2">
            {convertDateString(publishedOn)}
          </div>
        </div>
      </div>
      <a
        href={`/blog/${postSlug}.md`}
        className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
      >
        <img
          src="/img/markdown.svg"
          alt=""
          className="w-5 h-5"
        />
        Markdown for AI Agents
      </a>
    </div>
  );
};

interface PostProps {
  post: PostContentType;
}

function parse(url: string): string {
  if (url.includes('medium.com')) return 'Medium';
  else if (url.includes('newline.co')) return 'Newline';
  else if (url.includes('linkedin.com')) return 'LinkedIn';
  else if (url.includes('x.com')) return 'X';
  else return url;
}

function CanonicalRef({ canonicalUrl }: { canonicalUrl: string }) {
  return (
    <div className="mt-3 bg-black/10 p-2 rounded">
      This blog was originally published on{' '}
      <a
        href={canonicalUrl}
        className="underline"
      >
        {str.capitalise(parse(canonicalUrl))}.
      </a>
    </div>
  );
}

function Post({ post }: PostProps) {
  const { heroImg, title, subTitle, publishedOn, slug, canonicalUrl, author } =
    post;
  return (
    <div>
      <article>
        <div className="mx-auto w-11/12 lg:w-10/12 xl:w-8/12">
          <h1 className="text-3xl md:text-2xl lg:text-4xl font-bold mt-5 mb-2">
            {title}
          </h1>
          {subTitle && (
            <h2 className="text-lg md:text-xl lg:text-3xl text-black-80 mt-2 mb-3 opacity-60">
              {subTitle}
            </h2>
          )}
          <Author
            slug={author ?? ''}
            publishedOn={publishedOn ?? ''}
            postSlug={slug || ''}
          />
          {/* <Share title={title} url={`https://krimlabs.com/blog/${slug}`} /> */}
        </div>

        {heroImg && (
          <figure className="mx-auto w-11/12 lg:w-10/12 xl:w-8/12 my-4">
            <Img
              path={heroImg}
              alt={post.heroImgCaption || `Hero image for the post: ${title}`}
              className="rounded-md"
              defaultWidth={960}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 50vw, (min-width: 768px) 66vw, 83vw"
            />
            {post.heroImgCaption && (
              <figcaption className="mt-2 text-sm text-center opacity-60">
                {post.heroImgCaption}
              </figcaption>
            )}
          </figure>
        )}

        <Markdown post={post} />

        <div className="mx-auto w-11/12 lg:w-10/12 xl:w-8/12">
          <div className="text-lg">
            {canonicalUrl && <CanonicalRef canonicalUrl={canonicalUrl} />}
          </div>
        </div>
      </article>

      <PostClosing />

      <div className="w-full border-t border-black py-8">
        <div className="mx-auto w-11/12 lg:w-10/12 xl:w-8/12 font-mlm-roman space-y-12">
          {post.relatedSlugs && post.relatedSlugs.length > 0 && (
            <PostListContainer
              title="Related Posts"
              posts={getPostsBySlugs(post.relatedSlugs)}
            />
          )}
          <PostListContainer
            title="Recent Posts"
            posts={getRecentPosts(post.slug, 5)}
          />
        </div>
      </div>
    </div>
  );
}

export default Post;
