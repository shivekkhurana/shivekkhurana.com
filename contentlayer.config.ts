import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { getHighlighter } from 'shiki';

const marked = new Marked(
  markedHighlight({
    async: true,
    async highlight(code, lang, _info) {
      const highlighter = await getHighlighter({ theme: 'monokai' });
      return highlighter.codeToHtml(code, lang);
    },
  })
);

const Tag = defineDocumentType(() => ({
  name: 'Tag',
  filePathPattern: 'tags/*.md',
  fields: {
    slug: { type: 'string' },
    title: { type: 'string' },
    icon: { type: 'string', required: false },
    featured: { type: 'boolean', default: false, required: false },
  },
}));

const Author = defineDocumentType(() => ({
  name: 'Author',
  filePathPattern: 'authors/*.md',
  fields: {
    slug: { type: 'string' },
    name: { type: 'string' },
    twitter: { type: 'string', required: false },
    github: { type: 'string', required: false },
    linkedin: { type: 'string', required: false },
    medium: { type: 'string', required: false },
    gpgKey: { type: 'string', required: false },
    clubhouse: { type: 'string', required: false },
    youtube: { type: 'string', required: false },
    profilePicture: { type: 'string', required: true },
    shortBio: { type: 'string', require: true },
  },
}));

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/*.md',
  fields: {
    publishedOn: { type: 'date', required: false },
    title: { type: 'string' },
    subTitle: { type: 'string', required: false },
    canonicalUrl: { type: 'string', required: false },
    featured: { type: 'boolean', default: false, required: false },
    heroImg: {
      type: 'string',
      required: true,
    },
    slug: { type: 'string' },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    relatedSlugs: { type: 'list', of: { type: 'string' }, required: false },
    author: { type: 'string' },
  },
  computedFields: {
    parsedMd: {
      type: 'string',
      resolve: (doc) => {
        return marked.parse(doc.body.raw);
      },
    },
  },
}));

const MicroPost = defineDocumentType(() => ({
  name: 'MicroPost',
  filePathPattern: 'microPosts/*.md',
  fields: {
    publishedOn: { type: 'date', required: false },
    slug: { type: 'string' },
    author: { type: 'string' },
    //   body: { type: 'markdown' },
  },
}));

const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'projects/*.md',
  fields: {
    title: { type: 'string' },
    companyName: { type: 'string' },
    companyUrl: { type: 'string' },
    logo: { type: 'string' },
    description: { type: 'string' },
    startDay: { type: 'date' },
    endDay: { type: 'date', required: false },
    slug: { type: 'string' },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, MicroPost, Tag, Author, Project],
  disableImportAliasWarning: true,
  contentDirExclude: ['pages'],
});
