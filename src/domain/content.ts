import {
  allPosts,
  allMicroPosts,
  allAuthors,
  allTags,
} from '@contentlayer/generated';
import type { Post, Author, Tag, MicroPost } from '@contentlayer/generated';

function getAllPosts(): Post[] {
  // If there is no publishedOn, then it is a draft
  return allPosts.filter((p: Post) => p.publishedOn);
}

function getAllMicroPosts(): MicroPost[] {
  return allMicroPosts;
}

function getAllAuthors(): Author[] {
  return allAuthors;
}

export type TimelineItem = Post | MicroPost;
function groupAndSortByYear(objects: TimelineItem[]): {
  [year: number]: TimelineItem[];
} {
  return (
    objects
      // Only include items that are published
      .filter((obj: TimelineItem) => obj.publishedOn)
      .reduce(
        (groupedByYear, obj: TimelineItem) => {
          const year: number = new Date(obj.publishedOn!).getFullYear();

          // Use an object spread to create a new object (avoid mutating the original)
          const updatedGrouped = {
            ...groupedByYear,
            [year]: [...(groupedByYear[year] || []), obj],
          };

          return {
            ...groupedByYear,
            [year]: updatedGrouped[year].sort(
              (a: TimelineItem, b: TimelineItem) =>
                new Date(b.publishedOn!).getTime() -
                new Date(a.publishedOn!).getTime()
            ),
          };
        },
        {} as { [year: number]: any[] }
      )
  );
}

function getTimeline(): Record<number, TimelineItem[]> {
  // order by created at and group by year
  return groupAndSortByYear([...getAllPosts(), ...getAllMicroPosts()]);
}

function getTimelinePosts(): Record<number, TimelineItem[]> {
  // order by created at and group by year
  return groupAndSortByYear([...getAllPosts()]);
}

function getTimelineMicroPosts(): Record<number, TimelineItem[]> {
  // order by created at and group by year
  return groupAndSortByYear([...getAllMicroPosts()]);
}

function getAuthorBySlug(slug: string): Author {
  return getAllAuthors().find((a: Author) => a.slug === slug)!;
}

export {
  getAllPosts,
  getTimeline,
  getAuthorBySlug,
  getTimelinePosts,
  getTimelineMicroPosts,
};
export type { Post, Author, Tag };
