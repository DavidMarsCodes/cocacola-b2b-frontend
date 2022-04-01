import * as _ from 'lodash';
import * as moment from 'moment';

export class ValidationUtils {
  constructor() {}

  static isPasteEvent(ev): boolean {
    const key = ev.which || ev.keyCode;
    const ctrl = ev.ctrlKey ? ev.ctrlKey : key === 17 ? true : false;
    if (key == 86 && ctrl) return true;
    else if (key == 67 && ctrl) return true;
    return false;
  }

  static validRegexOnPaste(regex, event): void {
    const pastedText = event?.clipboardData?.getData('Text');
    if (!pastedText) event.preventDefault();
    if (!regex.test(pastedText)) event.preventDefault();
  }

  /**
   * Valid if one date exceeds another (the latter can be affected by discounts in days, months or years)
   * By default, compares the entered date with today's date
   * @param {Date} date
   * @param {string} unit
   * @param {number} quantity
   * @returns boolean
   */
  static isDateExceedsByUnits(date, unit: moment.unitOfTime.DurationConstructor, quantity: number): boolean {
    return moment(date).format('YYYYMMDD') > moment().subtract(quantity, unit).format('YYYYMMDD');
  }
}
