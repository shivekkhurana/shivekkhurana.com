import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { getAllProjects } from '@src/domain/content';
import type { Project } from '@src/domain/content';

function Project(props: PropsWithChildren<{ project: Project }>) {
  const { title, logo, companyUrl, description } = props.project;
  return (
    <div className={clsx('flex items-start', 'mt-3')}>
      <div className="shrink-0 pt-1 pr-2">
        <img
          src={logo}
          alt={`${title} logo`}
          className={clsx('w-[24px] h-[24px]', '')}
        />
      </div>
      <div className={clsx('')}>
        <h4 className={clsx('font-bold text-sm')}>{title}</h4>
        <p className={clsx('opacity-60 text-sm')}>{description}</p>
        <a
          href={companyUrl}
          target="_blank"
          className={clsx('text-sky-700 text-sm')}
        >
          {companyUrl}
        </a>
      </div>
    </div>
  );
}

function Projects() {
  const projects = getAllProjects();

  return (
    <div className="w-[90%]">
      <p className="text-sm opacity-60 mb-4">
        Currently dedicating my time to learn and build AI systems. In the past,
        I worked on enterprise software, crypto, health hacking and fashion
        design.
      </p>
      {projects.map((p: Project) => (
        <Project
          key={p.slug}
          project={p}
        />
      ))}
    </div>
  );
}

export default Projects;
