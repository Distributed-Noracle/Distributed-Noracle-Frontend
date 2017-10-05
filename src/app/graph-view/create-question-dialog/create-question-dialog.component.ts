import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

@Component({
  selector: 'dnor-create-question-dialog',
  templateUrl: './create-question-dialog.component.html',
  styleUrls: ['./create-question-dialog.component.css']
})
export class CreateQuestionDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<CreateQuestionDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
