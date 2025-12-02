# Investor Enrichment Task List

**Total Investors: 138**
**Batch Size: 10**
**Total Batches: 14**

---

## Instructions for Parallel Agents

**IMPORTANT: Each agent should only process ONE batch at a time.**

1. Pick ONE uncompleted batch from the list below
2. Mark that batch as "🟡 IN PROGRESS" by editing this file
3. Complete all investors in that batch
4. Mark the batch as "✅ COMPLETED" when done
5. Do NOT start another batch - let another agent pick up remaining work

---

## Agent Prompt

Use this prompt for each agent:

```
Enrich the following investor files in `/content/genomicsLandscape/investors/`:

[PASTE INVESTOR LIST FROM YOUR BATCH HERE]

For each investor:
1. Use web search to find: website, location (city, country), AUM, founded year, fund type, investment stages, typical investment range
2. Find team members who handle health/bio investments - get names, roles, and LinkedIn profile URLs
3. Research investment thesis, focus areas, and notable exits (IPOs, acquisitions)
4. Search for sources: Crunchbase, PitchBook, LinkedIn, investor website, news articles

If you discover portfolio companies NOT in our database (max 2 per investor):
- Create fully enriched company file in `/content/genomicsLandscape/companies/`
- Add investment record to `/src/genomics/investments.json`
- Follow the company format from 54gene.md, abcuro.md, or kailera.md

## Standardized Investor File Format

Use this structure for all investor files:

---
slug: [slug]
name: [Full Name]
website: [URL]
location: [City, Country]
fundType: [biotech-focused | generalist | cvc | dao | family-office | hedge-fund | pe]
stages: ['seed', 'series-a', 'series-b', 'series-c', 'growth']
typicalInvestmentRange: [$XM - $YM]
aum: [$XB or $XM]
founded: [YYYY]
description: [One paragraph description]
lastResearched: 2025-12-02
---

## Investment Thesis

[2-3 sentences about their investment strategy and focus]

## Team

### Partners / Managing Directors (Health & Bio Focus)

- **[Name]** - [Role] - [LinkedIn URL]
- **[Name]** - [Role] - [LinkedIn URL]

### Other Key Team Members

- **[Name]** - [Role] - [LinkedIn URL]

## Focus Areas

- [Area 1]
- [Area 2]
- [Area 3]

## Notable Exits

- **[Company]** - [Exit type: IPO/Acquired] ([Year], [Details])
- **[Company]** - [Exit type: IPO/Acquired] ([Year], [Details])

## Sources

- [Source 1 with URL]
- [Source 2 with URL]
- [Source 3 with URL]

---

Set lastResearched to today's date: 2025-12-02
```

---

## Batch Status

### ✅ ALL BATCHES COMPLETED

#### Batch 1 - STATUS: ✅ COMPLETED

```
5am-ventures
7wireventures
abingworth
adjuvant-capital
albionvc-healthcare
alexandria-venture-investments
alix-ventures
alloy-ventures
alta-partners
altimeter-capital
```

#### Batch 2 - STATUS: ✅ COMPLETED

```
amoon
andera-partners-biodiscovery
andreessen-horowitz
angelini-ventures
annex-investments
apollo-health-ventures
apple-tree-partners
arch-venture-partners
artiman
atlas-venture
```

#### Batch 3 - STATUS: ✅ COMPLETED

```
baillie-gifford
bain-capital-life-sciences
bayer
beco-capital
bessemer-venture-partners
bioadvance
biomark-capital
boxer-capital
breakout-ventures
casdin-capital
```

#### Batch 4 - STATUS: ✅ COMPLETED

```
ce-ventures
celgene
civilization-ventures
communitascapital
corundum-systems-biology
d1-capital
deerfield-management
dfj-growth
dragoneer-investment-group
dst-global
```

#### Batch 5 - STATUS: ✅ COMPLETED

```
emirates-angels
entree-capital
f-prime-capital
felicis-ventures
fifty-years
first-round-capital
flagship-pioneering
forbion
foresite-capital
founders-fund
```

#### Batch 6 - STATUS: ✅ COMPLETED

```
franklin-templeton
g42-healthcare
general-atlantic
general-catalyst
gilde-healthcare
google-ventures
hatteras-venture-partners
healthcap
hedosophia
icon-ventures
```

#### Batch 7 - STATUS: ✅ COMPLETED

```
illumina-ventures
indaco-venture-partners
jimco-life-sciences-fund
k9-ventures
khosla-ventures
kleiner-perkins
kurma-partners
l1-digital
lifex-ventures
lightspeed-venture-partners
```

#### Batch 8 - STATUS: ✅ COMPLETED

```
lightstone-ventures
linden-lake-venture-capital
lsp-eqt-life-sciences
lundbeckfonden-biocapital
lux-capital
m-ventures
march-capital
mayfield
medicxi
mike-jafar-family-office
```

#### Batch 9 - STATUS: ✅ COMPLETED

```
mpm-bioimpact
mubadala-capital
nea
novartis
novo-holdings
oak-hc-ft
omega-funds
omx-ventures
orbimed
oxford-science-enterprises
```

#### Batch 10 - STATUS: ✅ COMPLETED

```
panakes-partners
perceptive-advisors
petrillo-capital
pfizer-ventures
playground-global
polaris-partners
portal-innovations
ra-capital-management
redmile-group
revolution-growth
```

#### Batch 11 - STATUS: ✅ COMPLETED

```
rivervest-venture-partners
salica
sanofi-ventures
section-32
sequoia-capital
seroba-life-sciences
seventure-partners
shine-capital
silver-lake
sofinnova-partners
```

#### Batch 12 - STATUS: ✅ COMPLETED

```
softbank
softtech-vc
spur-capital-partners
sr-one
stepstone-group
sugati-ventures
sunstone-life-science-ventures
sutter-hill
sv-health-investors
t-rowe-price
```

#### Batch 13 - STATUS: ✅ COMPLETED

```
the-column-group
third-rock-ventures
tmc-texas-medical-center
tpg-biotech
tvm-capital-healthcare
v-bio-ventures
valiance-asset-management
venbio-partners
venrock
versant-ventures
```

#### Batch 14 - STATUS: ✅ COMPLETED

```
vertex-pharmaceuticals
vg-acquisition-corp
vida-ventures
vitadao
vivo-capital
warburg-pincus
wellington-partners-life-sciences
ysios-capital
```

---

## Progress Checklist

**Total: 138 investors across 14 batches**

- [x] Batch 1 (10 investors) - 5am-ventures, 7wireventures, abingworth, adjuvant-capital, albionvc-healthcare, alexandria-venture-investments, alix-ventures, alloy-ventures, alta-partners, altimeter-capital
- [x] Batch 2 (10 investors) - amoon, andera-partners-biodiscovery, andreessen-horowitz, angelini-ventures, annex-investments, apollo-health-ventures, apple-tree-partners, arch-venture-partners, artiman, atlas-venture
- [x] Batch 3 (10 investors) - baillie-gifford, bain-capital-life-sciences, bayer, beco-capital, bessemer-venture-partners, bioadvance, biomark-capital, boxer-capital, breakout-ventures, casdin-capital
- [x] Batch 4 (10 investors) - ce-ventures, celgene, civilization-ventures, communitascapital, corundum-systems-biology, d1-capital, deerfield-management, dfj-growth, dragoneer-investment-group, dst-global
- [x] Batch 5 (10 investors) - emirates-angels, entree-capital, f-prime-capital, felicis-ventures, fifty-years, first-round-capital, flagship-pioneering, forbion, foresite-capital, founders-fund
- [x] Batch 6 (10 investors) - franklin-templeton, g42-healthcare, general-atlantic, general-catalyst, gilde-healthcare, google-ventures, hatteras-venture-partners, healthcap, hedosophia, icon-ventures
- [x] Batch 7 (10 investors) - illumina-ventures, indaco-venture-partners, jimco-life-sciences-fund, k9-ventures, khosla-ventures, kleiner-perkins, kurma-partners, l1-digital, lifex-ventures, lightspeed-venture-partners
- [x] Batch 8 (10 investors) - lightstone-ventures, linden-lake-venture-capital, lsp-eqt-life-sciences, lundbeckfonden-biocapital, lux-capital, m-ventures, march-capital, mayfield, medicxi, mike-jafar-family-office
- [x] Batch 9 (10 investors) - mpm-bioimpact, mubadala-capital, nea, novartis, novo-holdings, oak-hc-ft, omega-funds, omx-ventures, orbimed, oxford-science-enterprises
- [x] Batch 10 (10 investors) - panakes-partners, perceptive-advisors, petrillo-capital, pfizer-ventures, playground-global, polaris-partners, portal-innovations, ra-capital-management, redmile-group, revolution-growth
- [x] Batch 11 (10 investors) - rivervest-venture-partners, salica, sanofi-ventures, section-32, sequoia-capital, seroba-life-sciences, seventure-partners, shine-capital, silver-lake, sofinnova-partners
- [x] Batch 12 (10 investors) - softbank, softtech-vc, spur-capital-partners, sr-one, stepstone-group, sugati-ventures, sunstone-life-science-ventures, sutter-hill, sv-health-investors, t-rowe-price
- [x] Batch 13 (10 investors) - the-column-group, third-rock-ventures, tmc-texas-medical-center, tpg-biotech, tvm-capital-healthcare, v-bio-ventures, valiance-asset-management, venbio-partners, venrock, versant-ventures
- [x] Batch 14 (8 investors) - vertex-pharmaceuticals, vg-acquisition-corp, vida-ventures, vitadao, vivo-capital, warburg-pincus, wellington-partners-life-sciences, ysios-capital

---

## New Companies Added

Track new companies discovered during investor enrichment here:

| Company Slug | Added By Investor | Date Added |
| ------------ | ----------------- | ---------- |
|              |                   |            |

---

## Notes

- Max 2 new companies per investor to avoid scope creep
- Focus on health/bio team members for team section
- Always include LinkedIn URLs where available
- Add investment records to `/src/genomics/investments.json` for new companies

---

## Completion Summary

**All 138 investors enriched on 2025-12-02**

Files enriched/updated during this session:

- `founders-fund.md` - Fully enriched (was minimal stub)
- `revolution-growth.md` - Fully enriched (was minimal stub)
- `ysios-capital.md` - Fully enriched (was minimal stub)

All other investor files were already properly enriched with:

- Complete frontmatter metadata
- Investment thesis
- Team information with LinkedIn URLs
- Focus areas
- Notable exits/investments
- Sources
