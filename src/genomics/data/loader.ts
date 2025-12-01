import { allInvestors, allCompanies } from '@contentlayer/generated';
import type { Investor, Company } from '@contentlayer/generated';
import investmentsData from '../../../content/genomicsLandscape/investments.json';

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

export type { Investor, Company };

export function loadInvestors(): Investor[] {
  return allInvestors;
}

export function loadCompanies(): Company[] {
  return allCompanies;
}

export function loadInvestments(): Investment[] {
  return investmentsData.investments;
}
