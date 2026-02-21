import clsx from 'clsx';
import Img from '@src/components/Img';

type NavLink = {
  label: string;
  href: string;
};

const defaultNavLinks: NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Videos', href: '/videos' },
  { label: 'Projects', href: '/projects' },
  { label: 'Hire Me', href: '/hire' },
];

type SocialLink = {
  label: string;
  href: string;
};

const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/shivekkhurana' },
  { label: 'X.com', href: 'https://x.com/shivek_khurana' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shivekkhurana' },
  { label: 'Medium', href: 'https://medium.com/@shivekkhurana' },
  { label: 'Substack', href: 'https://shivekkhurana.substack.com/' },
  { label: 'SlideShare', href: 'https://www.slideshare.net/shivekkhurana' },
  { label: 'Reddit', href: 'https://www.reddit.com/user/shivekkhurana' },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@shivekkhurana?si=fyV-MrFjD0zRG-gA',
  },
  {
    label: 'Hacker News',
    href: 'https://news.ycombinator.com/user?id=shivekkhurana',
  },
  { label: 'Instagram (private)', href: 'https://www.instagram.com/sxivek/' },
];

const otherLinks: { label: string; href: string; external?: boolean }[] = [
  { label: 'RSS Feed', href: '/rss.xml' },
  { label: 'Tinycanva', href: '/tinycanva' },
  { label: 'Genomics Landscape', href: '/genomics-landscape' },
  {
    label: 'View Stats',
    href: 'https://shivekkhurana.goatcounter.com/',
    external: true,
  },
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
      <p
        className={clsx(
          'font-mlm-roman',
          'text-black/60',
          'text-sm',
          'mb-4 mt-12 md:mt-0'
        )}
      >
        Socials
      </p>
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
      <p
        className={clsx(
          'font-mlm-roman',
          'text-black/60',
          'text-sm',
          'mb-4',
          'mt-12 md:mt-0'
        )}
      >
        Source
      </p>
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
      <p
        className={clsx(
          'font-mlm-roman',
          'text-black/60',
          'text-sm',
          'mb-4',
          'mt-12 md:mt-0'
        )}
      >
        Navigation
      </p>
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
      <p className={clsx('font-mlm-roman', 'text-black/60', 'text-sm', 'mb-2')}>
        License
      </p>
      <div className={clsx('flex flex-col', 'gap-2', 'max-w-xs')}>
        <p className={clsx('font-mlm-roman', 'text-black', 'text-sm')}>
          © Shivek Khurana {currentYear} | Except where otherwise noted, all
          content is licensed under CC BY-SA 4.0.
        </p>
      </div>
      <div className="mt-8 sm:flex sm:justify-center">
        <Img
          path="/img/sketches/hippo-straight-pov.png"
          alt="Hippo sketch"
          className="w-[80px] sm:w-[160px]"
        />
      </div>
    </div>
  );
}

function OtherLinksColumn() {
  return (
    <div className="font-mlm-roman">
      <p className={clsx('text-black/60', 'text-sm', 'mb-4', 'mt-12 md:mt-0')}>
        Addendum
      </p>
      <ul className={clsx('flex flex-col', 'gap-2')}>
        {otherLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              {...(link.external && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
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
        'py-8 mb-16'
      )}
    >
      <div className={clsx('w-11/12 mx-auto lg:w-10/12 xl:w-8/12')}>
        <div className={clsx('flex flex-col md:flex-row', 'md:gap-12')}>
          <IdentityBlock />
          <SocialsColumn />
          <SourceColumn />
          <NavigationColumn navLinks={navLinks} />
          <OtherLinksColumn />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
