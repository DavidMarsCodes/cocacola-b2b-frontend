import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kaPaymentMethod',
})
export class KaPaymentMethodPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    let paymentMethod;
    switch (value) {
      case 'CASH':
        paymentMethod = 'Contado';
        break;
      case 'CREDIT':
        paymentMethod = 'Crédito';
        break;
      default:
        paymentMethod = 'Contado';
    }
    return paymentMethod;
  }
}
