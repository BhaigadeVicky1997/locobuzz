import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appElementRenderer]'
})
export class ElementRendererDirective {
  private nativeElement: Node;

  constructor( private renderer: Renderer2, private element: ElementRef ) {
    this.nativeElement = element.nativeElement;
  }

}
