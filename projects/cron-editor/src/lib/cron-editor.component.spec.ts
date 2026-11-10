import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CronEditorComponent } from './cron-editor.component';
import { CronOptions } from './CronOptions';
import { TimePickerComponent } from './time-picker/time-picker.component';

describe('CronEditorComponent', () => {
    let component: CronEditorComponent;
    let fixture: ComponentFixture<CronEditorComponent>;

    const baseOptions: CronOptions = {
        formInputClass: 'form-control',
        formSelectClass: 'form-control',
        formRadioClass: 'form-radio',
        formCheckboxClass: 'form-checkbox',
        defaultTime: '23:00:00',
        use24HourTime: true,
        hideMinutesTab: true,
        hideHourlyTab: true,
        hideDailyTab: false,
        hideWeeklyTab: false,
        hideMonthlyTab: false,
        hideYearlyTab: false,
        hideAdvancedTab: false,
        hideSeconds: true,
        removeSeconds: true,
        removeYears: true
    };

    function create(options: CronOptions, cron: string) {
        fixture = TestBed.createComponent(CronEditorComponent);
        component = fixture.componentInstance;
        component.options = { ...options };
        component.cron = cron;
        fixture.detectChanges();
        return fixture.nativeElement as HTMLElement;
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [CronEditorComponent, TimePickerComponent]
        })
            .compileComponents();
    }));

    it('should create', () => {
        create(baseOptions, '0 23 1 1/1 ?');
        expect(component).toBeTruthy();
    });

    it('shows the nearest weekday checkbox on Monthly and Yearly by default', () => {
        const el = create(baseOptions, '0 23 1 1/1 ?');
        expect(el.querySelector('#nearestWdMn')).not.toBeNull();
        expect(el.querySelector('#nearestWdYr')).not.toBeNull();
    });

    it('hides the nearest weekday checkbox on Monthly and Yearly when hideNearestWeekday is set', () => {
        const el = create({ ...baseOptions, hideNearestWeekday: true }, '0 23 1 1/1 ?');
        expect(el.querySelector('#nearestWdMn')).toBeNull();
        expect(el.querySelector('#nearestWdYr')).toBeNull();
    });

    it('still builds a plain yearly cron with the checkbox hidden', () => {
        create({ ...baseOptions, hideNearestWeekday: true }, '0 23 1 1/1 ?');
        component.setActiveTab('yearly');
        expect(component.cron).not.toContain('W');
    });
});
