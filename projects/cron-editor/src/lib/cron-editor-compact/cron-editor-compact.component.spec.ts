import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CronEditorCompactComponent } from './cron-editor-compact.component';

describe('CronEditorCompactComponent', () => {
  let component: CronEditorCompactComponent;
  let fixture: ComponentFixture<CronEditorCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CronEditorCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronEditorCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
