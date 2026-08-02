import {
  useEffect,
  useState,
  type ComponentProps,
  type ReactElement,
} from 'react';
import clsx from 'clsx';
import {
  ActivityIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BarChart3Icon,
  CheckIcon,
  ChevronRightIcon,
  CopyIcon,
  CreditCardIcon,
  DownloadIcon,
  ExternalLinkIcon,
  HomeIcon,
  SettingsIcon,
  UserPlusIcon,
  XIcon,
  type LucideIcon,
} from 'lucide-react';
import 'react-morpheus/style.css';
import {
  Morpheus,
  MorphAnchor,
  morphSpringPresets,
  type MorphSpringPreset,
} from 'react-morpheus';
import {
  CuelumeBinding,
  CuelumeSound,
  playCuelumeSound,
} from '@src/lib/cuelume';

type DemoTab = 'basic' | 'nested' | 'wizard';
type DemoMorpheusProps = Omit<
  ComponentProps<typeof Morpheus>,
  'direction'
> & {
  direction?: never;
};

const DemoMorpheus = Morpheus as unknown as (
  props: DemoMorpheusProps
) => ReactElement;

const anchorOptions = [
  MorphAnchor.LeftTop,
  MorphAnchor.LeftMiddle,
  MorphAnchor.LeftBottom,
  MorphAnchor.TopMiddle,
  MorphAnchor.MiddleMiddle,
  MorphAnchor.RightTop,
  MorphAnchor.RightMiddle,
  MorphAnchor.RightBottom,
  MorphAnchor.BottomMiddle,
];

const demoTabs: { id: DemoTab; label: string }[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'nested', label: 'Nested' },
  { id: 'wizard', label: 'Wizard' },
];

const springOptions: { id: MorphSpringPreset; label: string }[] = [
  { id: 'balanced', label: 'Balanced' },
  { id: 'smooth', label: 'Smooth' },
  { id: 'snappy', label: 'Snappy' },
  { id: 'wobbly', label: 'Wobbly' },
  { id: 'heavy', label: 'Heavy' },
];

const overlayColors = [
  { label: 'Slate', value: '#0f172a' },
  { label: 'Blue', value: '#082f49' },
  { label: 'Emerald', value: '#064e3b' },
  { label: 'Rose', value: '#4c0519' },
];

const anchorLabels: Record<MorphAnchor, string> = {
  [MorphAnchor.LeftTop]: 'Left top',
  [MorphAnchor.LeftMiddle]: 'Left center',
  [MorphAnchor.LeftBottom]: 'Left bottom',
  [MorphAnchor.TopMiddle]: 'Top center',
  [MorphAnchor.MiddleMiddle]: 'Center',
  [MorphAnchor.RightTop]: 'Right top',
  [MorphAnchor.RightMiddle]: 'Right center',
  [MorphAnchor.RightBottom]: 'Right bottom',
  [MorphAnchor.BottomMiddle]: 'Bottom center',
};

type DemoSettings = {
  anchor: MorphAnchor;
  overlayBlur: number;
  overlayColor: string;
  overlayOpacity: number;
  springPreset: MorphSpringPreset;
};

type DemoProps = {
  mounted: boolean;
  settings: DemoSettings;
};

type HeroCopyTarget = string | null;
type HeroCopyOption = {
  id: string;
  label: string;
  runtimeLabel?: string;
  value: string;
};

const loshmiButtonBase =
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-[3px] focus-visible:ring-slate-400/25 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';
const loshmiButtonDefault =
  'bg-slate-950 text-white shadow-xs hover:bg-slate-800';
const loshmiButtonDarkSecondary =
  'bg-white/10 text-white shadow-xs hover:bg-white/15';
const loshmiButtonDarkGhost =
  'text-slate-300 hover:bg-white/10 hover:text-white';
const loshmiButtonOutline =
  'border border-slate-300 bg-transparent text-slate-700 shadow-xs hover:bg-slate-100 hover:text-slate-950';
const controlButtonBase = clsx(
  loshmiButtonBase,
  'h-8 px-2 text-xs leading-tight'
);
const controlButtonActive =
  'bg-slate-700 text-white shadow-xs hover:bg-slate-600';
const controlButtonIdle =
  'text-slate-600 hover:bg-slate-200 hover:text-slate-900';
const heroActionBase =
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-[11px] font-normal text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-slate-400/25';

const githubUrl = 'https://github.com/shivekkhurana/react-morpheus';
const installOptions: HeroCopyOption[] = [
  {
    id: 'bun',
    label: 'bun add react-morpheus',
    runtimeLabel: 'Bun',
    value: 'bun add react-morpheus',
  },
  {
    id: 'pnpm',
    label: 'pnpm add react-morpheus',
    runtimeLabel: 'pnpm',
    value: 'pnpm add react-morpheus',
  },
  {
    id: 'yarn',
    label: 'yarn add react-morpheus',
    runtimeLabel: 'Yarn',
    value: 'yarn add react-morpheus',
  },
  {
    id: 'npm',
    label: 'npm i react-morpheus',
    runtimeLabel: 'Node',
    value: 'npm i react-morpheus',
  },
];
const agentsMarkdown = `# Repository Instructions

- Use Bun for this project. Run package scripts and project commands with \`bun\` rather than \`npm\`, \`pnpm\`, or \`yarn\`.
`;
const agentsOptions: HeroCopyOption[] = [
  {
    id: 'agents',
    label: 'Copy AGENTS.md',
    value: agentsMarkdown,
  },
];

function DemoControls({
  settings,
  setSettings,
}: {
  settings: DemoSettings;
  setSettings: (settings: DemoSettings) => void;
}) {
  return (
    <aside className="grid h-full content-start gap-5 rounded-b-2xl border-t border-slate-200 bg-slate-100 p-4 md:rounded-b-none md:rounded-r-2xl md:border-l md:border-t-0">
      <div className="grid gap-2">
        <h2 className="text-sm font-semibold text-slate-950">Morph anchor</h2>
        <div className="grid grid-cols-2 gap-2">
          {anchorOptions.map((item) => (
            <button
              key={item}
              type="button"
              title={item}
              data-cuelume-press={CuelumeSound.Toggle}
              onClick={() => setSettings({ ...settings, anchor: item })}
              className={clsx(
                controlButtonBase,
                item === settings.anchor
                  ? controlButtonActive
                  : controlButtonIdle
              )}
            >
              {anchorLabels[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="text-sm font-semibold text-slate-950">Spring</h2>
        <div className="grid grid-cols-2 gap-2">
          {springOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              data-cuelume-press={CuelumeSound.Toggle}
              onClick={() =>
                setSettings({ ...settings, springPreset: item.id })
              }
              className={clsx(
                controlButtonBase,
                item.id === settings.springPreset
                  ? controlButtonActive
                  : controlButtonIdle
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="text-sm font-semibold text-slate-950">Overlay color</h2>
        <div className="grid grid-cols-4 gap-2">
          {overlayColors.map((item) => (
            <button
              key={item.value}
              type="button"
              title={item.label}
              data-cuelume-press={CuelumeSound.Toggle}
              onClick={() =>
                setSettings({ ...settings, overlayColor: item.value })
              }
              className={clsx(
                loshmiButtonBase,
                'h-8 rounded-lg border',
                item.value === settings.overlayColor
                  ? 'border-slate-500 ring-2 ring-slate-300'
                  : 'border-slate-200 hover:border-slate-300'
              )}
              style={{ backgroundColor: item.value }}
            />
          ))}
        </div>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-slate-950">
        Overlay blur
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="16"
            step="1"
            value={settings.overlayBlur}
            onChange={(event) =>
              setSettings({
                ...settings,
                overlayBlur: Number(event.currentTarget.value),
              })
            }
            className="min-w-0 flex-1 accent-slate-700"
          />
          <span className="w-10 text-right text-sm font-semibold text-slate-500">
            {settings.overlayBlur}px
          </span>
        </div>
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-950">
        Overlay opacity
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={Math.round(settings.overlayOpacity * 100)}
            onChange={(event) =>
              setSettings({
                ...settings,
                overlayOpacity: Number(event.currentTarget.value) / 100,
              })
            }
            className="min-w-0 flex-1 accent-slate-700"
          />
          <span className="w-10 text-right text-sm font-semibold text-slate-500">
            {Math.round(settings.overlayOpacity * 100)}%
          </span>
        </div>
      </label>
    </aside>
  );
}

function ChartCard({ onDismiss }: { onDismiss: () => void }) {
  const bars = [42, 66, 54, 82, 74, 92, 88];
  const points = bars
    .map((value, index) => `${index * 60 + 18},${160 - value * 1.25}`)
    .join(' ');

  return (
    <section className="w-[min(30rem,calc(100vw-3rem))] rounded-2xl border border-slate-800 bg-slate-950 font-sans text-white">
      <header className="flex items-start justify-between gap-5 border-b border-slate-800 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Pipeline
          </p>
          <h2 className="mt-1 text-xl font-semibold">Revenue forecast</h2>
        </div>
        <button
          type="button"
          aria-label="Close forecast"
          onClick={onDismiss}
          className={clsx(loshmiButtonBase, loshmiButtonDarkGhost, 'h-8 w-8')}
        >
          <XIcon aria-hidden="true" />
        </button>
      </header>

      <div className="px-5 py-5">
        <div className="relative h-44 border-b border-slate-800">
          <div className="absolute inset-x-0 top-3 grid h-32 grid-rows-4">
            {[0, 1, 2, 3].map((line) => (
              <span
                key={line}
                className="border-t border-white/10"
              />
            ))}
          </div>
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-2 h-36 w-full"
            viewBox="0 0 396 176"
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              points={points}
              stroke="#5eead4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-3">
            {bars.map((value, index) => (
              <div
                key={index}
                className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
              >
                <div
                  className="w-full rounded-t-lg"
                  style={{
                    backgroundColor: '#e2e8f0',
                    height: `${value}%`,
                  }}
                />
                <span className="text-[0.68rem] font-medium text-slate-500">
                  W{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            ['ARR', '$1.28M'],
            ['Close rate', '41%'],
            ['Cycle', '23d'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-800 bg-white/5 px-3 py-3"
            >
              <span className="block text-xs font-semibold uppercase text-slate-500">
                {label}
              </span>
              <span className="mt-1 block text-sm font-semibold text-white">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OpenChartButton({
  expanded,
  onActivate,
}: {
  expanded: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      data-cuelume-press={CuelumeSound.Toggle}
      onClick={onActivate}
      className={clsx(
        loshmiButtonBase,
        loshmiButtonDefault,
        'h-12 min-w-64 px-7',
        expanded && 'opacity-0'
      )}
    >
      <BarChart3Icon aria-hidden="true" />
      View forecast
    </button>
  );
}

function OpenSignupButton({
  expanded,
  onActivate,
}: {
  expanded: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      data-cuelume-press={CuelumeSound.Toggle}
      onClick={onActivate}
      className={clsx(
        loshmiButtonBase,
        loshmiButtonDefault,
        'h-12 min-w-64 px-7',
        expanded && 'opacity-0'
      )}
    >
      <UserPlusIcon aria-hidden="true" />
      Create account
    </button>
  );
}

function BasicDemo({ mounted, settings }: DemoProps) {
  const [expanded, setExpanded] = useState(false);

  const collapsedContent = (
    <OpenChartButton
      expanded={expanded}
      onActivate={() => setExpanded(true)}
    />
  );

  return (
    <div className="grid min-h-[24rem] h-full place-items-center bg-white">
      {mounted ? (
        <DemoMorpheus
          anchor={settings.anchor}
          onClose={() => {
            playCuelumeSound(CuelumeSound.Release);
            setExpanded(false);
          }}
          className="relative inline-block align-top"
          expanded={expanded}
          overlayBlur={settings.overlayBlur}
          overlayColor={settings.overlayColor}
          overlayOpacity={settings.overlayOpacity}
          overlayZIndex={1200}
          spring={morphSpringPresets[settings.springPreset]}
          collapsedContent={collapsedContent}
          expandedContent={<ChartCard onDismiss={() => setExpanded(false)} />}
        />
      ) : (
        <OpenChartButton
          expanded={false}
          onActivate={() => setExpanded(true)}
        />
      )}
    </div>
  );
}

type NestedItem = {
  id: string;
  label: string;
  meta: string;
  icon: LucideIcon;
};

type NestedTab = 'home' | 'cards' | 'activity' | 'settings';

const nestedTabs: { id: NestedTab; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'cards', label: 'Cards', icon: CreditCardIcon },
  { id: 'activity', label: 'Activity', icon: ActivityIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

const nestedTabPanels: Record<
  NestedTab,
  {
    title: string;
    description: string;
    items: NestedItem[];
  }
> = {
  home: {
    title: 'Home',
    description: 'Open a workspace summary or jump into the next task.',
    items: [
      {
        id: 'overview',
        label: 'Today overview',
        meta: 'Balances, reminders, and recent changes',
        icon: HomeIcon,
      },
      {
        id: 'team',
        label: 'Family workspace',
        meta: '4 members, shared spending',
        icon: UserPlusIcon,
      },
      {
        id: 'goals',
        label: 'Savings goals',
        meta: '3 active targets',
        icon: ActivityIcon,
      },
    ],
  },
  cards: {
    title: 'Cards',
    description: 'Choose a card to manage limits, status, or activity.',
    items: [
      {
        id: 'family-card',
        label: 'Family card',
        meta: 'Shared card, 4 members',
        icon: CreditCardIcon,
      },
      {
        id: 'travel-card',
        label: 'Travel card',
        meta: 'Cards, cash, documents',
        icon: CreditCardIcon,
      },
      {
        id: 'savings-card',
        label: 'Savings card',
        meta: 'Goal-linked spending controls',
        icon: CreditCardIcon,
      },
    ],
  },
  activity: {
    title: 'Activity',
    description: 'Review recent transactions and account events.',
    items: [
      {
        id: 'grocery',
        label: 'Grocery payment',
        meta: '$82.40, today',
        icon: ActivityIcon,
      },
      {
        id: 'flight',
        label: 'Flight refund',
        meta: '$214.00 returned',
        icon: ArrowLeftIcon,
      },
      {
        id: 'subscription',
        label: 'Subscription renewal',
        meta: '$18.00, yesterday',
        icon: ArrowRightIcon,
      },
    ],
  },
  settings: {
    title: 'Settings',
    description: 'Adjust workspace controls and notification preferences.',
    items: [
      {
        id: 'members',
        label: 'Members',
        meta: 'Roles, invites, permissions',
        icon: UserPlusIcon,
      },
      {
        id: 'limits',
        label: 'Spending limits',
        meta: 'Monthly caps and alerts',
        icon: SettingsIcon,
      },
      {
        id: 'security',
        label: 'Security',
        meta: 'Devices and login history',
        icon: SettingsIcon,
      },
    ],
  },
};

const nestedDetailActions: Record<
  NestedTab,
  { label: string; icon: LucideIcon }[]
> = {
  home: [
    { label: 'Open summary', icon: HomeIcon },
    { label: 'Share update', icon: ArrowRightIcon },
    { label: 'Review changes', icon: ActivityIcon },
  ],
  cards: [
    { label: 'Freeze card', icon: CreditCardIcon },
    { label: 'Set limit', icon: SettingsIcon },
    { label: 'View card activity', icon: ActivityIcon },
  ],
  activity: [
    { label: 'Open receipt', icon: ActivityIcon },
    { label: 'Add note', icon: SettingsIcon },
    { label: 'Mark reviewed', icon: ArrowRightIcon },
  ],
  settings: [
    { label: 'Edit setting', icon: SettingsIcon },
    { label: 'Manage access', icon: UserPlusIcon },
    { label: 'View history', icon: ActivityIcon },
  ],
};

const nestedSurfaceClassName = 'w-[min(28rem,calc(100vw-3rem))]';

function NestedBottomTabs({
  activeTab,
  expanded,
  onSelectTab,
}: {
  activeTab: NestedTab;
  expanded: boolean;
  onSelectTab: (tab: NestedTab) => void;
}) {
  return (
    <nav
      aria-label="Nested morph tabs"
      className={clsx(
        'grid w-[min(28rem,calc(100vw-3rem))] grid-cols-4 items-center gap-1 rounded-2xl border border-slate-800 bg-slate-950/95 p-1.5 shadow-2xl shadow-slate-950/20 transition',
        expanded && 'opacity-0'
      )}
    >
      {nestedTabs.map((tab) => {
        const TabIcon = tab.icon;
        const active = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            aria-label={tab.label}
            onClick={() => onSelectTab(tab.id)}
            className={clsx(
              'group flex h-10 min-w-0 items-center justify-center gap-2 rounded-xl px-2 text-xs font-semibold transition',
              active
                ? 'text-white'
                : 'text-slate-400 hover:bg-white/10 hover:text-white'
            )}
          >
            <TabIcon
              aria-hidden="true"
              className={clsx(
                'size-4 shrink-0 transition',
                active ? 'text-white' : 'text-slate-500 group-hover:text-white'
              )}
            />
            <span className="hidden truncate sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function NestedItemList({
  activeTab,
  onDismiss,
  onSelectItem,
}: {
  activeTab: NestedTab;
  onDismiss: () => void;
  onSelectItem: (item: NestedItem) => void;
}) {
  const panel = nestedTabPanels[activeTab];

  return (
    <section
      className={clsx(
        nestedSurfaceClassName,
        'rounded-2xl border border-slate-800 bg-slate-950 p-5 font-sans text-white'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            {panel.title}
          </p>
          <h2 className="mt-1 text-xl font-semibold">{panel.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {panel.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-md border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-400">
            Level 1
          </span>
          <button
            type="button"
            aria-label="Close nested menu"
            onClick={onDismiss}
            className={clsx(loshmiButtonBase, loshmiButtonDarkGhost, 'h-8 w-8')}
          >
            <XIcon aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        {panel.items.map((item) => {
          const ItemIcon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item)}
              className={clsx(
                loshmiButtonBase,
                loshmiButtonDarkSecondary,
                'h-auto w-full justify-between px-4 py-3 text-left'
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-slate-300">
                  <ItemIcon
                    aria-hidden="true"
                    className="size-4"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">
                    {item.label}
                  </span>
                  <span className="mt-1 block truncate text-xs font-medium text-slate-400">
                    {item.meta}
                  </span>
                </span>
              </span>
              <ChevronRightIcon
                aria-hidden="true"
                className="text-slate-500"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function NestedDetailMenu({
  activeTab,
  item,
  onBack,
}: {
  activeTab: NestedTab;
  item: NestedItem;
  onBack: () => void;
}) {
  const actions = nestedDetailActions[activeTab];
  const activeTabLabel = nestedTabPanels[activeTab].title;

  return (
    <section
      className={clsx(
        nestedSurfaceClassName,
        'rounded-2xl border border-slate-800 bg-slate-950 p-4 font-sans text-white'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            {activeTabLabel}
          </p>
          <h3 className="mt-1 text-lg font-semibold">{item.label}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">
            {item.meta}
          </p>
        </div>
        <span className="rounded-md border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-400">
          Level 2
        </span>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onBack}
          className={clsx(
            loshmiButtonBase,
            loshmiButtonDarkGhost,
            'h-8 px-3 text-xs'
          )}
        >
          <ArrowLeftIcon aria-hidden="true" />
          Back
        </button>
      </div>

      <div className="mt-4 grid gap-2">
        {actions.map((action) => {
          const ActionIcon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              className={clsx(
                loshmiButtonBase,
                loshmiButtonDarkSecondary,
                'h-auto justify-between px-3 py-2.5'
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 p-2 text-slate-300">
                  <ActionIcon aria-hidden="true" />
                </span>
                {action.label}
              </span>
              <ChevronRightIcon
                aria-hidden="true"
                className="text-slate-500"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function NestedPanel({
  activeTab,
  nestedExpanded,
  setNestedExpanded,
  selectedItem,
  setSelectedItem,
  onDismiss,
  settings,
}: {
  activeTab: NestedTab;
  nestedExpanded: boolean;
  setNestedExpanded: (expanded: boolean) => void;
  selectedItem: NestedItem;
  setSelectedItem: (item: NestedItem) => void;
  onDismiss: () => void;
  settings: DemoSettings;
}) {
  return (
    <DemoMorpheus
      anchor={settings.anchor}
      className="relative inline-block align-top"
      expanded={nestedExpanded}
      overlayBlur={settings.overlayBlur}
      overlayColor={settings.overlayColor}
      overlayOpacity={settings.overlayOpacity}
      overlayZIndex={1300}
      onClose={() => setNestedExpanded(false)}
      spring={morphSpringPresets[settings.springPreset]}
      collapsedContent={
        <NestedItemList
          activeTab={activeTab}
          onDismiss={onDismiss}
          onSelectItem={(item) => {
            setSelectedItem(item);
            setNestedExpanded(true);
          }}
        />
      }
      expandedContent={
        <NestedDetailMenu
          activeTab={activeTab}
          item={selectedItem}
          onBack={() => setNestedExpanded(false)}
        />
      }
    />
  );
}

function NestedDemo({ mounted, settings }: DemoProps) {
  const [activeTab, setActiveTab] = useState<NestedTab>('home');
  const [expanded, setExpanded] = useState(false);
  const [nestedExpanded, setNestedExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NestedItem>(
    nestedTabPanels.home.items[0]
  );

  const collapsedContent = (
    <NestedBottomTabs
      activeTab={activeTab}
      expanded={expanded}
      onSelectTab={(tab) => {
        setActiveTab(tab);
        setSelectedItem(nestedTabPanels[tab].items[0]);
        setNestedExpanded(false);
        setExpanded(true);
      }}
    />
  );

  return (
    <div className="grid min-h-[24rem] h-full place-items-center bg-white">
      {mounted ? (
        <DemoMorpheus
          anchor={settings.anchor}
          className="relative inline-block align-top"
          expanded={expanded}
          overlayBlur={settings.overlayBlur}
          overlayColor={settings.overlayColor}
          overlayOpacity={settings.overlayOpacity}
          overlayZIndex={1200}
          onClose={() => {
            setNestedExpanded(false);
            setExpanded(false);
          }}
          spring={morphSpringPresets[settings.springPreset]}
          collapsedContent={collapsedContent}
          expandedContent={
            <NestedPanel
              activeTab={activeTab}
              nestedExpanded={nestedExpanded}
              setNestedExpanded={setNestedExpanded}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              onDismiss={() => {
                setNestedExpanded(false);
                setExpanded(false);
              }}
              settings={settings}
            />
          }
        />
      ) : (
        <NestedBottomTabs
          activeTab={activeTab}
          expanded={false}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setSelectedItem(nestedTabPanels[tab].items[0]);
            setExpanded(true);
          }}
        />
      )}
    </div>
  );
}

function WizardPanel({
  step,
  setStep,
  onDone,
}: {
  step: number;
  setStep: (step: number) => void;
  onDone: () => void;
}) {
  const steps = ['Profile', 'Plan', 'Confirm'];

  return (
    <section className="w-[min(31rem,calc(100vw-3rem))] rounded-2xl border border-slate-800 bg-slate-950 p-5 font-sans text-white">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Multi step
          </p>
          <h2 className="mt-1 text-xl font-semibold">{steps[step]}</h2>
        </div>
        <span className="text-sm font-semibold text-slate-400">
          {step + 1}/3
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {steps.map((item, index) => (
          <div
            key={item}
            className={clsx(
              'h-1.5 rounded-full',
              index <= step ? 'bg-white' : 'bg-white/15'
            )}
          />
        ))}
      </div>

      <div className="mt-6 min-h-36 rounded-xl border border-slate-800 bg-white/5 p-4">
        {step === 0 && (
          <div className="grid gap-3">
            <label className="grid gap-1 text-sm font-medium text-slate-300">
              Name
              <input
                defaultValue="Shivek"
                className="h-10 rounded-lg border border-slate-700 bg-slate-900 px-3 text-white outline-none focus:border-slate-500"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-300">
              Email
              <input
                defaultValue="shivek@example.com"
                className="h-10 rounded-lg border border-slate-700 bg-slate-900 px-3 text-white outline-none focus:border-slate-500"
              />
            </label>
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-3">
            {['Starter', 'Studio', 'Scale'].map((item, index) => (
              <button
                key={item}
                type="button"
                data-cuelume-press={CuelumeSound.Toggle}
                className={clsx(
                  loshmiButtonBase,
                  'h-auto justify-start px-3 py-3',
                  index === 1
                    ? 'bg-white text-slate-950 shadow-xs hover:bg-slate-200'
                    : loshmiButtonDarkSecondary
                )}
              >
                {item}
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 className="text-base font-semibold text-white">
              Ready to create workspace
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Morpheus keeps the wizard inside the destination surface while the
              app owns step state and form state.
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-between gap-3">
        <button
          type="button"
          data-cuelume-press={step === 0 ? undefined : CuelumeSound.Toggle}
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className={clsx(loshmiButtonBase, loshmiButtonDarkGhost, 'h-10 px-4')}
        >
          <ArrowLeftIcon aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          data-cuelume-press={step === 2 ? undefined : CuelumeSound.Toggle}
          onClick={() => {
            if (step === 2) {
              playCuelumeSound(CuelumeSound.Toggle);
              onDone();
              return;
            }
            setStep(step + 1);
          }}
          className={clsx(
            loshmiButtonBase,
            'h-10 bg-white px-4 text-slate-950 shadow-xs hover:bg-slate-200'
          )}
        >
          {step === 2 ? 'Finish' : 'Next'}
          <ArrowRightIcon aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function WizardDemo({ mounted, settings }: DemoProps) {
  const [expanded, setExpanded] = useState(false);
  const [step, setStep] = useState(0);

  const closeAndReset = () => {
    setExpanded(false);
    setStep(0);
  };

  const collapsedContent = (
    <OpenSignupButton
      expanded={expanded}
      onActivate={() => setExpanded(true)}
    />
  );

  return (
    <div className="grid min-h-[24rem] h-full place-items-center bg-white">
      {mounted ? (
        <DemoMorpheus
          anchor={settings.anchor}
          onClose={() => {
            playCuelumeSound(CuelumeSound.Release);
            setExpanded(false);
          }}
          className="relative inline-block align-top"
          expanded={expanded}
          overlayBlur={settings.overlayBlur}
          overlayColor={settings.overlayColor}
          overlayOpacity={settings.overlayOpacity}
          overlayZIndex={1200}
          spring={morphSpringPresets[settings.springPreset]}
          collapsedContent={collapsedContent}
          expandedContent={
            <WizardPanel
              step={step}
              setStep={setStep}
              onDone={closeAndReset}
            />
          }
        />
      ) : (
        <OpenSignupButton
          expanded={false}
          onActivate={() => setExpanded(true)}
        />
      )}
    </div>
  );
}

function HeroCopyMenu({
  copied,
  label,
  mounted,
  overlay,
  options,
  onCopy,
}: {
  copied: HeroCopyTarget;
  label: string;
  mounted: boolean;
  overlay?: boolean;
  options: HeroCopyOption[];
  onCopy: (option: HeroCopyOption) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const collapsedContent = (
    <button
      type="button"
      data-cuelume-press={CuelumeSound.Press}
      className={clsx(heroActionBase, expanded && 'opacity-0')}
      onClick={() => setExpanded(true)}
    >
      <span className="truncate">{label}</span>
      <DownloadIcon
        aria-hidden="true"
        strokeWidth={1.75}
        className="ml-0.5 h-2 w-2 shrink-0 text-slate-500"
      />
    </button>
  );

  if (!mounted) {
    return collapsedContent;
  }

  return (
    <DemoMorpheus
      anchor={MorphAnchor.MiddleMiddle}
      className="install-morph-menu relative inline-block shadow-none align-top"
      expanded={expanded}
      onClose={() => setExpanded(false)}
      overlayBlur={overlay ? 5 : 0}
      overlayColor="#0f172a"
      overlayOpacity={overlay ? 0.08 : 0}
      overlayZIndex={1300}
      spring={morphSpringPresets.snappy}
      collapsedContent={collapsedContent}
      expandedContent={
        <div className="w-[min(20rem,calc(100vw-2rem))] rounded-lg bg-white p-0">
          <div className="rounded-lg border border-slate-300 bg-white p-2.5">
            <div className="px-2 pb-3 pt-1 text-center">
              <h2 className="text-sm font-semibold text-slate-900">Install</h2>
              <p className="mt-0.5 text-[0.68rem] font-semibold uppercase text-slate-500">
                Pick a runtime
              </p>
            </div>
            <ul className="grid gap-2">
              {options.map((option) => {
                const isCopied = copied === option.id;

                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      className="flex h-10 w-full min-w-0 items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-2.5 text-left text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-slate-400/25"
                      onClick={() => {
                        onCopy(option);
                        window.setTimeout(() => setExpanded(false), 320);
                      }}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-slate-900">
                          {option.runtimeLabel}
                        </span>
                        <span className="mt-0.5 block truncate font-mono text-[0.68rem] font-medium text-slate-500">
                          {option.label}
                        </span>
                      </span>
                      {isCopied ? (
                        <CheckIcon
                          aria-hidden="true"
                          strokeWidth={1.75}
                          className="h-2.5 w-2.5 shrink-0 text-emerald-600"
                        />
                      ) : (
                        <CopyIcon
                          aria-hidden="true"
                          strokeWidth={1.75}
                          className="h-2.5 w-2.5 shrink-0 text-slate-400"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      }
    />
  );
}

function HeroCopyButton({
  copied,
  option,
  onCopy,
}: {
  copied: HeroCopyTarget;
  option: HeroCopyOption;
  onCopy: (option: HeroCopyOption) => void;
}) {
  const isCopied = copied === option.id;

  return (
    <button
      type="button"
      data-cuelume-press={CuelumeSound.Press}
      className={heroActionBase}
      onClick={() => onCopy(option)}
    >
      <span>{isCopied ? 'Copied AGENTS.md' : 'AGENTS.md'}</span>
      {isCopied ? (
        <CheckIcon
          aria-hidden="true"
          strokeWidth={1.75}
          className="ml-0.5 h-2 w-2 shrink-0 text-emerald-600"
        />
      ) : (
        <CopyIcon
          aria-hidden="true"
          strokeWidth={1.75}
          className="ml-0.5 h-2 w-2 shrink-0 text-slate-500"
        />
      )}
    </button>
  );
}

function ReactMorpheusHero() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<DemoTab>('basic');
  const [copied, setCopied] = useState<HeroCopyTarget>(null);
  const [settings, setSettings] = useState<DemoSettings>({
    anchor: MorphAnchor.BottomMiddle,
    overlayBlur: 3,
    overlayColor: '#0f172a',
    overlayOpacity: 0.16,
    springPreset: 'smooth',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyHeroAction = async (
    option: HeroCopyOption,
    sound?: CuelumeSound
  ) => {
    await navigator.clipboard.writeText(option.value);
    if (sound) {
      playCuelumeSound(sound);
    }
    setCopied(option.id);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section className="border-b border-slate-100 bg-white px-5 py-16 md:py-24">
      <CuelumeBinding />
      <style>
        {`.install-morph-menu .rmorph\\:shadow-xs { box-shadow: none !important; }`}
      </style>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <a
            className="mb-4 inline-flex"
            href="https://www.npmjs.com/package/react-morpheus"
            rel="noreferrer"
            target="_blank"
          >
            <img
              alt="react-morpheus npm version"
              className="h-5 w-auto"
              height={20}
              src="https://img.shields.io/npm/v/react-morpheus"
              width={122}
            />
          </a>
          <h1 className="text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-5xl">
            Fluid Component Morphing for React Interfaces
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
            React Morpheus preserves spatial contact from original cmponent to
            final intraction. This makes ui state feel grounded an intuitive.
          </p>

          <div className="mx-auto mb-12 mt-7 flex max-w-2xl flex-wrap justify-center gap-2.5">
            <a
              className={heroActionBase}
              href={githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              <span>View GitHub</span>
              <ExternalLinkIcon
                aria-hidden="true"
                className="ml-0.5 h-2.5 w-2.5 shrink-0 text-slate-500"
              />
            </a>
            <HeroCopyMenu
              copied={copied}
              label="Install"
              mounted={mounted}
              overlay
              options={installOptions}
              onCopy={(option) => copyHeroAction(option, CuelumeSound.Whisper)}
            />
            <HeroCopyButton
              copied={copied}
              option={agentsOptions[0]}
              onCopy={copyHeroAction}
            />
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Morpheus demos"
          className="mt-16 flex flex-wrap gap-2"
        >
          {demoTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                loshmiButtonBase,
                'h-8 px-3 text-xs',
                activeTab === tab.id ? loshmiButtonDefault : loshmiButtonOutline
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div className="grid items-stretch md:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="h-full rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
              {activeTab === 'basic' && (
                <BasicDemo
                  mounted={mounted}
                  settings={settings}
                />
              )}
              {activeTab === 'nested' && (
                <NestedDemo
                  mounted={mounted}
                  settings={settings}
                />
              )}
              {activeTab === 'wizard' && (
                <WizardDemo
                  mounted={mounted}
                  settings={settings}
                />
              )}
            </div>

            <DemoControls
              settings={settings}
              setSettings={setSettings}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReactMorpheusHero;
