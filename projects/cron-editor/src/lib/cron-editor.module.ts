import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CronEditorTabsComponent } from './cron-editor-tabs/cron-editor-tabs.component';
import { TimePickerComponent } from './time-picker/time-picker.component';

@NgModule({
  declarations: [CronEditorTabsComponent, TimePickerComponent],
  imports: [CommonModule, FormsModule],
  exports: [CronEditorTabsComponent]
})
export class CronEditorModule { }
