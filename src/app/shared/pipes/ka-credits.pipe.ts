import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { EnviromentsTypes } from 'src/app/core/enums/enviroments-types';
@Pipe({
  name: 'kaCredits',
})
export class KaCreditsPipe implements PipeTransform {
  user: UserInfo;
  readonly CountryCodes = CountryCodes;
  readonly EnviromentsTypes = EnviromentsTypes;

  constructor(private store: Store<{ user: UserInfo }>) {
    this.store.select('user').subscribe((user) => (this.user = user));
  }

  transform(value: any, ...args: unknown[]): unknown {
    let parsedNumber;
    switch (this.user.countryId) {
      case CountryCodes.CHILE:
        parsedNumber = this.parseRegular(value, '$');
        break;
      case CountryCodes.ARGENTINA:
        parsedNumber = this.parseRegular(value, '$');
        break;
      case CountryCodes.PARAGUAY:
        parsedNumber = this.parseRegular(value, '₲');
        break;
      case CountryCodes.BRASIL:
        parsedNumber = this.parseRegular(value, 'R$');
        break;
      default:
        parsedNumber = this.parseRegular(value, '$');
    }
    return `${parsedNumber}`;
  }

  parseRegular(value: any, symbol: string): string {
    if (value < 0) {
      value = 0;
    }
    const finalValue = parseFloat(value)
      ?.toFixed(0)
      .toString()
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${symbol}${finalValue}`;
  }
}
