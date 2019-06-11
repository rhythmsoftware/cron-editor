import { Component } from '@angular/core';

import { CronEditorComponent } from '../cron-editor.component';

@Component({
  selector: 'cron-editor-compact',
  templateUrl: './cron-editor-compact.component.html',
  styleUrls: ['../cron-editor.component.css']
})
export class CronEditorCompactComponent extends CronEditorComponent {
}
