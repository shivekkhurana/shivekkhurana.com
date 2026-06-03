import clsx from 'clsx';
import Img from './Img';

function HireFloating() {
  const profilePhotoPath = '/img/hero/profile-photo.png';

  return (
    <>
      <a
        href="/hire"
        className={clsx(
          'hire-floating fixed z-50',
          'left-4 right-4 md:left-auto md:right-4',
          'flex items-center gap-4',
          'backdrop-blur-md bg-white/70',
          'border border-black border-dotted',
          'px-2',
          'hover:bg-gray-100 transition-colors',
          'cursor-pointer',
          'md:max-w-[280px]'
        )}
      >
        <Img
          path={profilePhotoPath}
          alt="Shivek Khurana"
          defaultWidth={80}
          className="w-12 h-12 object-cover"
        />
        <div className="font-mlm-roman py-2">
          <div className="font-bold text-sm">Hire Shivek</div>
          <div className="text-xs opacity-80 leading-tight">
            Build AI systems. Ship MVPs.
            <br />
            Go from 0 to 1. Fast.
          </div>
        </div>
      </a>
      {/* Inline because these scroll-linked timeline rules depend on the page-end marker in Body.astro. */}
      <style>{`
        .hire-floating {
          bottom: 0.5rem;
        }

        @supports (animation-timeline: view()) {
          body {
            timeline-scope: --hire-page-end;
          }

          .hire-floating-page-end {
            position: absolute;
            inset-block-end: 0;
            inset-inline: 0;
            block-size: 8rem;
            pointer-events: none;
            view-timeline: --hire-page-end block;
          }

          .hire-floating {
            animation: hire-floating-lift 1s ease-out both;
            animation-timeline: --hire-page-end;
            animation-range: entry 0% entry 100%;
          }

          @keyframes hire-floating-lift {
            from {
              bottom: 0.5rem;
            }
            to {
              bottom: 1rem;
            }
          }
        }
      `}</style>
    </>
  );
}

export default HireFloating;
