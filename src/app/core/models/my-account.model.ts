export interface MyCreditModel {
  cpgId?: string;
  countryId: string;
  organizationId?: string;
  clientId?: number;
  amount?: string;
  creditLimit?: number;
  available?: number;
  currency?: string;
  Segment?: ProductGroup;
}

interface ProductGroup {
  name: string;
  segmentId: number;
}
