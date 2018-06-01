import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {VoteDonutComponent, ItemDirective} from './../vote-donut/vote-donut.component';

@Component({
  selector: 'dnor-inspect-edge-dialog',
  templateUrl: './inspect-edge-dialog.component.html',
  styleUrls: ['./../inspect-dialog/inspect-dialog.component.css']
})
export class InspectEdgeDialogComponent implements OnInit {

  public editingRelation = false;

  constructor(public dialogRef: MdDialogRef<InspectEdgeDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
