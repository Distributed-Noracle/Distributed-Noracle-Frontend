import {Component, Inject, Input, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {RelationType} from '../graph-view/graph-data-model/relation-type.enum';

@Component({
  selector: 'dnor-relation-picker-dialog',
  templateUrl: './relation-picker-dialog.component.html',
  styleUrls: ['./relation-picker-dialog.component.css']
})
export class RelationPickerDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RelationPickerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    data.lines = data.message.split('\n');
    data.selectedRelationType = RelationType.FollowUp;
  }

  ngOnInit() {
  }

  public getRelationTypes() {
    const types = [];
    for (const mode in RelationType) {
      if (typeof RelationType[mode] === 'number') {
        types.push(RelationType[mode]);
      }
    }
    return types;
  }

  public getRelationTypeLabel(type: number): string {
    return RelationType[type];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
