import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'dnor-inspect-edge-dialog',
  templateUrl: './inspect-edge-dialog.component.html',
  styleUrls: ['./../inspect-dialog/inspect-dialog.component.css']
})
export class InspectEdgeDialogComponent implements OnInit {

  public editingRelation = false;

  constructor(public dialogRef: MatDialogRef<InspectEdgeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
