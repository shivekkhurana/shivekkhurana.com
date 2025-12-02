# Partner Verification and Link Cleanup Task

**Total Investors: 138**
**Batch Size: 10**
**Total Batches: 14**

---

## Task Overview

1. **Verify Partners**: Check that all partners/managing directors listed in the Team section are correct and actually work at the firm
2. **Remove LinkedIn Links**: Remove all LinkedIn profile URLs from the Team section
3. **Add Team Page Links**: Add a link to the investor's team/leadership page in the Sources section (if available)

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

````
Verify and update the following investor files in `/content/genomicsLandscape/investors/`:

[PASTE INVESTOR LIST FROM YOUR BATCH HERE]

For each investor:

1. **Verify Partners**:
   - Visit the investor's website and find their team/leadership page
   - Verify that all partners/managing directors listed in the Team section are:
     - Currently at the firm (not former employees)
     - Actually partners/managing directors (not other roles)
     - Focused on health/bio investments (if applicable)
   - Remove any incorrect or outdated team members
   - Add any missing key partners who handle health/bio investments

2. **Remove LinkedIn Links**:
   - Remove all LinkedIn profile URLs from the Team section
   - Format should be: `- **[Name]** - [Role]` (no URL)

3. **Add Team Page Link**:
   - Find the team/leadership/about page URL on the investor's website
   - Common patterns: `/team`, `/leadership`, `/about`, `/people`, `/our-team`
   - Add this link to the Sources section if it doesn't already exist
   - Format: `- [Investor Name] Team Page: [URL]` or just `- [URL]` if it's clear it's the team page

## Example Transformation

**Before:**
```markdown
## Team

### Partners / Managing Directors (Health & Bio Focus)

- **John Doe** - Managing Partner - https://www.linkedin.com/in/johndoe/
- **Jane Smith** - Partner - https://www.linkedin.com/in/janesmith/

## Sources

- https://www.investor.com
- https://www.crunchbase.com/organization/investor
````

**After:**

```markdown
## Team

### Partners / Managing Directors (Health & Bio Focus)

- **John Doe** - Managing Partner
- **Jane Smith** - Partner

## Sources

- https://www.investor.com
- https://www.investor.com/team
- https://www.crunchbase.com/organization/investor
```

## Notes

- Only list current partners/managing directors (not former employees)
- Focus on partners who handle health/bio investments
- If team page doesn't exist, note it in a comment or skip adding the link
- Keep the same structure and formatting as existing files
- Update `lastResearched` date to today's date

```

---

## Batch Status

### Batch 1 - STATUS: ✅ COMPLETED

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

### Batch 2 - STATUS: ✅ COMPLETED

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

### Batch 3 - STATUS: ⏳ PENDING

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

### Batch 4 - STATUS: ⏳ PENDING

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

### Batch 5 - STATUS: ✅ COMPLETED

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

### Batch 6 - STATUS: 🟡 IN PROGRESS

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

### Batch 7 - STATUS: ✅ COMPLETED

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

### Batch 8 - STATUS: ✅ COMPLETED

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

### Batch 9 - STATUS: 🟡 IN PROGRESS

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

### Batch 10 - STATUS: ✅ COMPLETED

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

### Batch 11 - STATUS: ✅ COMPLETED

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

### Batch 12 - STATUS: ✅ COMPLETED

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

### Batch 13 - STATUS: ✅ COMPLETED

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

### Batch 14 - STATUS: ✅ COMPLETED

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
- [ ] Batch 11 (10 investors) - rivervest-venture-partners, salica, sanofi-ventures, section-32, sequoia-capital, seroba-life-sciences, seventure-partners, shine-capital, silver-lake, sofinnova-partners
- [ ] Batch 12 (10 investors) - softbank, softtech-vc, spur-capital-partners, sr-one, stepstone-group, sugati-ventures, sunstone-life-science-ventures, sutter-hill, sv-health-investors, t-rowe-price
- [ ] Batch 13 (10 investors) - the-column-group, third-rock-ventures, tmc-texas-medical-center, tpg-biotech, tvm-capital-healthcare, v-bio-ventures, valiance-asset-management, venbio-partners, venrock, versant-ventures
- [ ] Batch 14 (8 investors) - vertex-pharmaceuticals, vg-acquisition-corp, vida-ventures, vitadao, vivo-capital, warburg-pincus, wellington-partners-life-sciences, ysios-capital

---

## Common Team Page URL Patterns

When searching for team pages, look for these common patterns:
- `/team`
- `/leadership`
- `/about`
- `/people`
- `/our-team`
- `/team-members`
- `/partners`
- `/who-we-are`
- `/about-us/team`
- `/about/team`

---

## Notes

- Focus on verifying current partners only (not former employees)
- If a partner is listed but no longer at the firm, remove them
- If key partners are missing, add them (but verify they handle health/bio investments)
- Remove ALL LinkedIn links from Team section
- Add team page link to Sources section (if available)
- Keep existing file structure and formatting
- Update `lastResearched` date to today's date when making changes

---

## Completion Summary

**Status: Not Started**

Files to be updated: 138 investor files

Tasks per file:
1. Verify partners are correct and current
2. Remove LinkedIn links from Team section
3. Add team page link to Sources section

```
