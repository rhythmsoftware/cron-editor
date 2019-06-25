import { OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { CronOptions } from './CronOptions';
import { Localizations } from './Localizations';

import { Days, MonthWeeks, Months } from './enums';
import Utils from './Utils';

export abstract class CronEditorComponent implements OnInit, OnChanges {
  @Input() public disabled: boolean;

  @Input() get cron(): string { return this.localCron; }
  set cron(value: string) {
    this.localCron = value;
    this.cronChange.emit(this.localCron);
  }

  @Input() public get options(): CronOptions { return this.localOptions; }
  public set options(value: CronOptions) {
    this.localOptions = Object.assign(this.defaultOptions, value);
  }

  // the name is an Angular convention, @Input variable name + "Change" suffix
  @Output() cronChange = new EventEmitter();

  public validation = {
    isValid: true,
    errorMessage: ''
  };

  public selectOptions = this.getSelectOptions();
  public state: any;

  private localCron: string;
  private localOptions: CronOptions;
  protected isDirty: boolean;

  public ngOnInit() {
    if (this.options.removeSeconds) {
      this.options.hideSeconds = true;
    }

    this.validation.isValid = true;
    this.validation.errorMessage = '';

    this.handleModelChange(this.cron);
  }

  public ngOnChanges(changes: SimpleChanges) {
    const newCron = changes['cron'];
    if (newCron && !newCron.firstChange) {
      this.handleModelChange(this.cron);
    }
  }
  
  public dayDisplay(day: string): string {
    return this.l(Days[day]);
  }

  public monthWeekDisplay(monthWeekNumber: number): string {
    return this.l(MonthWeeks[monthWeekNumber]);
  }

  public monthDisplay(month: number): string {
    return this.l(Months[month].toLowerCase());
  }

  public monthDayDisplay(month: string): string {
    if (month === 'L') {
      return this.l('lastDay');
    } else if (month === 'LW') {
      return this.l('lastWeekday');
    } else if (month === '1W') {
      return this.l('firstWeekday');
    } else {
      return `${month}${this.getOrdinalSuffix(month)} ${this.l('day')}`;
    }
  }

  l(localizationKey: string): string {
    return this.options.localizations[localizationKey] || localizationKey;
  }

  private handleModelChange(cron: string) {
    if (this.isDirty) {
      this.isDirty = false;
      return;
    } else {
      this.isDirty = false;
    }
    
    this.validate(cron);

    this.setValues(cron);
  }

  private validate(cron: string): void {
    this.validation.isValid = false;
    this.validation.errorMessage = '';

    if (!cron) {
      this.validation.errorMessage = this.l('cronExpressionCannotBeNull');
      return;
    }

    const cronParts = cron.split(' ');

    let expected = 5;

    if (!this.options.removeSeconds) {
      expected++;
    }

    if (!this.options.removeYears) {
      expected++;
    }

    if (cronParts.length !== expected) {
      this.validation.errorMessage = this.l('invalidCronExpression').replace('{expected}', `${expected}`);
      return;
    }

    this.validation.isValid = true;
    return;
  }
  
  protected abstract setValues(cron: string);
  
  protected getHourType(hour: number) {
    return this.options.use24HourTime ? undefined : (hour >= 12 ? 'PM' : 'AM');
  }

  protected getAmPmHour(hour: number) {
    return this.options.use24HourTime ? hour : (hour + 11) % 12 + 1;
  }

  private getOrdinalSuffix(value: string) {
    return this.localOptions.localizations.ordinalSuffix(value);
  }

  private getSelectOptions() {
    return {
      months: Utils.getRange(1, 12),
      monthWeeks: ['#1', '#2', '#3', '#4', '#5', 'L'],
      days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      minutes: Utils.getRange(0, 59),
      fullMinutes: Utils.getRange(0, 59),
      seconds: Utils.getRange(0, 59),
      hours: Utils.getRange(1, 23),
      monthDays: Utils.getRange(1, 31),
      monthDaysWithLasts: ['1W', ...Utils.getRange(1, 31).map(String), 'LW', 'L'],
      hourTypes: ['AM', 'PM']
    };
  }

  private defaultOptions : CronOptions = {
    formInputClass: '',
    formSelectClass: '',
    formRadioClass: '',
    formCheckboxClass: '',
    defaultTime: '00:00:00',
    use24HourTime: true,
    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: false,
    hideSeconds: true,
    removeSeconds: true,
    removeYears: true,
    localizations: Localizations.English
  };
}
