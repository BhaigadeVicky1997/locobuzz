import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appContentcontainer]'
})
export class ContentcontainerDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
