import { AfterContentChecked, Directive, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appIfOnDom]'
})
export class IfOnDomDirective implements AfterContentChecked{

  isCreated: boolean;

  constructor(
    private _elementRef: ElementRef,
    private _templateRef: TemplateRef<any>,
    private _viewContainerRef: ViewContainerRef
  )
  {
      // Set the defaults
      this.isCreated = false;
  }

  ngAfterContentChecked(): void
  {
      if ( document.body.contains(this._elementRef.nativeElement) && !this.isCreated )
      {
          setTimeout(() => {
              this._viewContainerRef.createEmbeddedView(this._templateRef);
          }, 300);
          this.isCreated = true;
      }
      else if ( this.isCreated && !document.body.contains(this._elementRef.nativeElement) )
      {
          this._viewContainerRef.clear();
          this.isCreated = false;
      }
  }

}
