import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { convertDateString } from '@src/utils/time';
import type { Project } from '@contentlayer/generated';
import Img from '@src/components/Img';
import { differenceInMonths } from 'date-fns';

interface ProjectItemProps extends PropsWithChildren {
  project: Project;
}

function ProjectItem({ project }: ProjectItemProps) {
  const {
    title,
    companyName,
    companyUrl,
    logo,
    description,
    startDay,
    endDay,
    slug,
  } = project;

  // Calculate date range with year and months
  let dateRange = '';
  if (startDay) {
    const startDate = new Date(startDay);
    const startDateStr = convertDateString(startDay);

    if (endDay) {
      const endDate = new Date(endDay);
      const endDateStr = convertDateString(endDay);
      const months = differenceInMonths(endDate, startDate);
      dateRange = `${startDateStr} - ${endDateStr} (${months} months)`;
    } else {
      const endDate = new Date();
      const months = differenceInMonths(endDate, startDate);
      dateRange = `${startDateStr} - Present (${months} months)`;
    }
  }

  return (
    <div id={slug} className={clsx('flex gap-4 scroll-mt-8', 'py-3', 'mb-4')}>
      <div className="w-6 h-6 shrink-0 bg-gray-100">
        {logo && (
          <Img
            path={logo}
            alt={`${companyName} logo`}
            defaultWidth={32}
            className={clsx('w-full h-full object-contain')}
          />
        )}
      </div>
      <div className={clsx('flex-1')}>
        <div className={clsx('flex items-center gap-2', 'mb-1')}>
          {title && (
            <span className={clsx('text-sm font-bold')}>
              {title} at {companyName}
            </span>
          )}
        </div>
        {dateRange && (
          <div className={clsx('text-xs opacity-60')}>{dateRange}</div>
        )}
        {companyUrl && (
          <a
            href={companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'text-sm underline underline-offset-4 decoration-gray-200 hover:decoration-pink-500 transition-colors'
            )}
          >
            {companyUrl}
          </a>
        )}
      </div>
    </div>
  );
}

export default ProjectItem;
