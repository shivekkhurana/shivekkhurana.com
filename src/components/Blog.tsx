import clsx from 'clsx';
import type { Post } from '@contentlayer/generated';
import PostItem from '@src/components/PostItem';

function Blog({
  postsByYear,
  totalPosts,
}: {
  postsByYear: Record<number, Post[]>;
  totalPosts: number;
}) {
  const years = Object.keys(postsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <section className="font-mlm-roman">
      <h2 className="text-lg font-bold font-mlm-roman mb-4">Blog</h2>
      <div className="text-sm"></div>
      {years.map((year) => {
        const posts = postsByYear[year];
        return (
          <div
            key={year}
            className="mb-6"
          >
            <div className="font-bold text-xs opacity-60">{year}</div>
            {posts.map((post) => {
              return (
                <PostItem
                  post={post}
                  key={post.slug!}
                />
              );
            })}
          </div>
        );
      })}
      <div className="mt-4">
        <a
          href="/blog"
          className={clsx('inline-block h-[30px] px-[10px]', 'border')}
        >
          View all {totalPosts} posts
        </a>
      </div>
    </section>
  );
}
export default Blog;
