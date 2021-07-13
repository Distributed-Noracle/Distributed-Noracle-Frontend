import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'dnor-inspect-dialog',
  templateUrl: './inspect-dialog.component.html',
  styleUrls: ['./inspect-dialog.component.css']
})
export class InspectDialogComponent implements OnInit {

  public editingQuestion = false;

  constructor(public dialogRef: MatDialogRef<InspectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
