const R = require('ramda');

import { describe, expect, it, beforeAll } from 'bun:test';

const {
  filterUnwantedExtensions,
  computePathAndName,
  sourceDir,
  destDir,
  appendOptimizedPath,
  stripFileNames,
  filesToProcess,
  isPostImage,
  requiredOptimizedFiles,
} = require('./optimize-img');

beforeAll(async () => {});

describe('filterUnwantedExtensions()', () => {
  it('should remove .DS_Store, .svg and .gif files from list of files', () => {
    const files = [
      'public/img/.DS_Store',
      'public/img/boy.svg',
      'public/img/anim.gif',
      'public/img/ok.png',
    ];

    const filtered = R.transduce(
      filterUnwantedExtensions,
      R.flip(R.append),
      [],
      files
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0]).toEqual('public/img/ok.png');
  });
});

describe('computePathAndname()', () => {
  it('spilts a file into its path and name', () => {
    const files = [
      'public/img/content/posts/a.jpg',
      'public/img/content/authors/b.jpg',
    ];
    const computedFiles = R.transduce(
      computePathAndName,
      R.flip(R.append),
      [],
      files
    );

    expect(computedFiles).toHaveLength(2);

    expect(computedFiles[0]).toHaveProperty(
      'filePath',
      'public/img/content/posts'
    );
    expect(computedFiles[0]).toHaveProperty('name', 'a.jpg');

    expect(computedFiles[1]).toHaveProperty(
      'filePath',
      'public/img/content/authors'
    );
    expect(computedFiles[1]).toHaveProperty('name', 'b.jpg');
  });
});

describe('appendOptimizedPath()', () => {
  it('spilts a file into its path and name', () => {
    const pathAndNames = [
      { filePath: 'public/img/content/posts', name: 'a.jpg' },
    ];
    const computedFiles = R.transduce(
      appendOptimizedPath,
      R.flip(R.append),
      [],
      pathAndNames
    );

    expect(computedFiles).toHaveLength(1);
    expect(computedFiles[0]).toHaveProperty(
      'filePath',
      'public/img/content/posts'
    );
    expect(computedFiles[0]).toHaveProperty(
      'optimizedPath',
      'public/optimized-img/content/posts/a.jpg'
    );
    expect(computedFiles[0]).toHaveProperty('name', 'a.jpg');
  });
});

describe('stripFileNames()', () => {
  it('removes file names and retursn a list of unique dirs', () => {
    const optimizedFiles = [
      'public/optimized-img/contents/a.jpg/w-20.webp',
      'public/optimized-img/contents/a.jpg/w-40.webp',
      'public/optimized-img/contents/a.jpg/w-80.webp',
      'public/optimized-img/contents/b.jpg/w-20.webp',
      'public/optimized-img/contents/b.jpg/w-40.webp',
      'public/optimized-img/contents/b.jpg/w-80.webp',
    ];

    const stripped = stripFileNames(optimizedFiles);
    expect(stripped).toHaveLength(2);
    expect(stripped[0]).toEqual('public/optimized-img/contents/a.jpg');
    expect(stripped[1]).toEqual('public/optimized-img/contents/b.jpg');
  });
});

describe('filesToProcess()', () => {
  const completeOptimizedFilesFor = (sourcePath) => {
    const [component] = R.transduce(
      R.compose(computePathAndName, appendOptimizedPath),
      R.flip(R.append),
      [],
      [sourcePath]
    );

    return requiredOptimizedFiles(component);
  };

  it('should check all files against optimized files and return un-optimized files', () => {
    const allFiles = [
      'public/img/content/authors/a1.jpg',
      'public/img/content/posts/p1.jpg',
      'public/img/content/a.jpg', // processed
      'public/img/content/b.jpg', // processed
    ];
    const optimizedFiles = [
      ...completeOptimizedFilesFor('public/img/content/a.jpg'),
      ...completeOptimizedFilesFor('public/img/content/b.jpg'),
    ];

    const toProcess = filesToProcess(allFiles, optimizedFiles);

    expect(toProcess).toHaveLength(2);

    expect(toProcess[0]).toHaveProperty(
      'filePath',
      'public/img/content/authors'
    );
    expect(toProcess[0]).toHaveProperty('name', 'a1.jpg');
    expect(toProcess[0]).toHaveProperty(
      'optimizedPath',
      'public/optimized-img/content/authors/a1.jpg'
    );

    expect(toProcess[1]).toHaveProperty('filePath', 'public/img/content/posts');
    expect(toProcess[1]).toHaveProperty('name', 'p1.jpg');
    expect(toProcess[1]).toHaveProperty(
      'optimizedPath',
      'public/optimized-img/content/posts/p1.jpg'
    );
  });

  it('returns a post image when its optimized directory is missing og.jpg', () => {
    const sourcePath = 'public/img/content/posts/p1.jpg';
    const optimizedFiles = completeOptimizedFilesFor(sourcePath).filter(
      (filePath) => !filePath.endsWith('/og.jpg')
    );

    const toProcess = filesToProcess([sourcePath], optimizedFiles);

    expect(toProcess).toHaveLength(1);
    expect(toProcess[0]).toHaveProperty('name', 'p1.jpg');
  });

  it('returns an image when its optimized directory is missing a WebP width', () => {
    const sourcePath = 'public/img/content/authors/a1.jpg';
    const optimizedFiles = completeOptimizedFilesFor(sourcePath).filter(
      (filePath) => !filePath.endsWith('/w-720.webp')
    );

    const toProcess = filesToProcess([sourcePath], optimizedFiles);

    expect(toProcess).toHaveLength(1);
    expect(toProcess[0]).toHaveProperty('name', 'a1.jpg');
  });

  it('returns an image when its optimized directory is missing a blurred WebP', () => {
    const sourcePath = 'public/img/content/authors/a1.jpg';
    const optimizedFiles = completeOptimizedFilesFor(sourcePath).filter(
      (filePath) => !filePath.endsWith('/w-480-blurred.webp')
    );

    const toProcess = filesToProcess([sourcePath], optimizedFiles);

    expect(toProcess).toHaveLength(1);
    expect(toProcess[0]).toHaveProperty('name', 'a1.jpg');
  });

  it('does not require og.jpg for non-post images', () => {
    const sourcePath = 'public/img/content/authors/a1.jpg';
    const optimizedFiles = completeOptimizedFilesFor(sourcePath);

    expect(
      optimizedFiles.some((filePath) => filePath.endsWith('/og.jpg'))
    ).toBe(false);
    expect(filesToProcess([sourcePath], optimizedFiles)).toHaveLength(0);
  });

  it('skips images whose optimized directories have all required files', () => {
    const allFiles = [
      'public/img/content/authors/a1.jpg',
      'public/img/content/posts/p1.jpg',
    ];
    const optimizedFiles = allFiles.flatMap(completeOptimizedFilesFor);

    expect(filesToProcess(allFiles, optimizedFiles)).toHaveLength(0);
  });
});

describe('isPostImage()', () => {
  it('matches post images in nested directories', () => {
    expect(
      isPostImage({
        filePath: 'public/img/content/posts/nested',
        name: 'p1.jpg',
      })
    ).toBe(true);
  });

  it('does not match non-post content images', () => {
    expect(
      isPostImage({
        filePath: 'public/img/content/authors',
        name: 'a1.jpg',
      })
    ).toBe(false);
  });
});
