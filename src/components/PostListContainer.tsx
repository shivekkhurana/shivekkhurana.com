import type { Post } from '@contentlayer/generated';
import PostItem from '@src/components/PostItem';

interface PostListContainerProps {
  title: string;
  posts: Post[];
}

function PostListContainer({ title, posts }: PostListContainerProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="font-bold text-xs opacity-60 mb-2">{title}</div>
      {posts.map((post) => (
        <PostItem key={post.slug} post={post} />
      ))}
    </div>
  );
}

export default PostListContainer;
