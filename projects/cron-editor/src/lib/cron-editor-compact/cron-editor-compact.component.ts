import { Component, OnInit } from '@angular/core';

import { CronEditorComponent } from '../cron-editor.component';

@Component({
  selector: 'cron-editor-compact',
  templateUrl: './cron-editor-compact.component.html',
  styleUrls: ['../cron-editor.component.css']
})
export class CronEditorCompactComponent extends CronEditorComponent implements OnInit {
  public every = 1;

  public time = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    hourTypes: 'AM'
  };
  
  public onDayOfMonth = '1';
  public onDaysOfWeek = {
    MON: true,
    TUE: false,
    WED: false,
    THU: false,
    FRI: false,
    SAT: false,
    SUN: false
  };

  public onDayOfWeekNum = 1;
  public onDayOfWeek = 'MON';

  public onMonth = 0;
  public monthType = 'sequence'; // [sequence, weekday]
  
  public yearType = 'sequence'; // [sequence, weekday]

  public onMonthsInYear = {
    JAN: true,
    FEB: false,
    MAR: false,
    APR: false,
    MAY: false,
    JUN: false,
    JUL: false,
    AUG: false,
    SEP: false,
    OCT: false,
    NOV: false,
    DEC: false
  };

  public repeatType = 'days';
  public types: string[];

  public ngOnInit() {
    this.types = [
      'minutes',
      'hours',
      'days',
      'weeks',
      'months',
      'years'
      ];
  }

  onEveryChange(): void {
    this.updateCron();
  }

  onTypeChange(): void {
    this.updateCron();
  }

  onTimeChange(): void {
    this.updateCron();
  }

  onDaysOfWeekChange(): void {
    this.updateCron();
  }

  onDayOfMonthChange(): void {
    this.updateCron();
  }

  onMonthsInYearChange(): void {
    this.updateCron();
  }

  setValues(cron: string) {
    let normalizedCron = cron;
    if (this.options.removeSeconds) {
      normalizedCron = `0 ${normalizedCron}`;
    }

    if (this.options.removeYears) {
      normalizedCron = `${normalizedCron} *`;
    }

    const [seconds, minutes, hours, dayOfMonth, months, dayOfWeek, years] = normalizedCron.split(' ');

    if (normalizedCron.match(/\d+ \d+\/\d+ \* 1\/1 \* \? \*/)) {
      this.repeatType = 'minutes';

      const minParts = minutes.split('/');
      this.every = Number(minParts[1]);

      this.time.seconds = Number(seconds);
    } else if (normalizedCron.match(/\d+ \d+ \d+\/\d+ 1\/1 \* \? \*/)) {
      this.repeatType = 'hours';

      const hoursParts = hours.split('/');
      this.every = Number(hoursParts[1]);

      this.time.minutes = Number(minutes);
      this.time.seconds = Number(seconds);
    } else if (normalizedCron.match(/\d+ \d+ \d+ \d+\/\d+ \* \? \*/)) {
      this.repeatType = 'days';

      const daysParts = dayOfMonth.split('/');
      this.every = Number(daysParts[1]);

      const hoursNr = Number(hours);
      this.time.hours = this.getAmPmHour(hoursNr);
      this.time.hourTypes = this.getHourType(hoursNr);
      this.time.minutes = Number(minutes);
      this.time.seconds = Number(seconds);
    } else if (normalizedCron.match(/\d+ \d+ \d+ \? \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
      this.repeatType = 'weeks';

      for (let day in this.onDaysOfWeek) {
        if (!this.onDaysOfWeek.hasOwnProperty(day))
          continue;
        this.onDaysOfWeek[day] = dayOfWeek.indexOf(day) >= 0;
      }

      const hoursNr = Number(hours);
      this.time.hours = this.getAmPmHour(hoursNr);
      this.time.hourTypes = this.getHourType(hoursNr);
      this.time.minutes = Number(minutes);
      this.time.seconds = Number(seconds);
    } else if (normalizedCron.match(/\d+ \d+ \d+ (\d+|L|LW|1W) \d+\/\d+ \? \*/)) {
      this.repeatType = 'months';

      const monthParts = months.split('/');
      this.every = Number(monthParts[1]);

      this.onDayOfMonth = dayOfMonth;

      const hoursNr = Number(hours);
      this.time.hours = this.getAmPmHour(hoursNr);
      this.time.hourTypes = this.getHourType(hoursNr);
      this.time.minutes = Number(minutes);
      this.time.seconds = Number(seconds);
    } else if (normalizedCron.match(/\d+ \d+ \d+ \d+ (JAN|FEB|MAR|APR|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(,(JAN|FEB|MAR|APR|JUN|JUL|AUG|SEP|OCT|NOV|DEC))* \? \d+\/\d+/)) {
      this.repeatType = 'years';

      const yearsParts = years.split('/');
      this.every = Number(yearsParts[1]);

      for (let month in this.onMonthsInYear) {
        if (!this.onMonthsInYear.hasOwnProperty(month))
          continue;
        this.onMonthsInYear[month] = months.indexOf(month) >= 0;
      }

      const hoursNr = Number(hours);
      this.time.hours = this.getAmPmHour(hoursNr);
      this.time.hourTypes = this.getHourType(hoursNr);
      this.time.minutes = Number(minutes);
      this.time.seconds = Number(seconds);
    } else {
      this.validation.isValid = true;
      this.validation.errorMessage = this.l('couldNotParseExpression');
    }
  }

  updateCron(): void {
    this.isDirty = true;

    const parts = [];

    // Seconds part
    if (!this.options.hideSeconds) {
      parts.push(this.time.seconds);
    }

    // Minutes part
    parts.push('minutes' === this.repeatType ?
      `0/${this.every}` :
      this.time.minutes);

    // Hours part
    parts.push('hours' === this.repeatType ?
      `0/${this.every}` :
      this.getHourPart(this.time.hours, this.time.hourTypes));

    // Days part
    if ('days' === this.repeatType) {
      parts.push(`1/${this.every}`);
    } else if ('weeks' === this.repeatType) {
      parts.push('?');
    } else if ('months' === this.repeatType || 'years' === this.repeatType) {
      if ('weekday' === this.monthType) {
        parts.push('?');
      } else {
        parts.push(this.onDayOfMonth);
      }
    } else {
      parts.push('1/1');
    }

    // Months part
    if ('months' === this.repeatType) {
      parts.push(`1/${this.every}`);
    } else if ('years' === this.repeatType) {
      const months = [];
      for (let month in this.onMonthsInYear) {
        if (!this.onMonthsInYear.hasOwnProperty(month) || !this.onMonthsInYear[month])
          continue;
        months.push(month);
      }
      if (months.length === 0) {
        this.onMonthsInYear.JAN = true;
        months.push('JAN');
      }
      parts.push(months.join(','));
    } else {
      parts.push('*');
    }

    // Weekdays part
    if ('weeks' === this.repeatType) {
      const days = [];
      for (let day in this.onDaysOfWeek) {
        if (!this.onDaysOfWeek.hasOwnProperty(day) || !this.onDaysOfWeek[day])
          continue;
        days.push(day);
      }
      parts.push(days.join(','));
    } else if (('months' === this.repeatType && 'weekday' === this.monthType) || 
      ('years' === this.repeatType && 'weekday' === this.yearType)) {
      parts.push(`${this.onDayOfWeek}#${this.onDayOfWeekNum}`);
    } else {
      parts.push('?');
    }

    // Years part
    if (!this.options.hideYearlyTab) {
      if ('years' === this.repeatType) {
        parts.push(`1/${this.every}`);
      } else {
        parts.push('*');
      }
    }

    this.cron = parts.join(' ');
  }

  getHourPart(hour: number, hourType: string) {
    if (this.options.use24HourTime) {
      return hour;
    } else {
      return hourType === 'AM' ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
    }
  }
}
