import {
  allPosts,
  allAuthors,
  allTags,
  allProjects,
  allVideos,
} from '@contentlayer/generated';
import type { Post, Author, Tag, Project, Video } from '@contentlayer/generated';

function getAllPosts(): Post[] {
  // If there is no publishedOn, then it is a draft
  return allPosts.filter((p: Post) => p.publishedOn);
}

function getSortedPosts(): Post[] {
  // Sort by publishedOn descending (most recent first)
  return [...getAllPosts()].sort((a: Post, b: Post) => {
    const aTime = new Date(a.publishedOn!).getTime();
    const bTime = new Date(b.publishedOn!).getTime();
    return bTime - aTime;
  });
}

function getTopPosts(limit: number): Post[] {
  return getSortedPosts().slice(0, limit);
}

function getAllProjects(): Project[] {
  // Sort by startDay descending (most recent first)
  return [...allProjects].sort((a: Project, b: Project) => {
    const aTime = new Date(a.startDay!).getTime();
    const bTime = new Date(b.startDay!).getTime();
    return bTime - aTime;
  });
}

function getAllAuthors(): Author[] {
  return allAuthors;
}

function groupPostsByYear(posts: Post[]): Record<number, Post[]> {
  return posts.reduce(
    (groupedByYear, post) => {
      const year: number = new Date(post.publishedOn!).getFullYear();
      return {
        ...groupedByYear,
        [year]: [...(groupedByYear[year] || []), post],
      };
    },
    {} as { [year: number]: Post[] }
  );
}

function getPostsGroupedByYear(): Record<number, Post[]> {
  return groupPostsByYear(getSortedPosts());
}

function getTopPostsGroupedByYear(limit: number): Record<number, Post[]> {
  return groupPostsByYear(getTopPosts(limit));
}

function getTopProjects(limit: number): Project[] {
  return getAllProjects().slice(0, limit);
}

function groupProjectsByYear(projects: Project[]): Record<number, Project[]> {
  return projects.reduce(
    (groupedByYear, project) => {
      const year: number = new Date(project.startDay!).getFullYear();
      return {
        ...groupedByYear,
        [year]: [...(groupedByYear[year] || []), project],
      };
    },
    {} as { [year: number]: Project[] }
  );
}

function getProjectsGroupedByYear(): Record<number, Project[]> {
  return groupProjectsByYear(getAllProjects());
}

function getTopProjectsGroupedByYear(limit: number): Record<number, Project[]> {
  return groupProjectsByYear(getTopProjects(limit));
}

function getAuthorBySlug(slug: string): Author {
  return getAllAuthors().find((a: Author) => a.slug === slug)!;
}

function getPostsBySlugs(slugs: string[]): Post[] {
  return getAllPosts().filter((p: Post) => slugs.includes(p.slug));
}

function getRecentPosts(excludeSlug?: string, limit: number = 5): Post[] {
  return getSortedPosts()
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, limit);
}

function getAllVideos(): Video[] {
  return allVideos.filter((v: Video) => v.publishedOn);
}

function getSortedVideos(): Video[] {
  return [...getAllVideos()].sort((a: Video, b: Video) => {
    const aTime = new Date(a.publishedOn!).getTime();
    const bTime = new Date(b.publishedOn!).getTime();
    return bTime - aTime;
  });
}

export {
  getAllPosts,
  getSortedPosts,
  getTopPosts,
  getTopPostsGroupedByYear,
  getPostsGroupedByYear,
  getAuthorBySlug,
  getPostsBySlugs,
  getRecentPosts,
  getAllProjects,
  getTopProjects,
  getProjectsGroupedByYear,
  getTopProjectsGroupedByYear,
  getAllVideos,
  getSortedVideos,
};
export type { Post, Author, Tag, Project, Video };
