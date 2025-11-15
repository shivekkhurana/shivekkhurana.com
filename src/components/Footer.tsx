import clsx from 'clsx';
import type { NavLink } from './NavV2';
import { navLinks as defaultNavLinks } from './NavV2';

type SocialLink = {
  label: string;
  href: string;
};

const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/shivekkhurana' },
  { label: 'X.com', href: 'https://x.com/shivek_khurana' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shivekkhurana' },
  { label: 'Medium', href: 'https://medium.com/@shivekkhurana' },
  { label: 'Reddit', href: 'https://www.reddit.com/user/shivekkhurana' },
];

type Repo = {
  name: string;
  url: string;
};

const repos: Repo[] = [
  {
    name: 'website',
    url: 'https://github.com/shivekkhurana/shivekkhurana.com',
  },
  {
    name: 'state-of-being',
    url: 'https://github.com/shivekkhurana/state-of-being',
  },
];

function SocialsColumn() {
  return (
    <div>
      <h4
        className={clsx(
          'font-mlm-roman',
          'text-black/60',
          'text-sm',
          'mb-4 mt-12 md:mt-0'
        )}
      >
        Socials
      </h4>
      <ul className={clsx('flex flex-col', 'gap-2')}>
        {socialLinks.map((social) => (
          <li key={social.href}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'font-mlm-roman',
                'text-black',
                'hover:opacity-80',
                'transition-opacity'
              )}
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SourceColumn() {
  return (
    <div>
      <h4
        className={clsx(
          'font-mlm-roman',
          'text-black/60',
          'text-sm',
          'mb-4',
          'mt-12 md:mt-0'
        )}
      >
        Source
      </h4>
      <ul className={clsx('flex flex-col', 'gap-2')}>
        {repos.map((repo) => (
          <li key={repo.name}>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'font-mlm-roman',
                'text-black',
                'hover:opacity-80',
                'transition-opacity'
              )}
            >
              {repo.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavigationColumn({ navLinks }: { navLinks: NavLink[] }) {
  return (
    <div>
      <h4
        className={clsx('font-mlm-roman', 'text-black/60', 'text-sm', 'mb-4')}
      >
        Navigation
      </h4>
      <ul className={clsx('flex flex-col', 'gap-2')}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
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
          </li>
        ))}
      </ul>
    </div>
  );
}

function IdentityBlock() {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <h3
        className={clsx('font-mlm-roman', 'text-black/60', 'text-sm', 'mb-2')}
      >
        License
      </h3>
      <div className={clsx('flex flex-col', 'gap-2', 'max-w-xs')}>
        <p className={clsx('font-mlm-roman', 'text-black', 'text-sm')}>
          © Shivek Khurana {currentYear} | Except where otherwise noted, all
          content is licensed under CC BY-NC
        </p>
      </div>
    </div>
  );
}

type FooterProps = {
  navLinks?: NavLink[];
  repoUrl?: string;
};

function Footer({ navLinks = defaultNavLinks }: FooterProps) {
  return (
    <footer
      className={clsx(
        'w-full',
        'bg-white',
        'border-t border-black',
        'mt-24',
        'py-8'
      )}
    >
      <div className={clsx('w-11/12 mx-auto lg:w-10/12 xl:w-8/12')}>
        <div className={clsx('flex flex-col md:flex-row', 'md:gap-12')}>
          <IdentityBlock />
          <SocialsColumn />
          <SourceColumn />
          {/* 
          <NavigationColumn navLinks={navLinks} /> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
