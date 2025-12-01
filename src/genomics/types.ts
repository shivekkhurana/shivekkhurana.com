import type {
  GenomicsInvestor as Investor,
  GenomicsCompany as Company,
} from '@contentlayer/generated';

export interface Investment {
  investorSlug: string;
  companySlug: string;
  date: string;
  stage: string;
  amount: number | null;
  amountCurrency: string;
  leadInvestor: boolean;
  dataSource: string;
  notes: string;
}

export interface EnrichedInvestment extends Investment {
  investor?: Investor;
  company?: Company;
}

export type EnrichedInvestor = Investor & {
  investments: EnrichedInvestment[];
};

export type EnrichedCompany = Company & {
  investments: EnrichedInvestment[];
};
