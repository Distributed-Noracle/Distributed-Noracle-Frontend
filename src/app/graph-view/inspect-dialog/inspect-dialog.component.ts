import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

@Component({
  selector: 'dnor-inspect-dialog',
  templateUrl: './inspect-dialog.component.html',
  styleUrls: ['./inspect-dialog.component.css']
})
export class InspectDialogComponent implements OnInit {

  public items:Array<{name: string, count: number, color: string}>;
  private total: number = 0;

  constructor(public dialogRef: MdDialogRef<InspectDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
    data.votes.good = 10;
    data.votes.bad = 5;
    data.votes.neutral = 2;
    data.votes.total = 17;
    this.items = [
      {name: 'Good', count: data.votes.good, color: '#31ca31'},
      {name: 'Bad', count: data.votes.bad, color: 'red'},
      {name: 'Neutral', count: data.votes.total === 0 ? 1 : data.votes.neutral, color: 'grey'}
    ];
    this.total = this.items.map(a => a.count).reduce((x, y) => x + y);
  }

  ngOnInit() {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getPerimeter(radius: number): number {
    return Math.PI * 2 * radius;
  }

  getOffset(radius: number, index: number): number {
    let percent = 0;
    for (let i = 0; i < index; i++) {
      percent += ((this.items[i].count) / this.total);
    }
    const perimeter = this.getPerimeter(radius);
    return perimeter * percent;
  }

}
