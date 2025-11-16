import clsx from 'clsx';
import type { Project } from '@contentlayer/generated';
import ProjectItem from '@src/components/ProjectItem';

function Projects({
  projects,
  totalProjects,
}: {
  projects: Project[];
  totalProjects: number;
}) {
  return (
    <section className="font-mlm-roman mt-16">
      <h2 className="text-lg font-bold font-mlm-roman mb-4">Projects</h2>
      <div className="text-sm"></div>
      {projects.map((project) => {
        return (
          <ProjectItem
            project={project}
            key={project.slug!}
          />
        );
      })}
      <div className="mt-4">
        <a
          href="/projects"
          className={clsx('inline-block h-[30px] px-[10px]', 'border')}
        >
          View all {totalProjects} projects
        </a>
      </div>
    </section>
  );
}
export default Projects;
