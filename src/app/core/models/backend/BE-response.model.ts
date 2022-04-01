export interface BERespModel {
  httpStatus: number;
  ok: boolean;
  code: number;
  data: any;
  pagination?: {
    limit: number;
    offset: string;
    count: number;
    currentpage: number;
  };
}
