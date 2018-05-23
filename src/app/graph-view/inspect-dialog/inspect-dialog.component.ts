import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {VoteDonutComponent, ItemDirective} from './../vote-donut/vote-donut.component';

@Component({
  selector: 'dnor-inspect-dialog',
  templateUrl: './inspect-dialog.component.html',
  styleUrls: ['./inspect-dialog.component.css']
})
export class InspectDialogComponent implements OnInit {

  protected editingQuestion = false;

  constructor(public dialogRef: MdDialogRef<InspectDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
