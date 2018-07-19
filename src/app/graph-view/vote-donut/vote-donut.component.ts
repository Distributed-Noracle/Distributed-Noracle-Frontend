import { Component, OnInit, ViewChildren, ContentChildren, Directive, Input, AfterContentInit, QueryList } from '@angular/core';

@Directive({
  selector: 'dnor-donut-item'
})
export class ItemDirective {
  @Input() name: string;
  @Input() count: number;
  @Input() color: string;
}

@Component({
  selector: 'dnor-vote-donut',
  templateUrl: './vote-donut.component.html',
  styleUrls: ['./vote-donut.component.css']
})
export class VoteDonutComponent implements OnInit, AfterContentInit {

  @ContentChildren(ItemDirective) items: QueryList<ItemDirective>;
  @Input() descriptor: string;
  @Input() descriptorPlural: string = null;
  @Input() width = '100px';
  @Input() height = '150px';

  public total = 0;

  ngOnInit() {}

  ngAfterContentInit() {
    this.total = this.items.map(a => a.count).reduce((x, y) => x + y);
    this.descriptor = this.descriptor || '';
    if (this.descriptor === '') {
      this.descriptorPlural = '';
    } else {
      this.descriptorPlural = this.descriptorPlural || (this.descriptor + 's');
    }
  }

  getPerimeter(radius: number): number {
    return Math.PI * 2 * radius;
  }

  getOffset(radius: number, index: number): number {
    let percent = 0;
    const itemArray = this.items.toArray();
    for (let i = 0; i < index; i++) {
      percent += ((itemArray[i].count) / this.total);
    }
    const perimeter = this.getPerimeter(radius);
    return perimeter * percent;
  }
}
