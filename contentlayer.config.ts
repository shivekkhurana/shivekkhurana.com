import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { getHighlighter } from 'shiki';
import * as vega from 'vega';
import * as vegaLite from 'vega-lite';

// Helper to escape HTML entities
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Helper to render Vega-Lite spec to SVG
async function renderVegaToSvg(spec: string): Promise<string> {
  try {
    const parsedSpec = JSON.parse(spec);
    
    // Compile Vega-Lite to Vega
    const vegaSpec = vegaLite.compile(parsedSpec).spec;
    
    // Create a Vega view and render to SVG
    const view = new vega.View(vega.parse(vegaSpec), { renderer: 'none' });
    const svg = await view.toSVG();
    
    return `<div class="vega-chart-container">
      <div class="vega-chart-wrapper">
        ${svg}
      </div>
    </div>`;
  } catch (error) {
    console.error('Failed to render Vega chart:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `<div style="margin: 1.5rem auto; max-width: 66%; padding: 1rem; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 0.25rem;">
      <p style="color: #dc2626; font-weight: 600;">Error rendering chart</p>
      <p style="color: #ef4444; font-size: 0.875rem; margin-top: 0.5rem;">Invalid Vega-Lite specification: ${errorMessage}</p>
    </div>`;
  }
}

const marked = new Marked(
  markedHighlight({
    async: true,
    async highlight(code, lang, _info) {
      // Render vega/vega-lite charts server-side as SVG
      if (lang === 'vega-lite' || lang === 'vega') {
        const svg = await renderVegaToSvg(code);
        return svg;
      }
      
      const highlighter = await getHighlighter({ theme: 'monokai' });
      const html = highlighter.codeToHtml(code, lang); 
      return html;
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
        const html = await marked.parse(doc.body.raw);
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
    GenomicsInvestor,
    GenomicsCompany,
  ],
  disableImportAliasWarning: true,
  contentDirExclude: ['pages'],
});
