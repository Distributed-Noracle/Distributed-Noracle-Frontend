import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {RelationPickerDialogComponent} from '../relation-picker-dialog/relation-picker-dialog.component';

@Component({
  selector: 'dnor-vote-dialog',
  templateUrl: './vote-dialog.component.html',
  styleUrls: ['./vote-dialog.component.css']
})
export class VoteDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<RelationPickerDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
    data.lines = data.message.split('\n');
  }

  ngOnInit() {
  }



  onCancel(): void {
    this.dialogRef.close();
  }
}
