import clsx from 'clsx';

function PostClosing() {
  return (
    <div className={clsx('w-full', 'border-t border-black mt-12 pt-8')}>
      <div className={clsx('w-10/12 md:w-8/12 lg:w-6/12 mx-auto')}>
        <div
          className={clsx(
            'flex flex-col md:flex-row',
            'items-start',
            'gap-6 md:gap-8'
          )}
        >
          <div className="flex-1 text-left">
            {/* Name */}
            <h4 className={clsx('font-bold')}>Shivek Khurana</h4>

            {/* Headline */}
            <p className={clsx('text-base', 'opacity-80', 'mb-6 max-w-2xl')}>
              I make things. Mostly software, but sometimes clothes, courses,
              videos, or essays.
            </p>

            {/* CTA Buttons */}
            <div className={clsx('flex gap-3', 'justify-start')}>
              <a
                href="https://github.com/shivekkhurana"
                target="_blank"
                rel="noopener noreferrer"
                className={clsx('border border-black/20', 'text-sm px-2')}
              >
                Follow me on GitHub
              </a>
              <a
                href="/about"
                target="_blank"
                rel="noopener noreferrer"
                className={clsx('border border-black/80', 'text-sm px-2')}
              >
                About
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostClosing;
