import clsx from 'clsx';
import { useEffect, useState, useRef } from 'react';
import omLogo from '@src/img/om.svg';

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: 'My story', href: '/' },
  { label: 'Consultancy', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

type NavV2Props = {
  links?: NavLink[];
  showBrandOnScroll?: boolean; // When true, brand only shows after scrolling
};

// Sub-component: Brand logo and name with scroll-triggered animation
type NavBrandProps = {
  isVisible: boolean;
};

function NavBrand({ isVisible }: NavBrandProps) {
  return (
    <div className={clsx('flex items-center', 'gap-2')}>
      <img
        src={omLogo.src}
        alt="Om"
        className="h-[16px] w-[20.8px]"
      />
      <a
        href="/"
        className={clsx('font-mlm-roman', 'text-black')}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
      >
        Shivek Khurana
      </a>
    </div>
  );
}

// Sub-component: Desktop navigation links
type DesktopNavLinksProps = {
  links: NavLink[];
};

function DesktopNavLinks({ links }: DesktopNavLinksProps) {
  return (
    <div className={clsx('hidden md:flex', 'items-center', 'gap-6')}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={clsx(
            'font-mlm-roman',
            'text-black',
            'hover:opacity-80',
            'transition-opacity'
          )}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

// Sub-component: Mobile navigation dropdown
type MobileNavDropdownProps = {
  links: NavLink[];
};

function MobileNavDropdown({ links }: MobileNavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'font-mlm-roman',
          'text-black',
          'text-sm',
          'leading-none',
          'outline-none'
        )}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
      >
        &#8226;&#8226;
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          className={clsx(
            'absolute',
            'top-full',
            'right-0',
            'mt-1',
            'bg-white',
            'border',
            'border-black',
            'shadow-none',
            'z-[60]',
            'min-w-[160px]'
          )}
        >
          <div className={clsx('flex flex-col', 'py-1')}>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  'font-mlm-roman',
                  'text-black',
                  'px-4',
                  'py-2',
                  'text-sm',
                  'block',
                  'hover:bg-black',
                  'hover:text-white'
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Main component
function NavV2({ links = navLinks, showBrandOnScroll = true }: NavV2Props) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!showBrandOnScroll) {
      // If showBrandOnScroll is false, always show the brand
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      // Show brand after scrolling 50px
      const scrollY = window.scrollY || window.pageYOffset;
      setIsScrolled(scrollY > 50);
    };

    // Check initial scroll position
    handleScroll();

    // Add scroll listener with throttling
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [showBrandOnScroll]);

  return (
    <nav
      className={clsx(
        'sticky top-0 z-50',
        'rounded-t-lg',
        'w-full',
        'backdrop-blur-md bg-white/70',
        'border-b border-black',
        'flex items-center justify-between',
        'px-2 py-[1px]'
      )}
    >
      <NavBrand isVisible={isScrolled} />

      <DesktopNavLinks links={links} />
      <MobileNavDropdown links={links} />
    </nav>
  );
}

export default NavV2;
export type { NavLink };
export { navLinks };
