import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RelationPickerDialogComponent} from '../relation-picker-dialog/relation-picker-dialog.component';

@Component({
  selector: 'dnor-vote-dialog',
  templateUrl: './vote-dialog.component.html',
  styleUrls: ['./vote-dialog.component.css']
})
export class VoteDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RelationPickerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    data.lines = data.message.split('\n');
  }

  ngOnInit() {
  }



  onCancel(): void {
    this.dialogRef.close();
  }
}
