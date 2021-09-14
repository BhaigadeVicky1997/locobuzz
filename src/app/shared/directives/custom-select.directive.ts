import { OnInit, Directive, Input, AfterViewInit} from '@angular/core';
@Directive({
  selector: '[appCustomSelect]'
})
export class CustomSelectDirective implements OnInit, AfterViewInit{

  constructor() {}

  @Input() triggerElem: any;

  ngOnInit(): void{
    console.log(this.triggerElem.clientWidth);
  }
  ngAfterViewInit(): void {
    console.log(this.triggerElem.clientWidth);
  }
}
