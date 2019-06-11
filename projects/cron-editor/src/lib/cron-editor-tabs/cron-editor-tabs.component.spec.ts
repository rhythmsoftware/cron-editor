import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CronEditorTabsComponent } from './cron-editor-tabs.component';

describe('CronEditorTabsComponent', () => {
  let component: CronEditorTabsComponent;
  let fixture: ComponentFixture<CronEditorTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CronEditorTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronEditorTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
