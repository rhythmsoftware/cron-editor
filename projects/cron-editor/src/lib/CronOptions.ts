export interface CronOptions {
    formInputClass: string;
    formSelectClass: string;
    formRadioClass: string;
    formCheckboxClass: string;

    defaultTime: string;
    use24HourTime: boolean;

    hideMinutesTab: boolean;
    hideHourlyTab: boolean;
    hideDailyTab: boolean;
    hideWeeklyTab: boolean;
    hideMonthlyTab: boolean;
    hideYearlyTab: boolean;
    hideAdvancedTab: boolean;

    /** hides the Seconds UI form element */
    hideSeconds: boolean;

    /** removes Seconds from the Cron expression */
    removeSeconds: boolean;

    /** removes Years from the Cron expression */
    removeYears: boolean;

    /**
     * hides the "during the nearest weekday" checkbox on the Monthly and Yearly tabs.
     * It produces day-of-month values such as "15W", which cron-parser (used by the
     * Rhythm backends to validate and schedule) cannot parse.
     */
    hideNearestWeekday?: boolean;
}
