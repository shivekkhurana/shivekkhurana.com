import { useState } from 'react';
import clsx from 'clsx';

function Hero() {
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const profilePhotoSrc = '/img/hero/profile-photo.png';

  return (
    <div className="mt-48 mb-24 font-mlm-roman">
      {/* Heading */}
      <h1 className="font-bold text-2xl md:text-3xl mb-6">Shivek Khurana</h1>

      {/* Intro text */}
      <div className="mb-8 space-y-2 text-lg opacity-80">
        <p>
          I make things. Mostly software, but sometimes clothes, courses,
          videos, or essays.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 items-start mt-4">
        {/* About Button with hover photo */}
        <div className="relative">
          {showProfilePhoto && (
            <img
              src={profilePhotoSrc}
              alt="Shivek Khurana"
              className={clsx('w-12 h-auto', 'absolute bottom-full left-[8px]')}
            />
          )}
          <a
            href="/about"
            className={clsx('inline-block h-[30px] px-[10px]', 'border')}
            onMouseEnter={() => setShowProfilePhoto(true)}
            onMouseLeave={() => setShowProfilePhoto(false)}
          >
            About
          </a>
        </div>

        {/* Available for consultancy Button */}
        <a
          href="/consultancy"
          className={clsx(
            'inline-block h-[30px] px-[10px]',
            'border border-black/60'
          )}
        >
          Consultancy
        </a>
      </div>
    </div>
  );
}

export default Hero;
