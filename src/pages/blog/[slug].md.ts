import type { APIRoute, GetStaticPaths } from 'astro';
import { getAllPosts } from '@src/domain/content';

export const getStaticPaths: GetStaticPaths = () => {
  const posts = getAllPosts();
  return posts.map((p) => ({
    params: { slug: p.slug },
    props: { post: p },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: ReturnType<typeof getAllPosts>[number] };

  // Build frontmatter block for context
  const frontmatter = [
    '---',
    `title: ${post.title}`,
    post.subTitle ? `subtitle: ${post.subTitle}` : null,
    `published: ${post.publishedOn}`,
    `author: ${post.author}`,
    post.tags?.length ? `tags: ${post.tags.join(', ')}` : null,
    post.heroImg ? `heroImg: https://shivekkhurana.com${post.heroImg}` : null,
    `url: https://shivekkhurana.com/blog/${post.slug}`,
    '---',
  ]
    .filter(Boolean)
    .join('\n');

  const markdown = `${frontmatter}\n\n${post.body.raw}`;

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
