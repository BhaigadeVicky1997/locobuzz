import { Component, Input, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-side-modal',
  templateUrl: './side-modal.component.html',
  styleUrls: ['./side-modal.component.scss'],
})
export class SideModalComponent implements OnInit, AfterViewInit {
    @ViewChild('sidemodalHeadingActions') sidemodalHeadingActions;
    @ViewChild('sidemodalfoot') sidemodalfoot;
    @Input() title: string;
    showActions: boolean = false;
    showFoot: boolean = false;
    constructor(private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
      this.showActions = this.sidemodalHeadingActions.nativeElement && this.sidemodalHeadingActions.nativeElement.children.length > 0;
      this.showFoot = this.sidemodalfoot.nativeElement && this.sidemodalfoot.nativeElement.children.length > 0;
      this.cdRef.detectChanges();
    }

}
