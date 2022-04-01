import { Client } from './client.model';

export interface UserInfo {
  uuid?: string;
  userId?: number;
  cpgId?: number;
  countryId?: string;
  organizationId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  cellphone?: string;
  createdBy?: string;
  createdTime?: Date;
  updatedBy?: any;
  updatedTime?: any;
  jwt?: string;
  clients?: Client[];
}
