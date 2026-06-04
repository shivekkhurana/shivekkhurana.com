import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import { renderMarkdown } from './src/components/Markdown';

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
    heroImgCaption: {
      type: 'string',
      required: false,
    },
    slug: { type: 'string' },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    relatedSlugs: { type: 'list', of: { type: 'string' }, required: false },
    author: { type: 'string' },
  },
  computedFields: {
    parsedMd: {
      type: 'string',
      resolve: async (doc) => {
        const html = await renderMarkdown(doc.body.raw);
        return html;
     },
    },
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

const Video = defineDocumentType(() => ({
  name: 'Video',
  filePathPattern: 'videos/*.md',
  fields: {
    publishedOn: { type: 'date', required: false },
    title: { type: 'string' },
    url: { type: 'string' },
    coverImg: { type: 'string', required: false },
  },
}));

const GenomicsInvestor = defineDocumentType(() => ({
  name: 'GenomicsInvestor',
  filePathPattern: 'genomicsLandscape/investors/*.md',
  fields: {
    slug: { type: 'string' },
    name: { type: 'string' },
    website: { type: 'string', required: false },
    location: { type: 'string', required: false },
    fundType: { type: 'string', required: false },
    stages: { type: 'list', of: { type: 'string' }, required: false },
    typicalInvestmentRange: { type: 'string', required: false },
    aum: { type: 'string', required: false },
    founded: { type: 'number', required: false },
    description: { type: 'string', required: false },
    lastResearched: { type: 'date', required: false },
  },
}));

const GenomicsCompany = defineDocumentType(() => ({
  name: 'GenomicsCompany',
  filePathPattern: 'genomicsLandscape/companies/*.md',
  fields: {
    slug: { type: 'string' },
    name: { type: 'string' },
    website: { type: 'string', required: false },
    location: { type: 'string', required: false },
    categories: { type: 'list', of: { type: 'string' }, required: false },
    founded: { type: 'string', required: false },
    description: { type: 'string', required: false },
    logo: { type: 'string', required: false },
    lastResearched: { type: 'date', required: false },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [
    Post,
    Tag,
    Author,
    Project,
    Video,
    GenomicsInvestor,
    GenomicsCompany,
  ],
  disableImportAliasWarning: true,
  contentDirExclude: ['pages'],
});
