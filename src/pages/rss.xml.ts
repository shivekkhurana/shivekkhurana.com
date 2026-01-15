import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getSortedPosts } from '@src/domain/content';

export async function GET(context: APIContext) {
  const posts = getSortedPosts();

  return rss({
    title: 'Shivek Khurana',
    description:
      'I make things. Mostly software, but sometimes clothes, courses, videos, or essays.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.publishedOn!),
      link: `/blog/${post.slug}/`,
      description: post.subTitle || '',
      content: post.parsedMd,
    })),
  });
}
