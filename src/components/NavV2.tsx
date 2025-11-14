import clsx from 'clsx';
import { Drawer } from 'vaul';
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
};

// Sub-component: Brand logo and name
function NavBrand() {
  return (
    <div className={clsx('flex items-center', 'gap-2')}>
      <img
        src={omLogo.src}
        alt="Om"
        className="h-4 w-auto"
      />
      <a
        href="/"
        className={clsx(
          'font-mlm-roman',
          'text-black',
          'hover:opacity-80',
          'transition-opacity'
        )}
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

// Sub-component: Mobile navigation drawer
type MobileNavDrawerProps = {
  links: NavLink[];
};

function MobileNavDrawer({ links }: MobileNavDrawerProps) {
  return (
    <div className="md:hidden">
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button
            className={clsx(
              'font-mlm-roman',
              'text-black',
              'hover:opacity-80',
              'transition-opacity',
              'text-xl',
              'leading-none'
            )}
            aria-label="Open navigation menu"
          >
            ⋯
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay
            className={clsx('fixed inset-0', 'bg-black/40', 'z-[60]')}
          />
          <Drawer.Content
            className={clsx(
              'bg-white',
              'flex flex-col',
              'rounded-lg',
              'h-[28%]',
              'fixed bottom-0 left-0 right-0',
              'outline-none',
              'z-[60]'
            )}
          >
            <Drawer.Title className={clsx('sr-only')}>
              Navigation Menu
            </Drawer.Title>
            <div className={clsx('py-4')}>
              <Drawer.Handle />
            </div>
            <div className={clsx('flex flex-col', 'gap-4', 'px-6 pb-8')}>
              {links.map((link) => (
                <Drawer.Close
                  key={link.href}
                  asChild
                >
                  <a
                    href={link.href}
                    className={clsx(
                      'font-mlm-roman',
                      'text-black',
                      'hover:opacity-80',
                      'transition-opacity',
                      'text-lg',
                      'py-2'
                    )}
                  >
                    {link.label}
                  </a>
                </Drawer.Close>
              ))}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

// Main component
function NavV2({ links = navLinks }: NavV2Props) {
  return (
    <nav
      className={clsx(
        'sticky top-0 z-50',
        'w-full',
        'backdrop-blur-md bg-white/70',
        'border-b border-black',
        'flex items-center justify-between',
        'px-4 py-[1px]'
      )}
    >
      <NavBrand />
      <DesktopNavLinks links={links} />
      <MobileNavDrawer links={links} />
    </nav>
  );
}

export default NavV2;
export type { NavLink };
