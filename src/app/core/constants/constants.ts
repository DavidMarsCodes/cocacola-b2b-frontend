import { Country } from '../models/country.model';

export class Constants {
  public static countries: Country[] = [
    {
      key: 'AR',
      label: 'Argentina',
      lang: 'es',
      organizationId: '3046',
      phoneRegex: new RegExp('^[0-9]{10,11}$'),
      homeStyle: 2,
      fiscalIdRegex: [new RegExp('^[0-9]{10,11}$')],
      minPurchase: 10000,
      maxlengthFiscalId: 11,
    },
    {
      key: 'CL',
      label: 'Chile',
      lang: 'es',
      organizationId: '3043',
      phoneRegex: new RegExp('^[0-9]{9}$'),
      homeStyle: 2,
      fiscalIdRegex: 'RUT',
      minPurchase: 15000,
    },
    // { key: 'BR', label: 'Brasil', lang: 'pt', organizationId: '3048',
    // phoneRegex: [new RegExp('^[0-9]{8,10}$')], homeStyle: 1, fiscalIdRegex: [new RegExp('^[0-9]{11,14}$)] },
    {
      key: 'PY',
      label: 'Paraguay',
      lang: 'es',
      minPurchase: 100000,
      organizationId: '3049',
      phoneRegex: new RegExp('^[0-9]{8,10}$'),
      homeStyle: 1,
      fiscalIdRegex: [new RegExp('^[0-9]{6,10}[-]{1}[0-9a-zA-Z]{1}$'), new RegExp('^[0-9]{6,7}$')],
    },
  ];
}
