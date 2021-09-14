import { Directive, ViewContainerRef, ElementRef, Renderer2, AfterViewInit, HostListener, Input, AfterContentChecked, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[appIsotopeGrid]'
})
export class IsotopeGridDirective implements AfterViewInit, AfterViewChecked {
  @Input() columnWidth: string;
  grid: any = this._element.nativeElement;
  gridItems: any = this._element.nativeElement.childNodes;
  rowSize: number = 5;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.debounce(this.positionGridItems(), 20, null);
  }

  constructor(private _element: ElementRef) { }
  ngAfterViewInit(): void {
    const self = this;
    this.gridItems.length <= 2 ? this.setColumns(this.columnWidth) : this.setColumns(this.columnWidth);
    setTimeout(() => {
      self.positionGridItems();
    }, 300);
  }

  ngAfterViewChecked(): void{
    this.debounce(this.positionGridItems(), 20, null);
  }
  positionGridItems(): any {
    this.gridItems.forEach((x: any) => {
      let rowSpan;
      if (document.body.clientWidth < 711) {
        x.style = '';
        return;
      } else {
        if ( x.childNodes[0]?.className.includes('grid-element')){
          rowSpan = Math.ceil(
            x.childNodes[0].offsetHeight / this.rowSize);
          x.style.setProperty('--row-span', `span ${rowSpan}`);
        }
      }
    });
  }

  setColumns(value: string): string {
    return this.grid.style.setProperty('--template-columns', value);
  }

  debounce(func, wait, immediate): any {
    let timeout;
    return function(): any {
      // tslint:disable-next-line: one-variable-per-declaration
      const context = this,
        args = arguments;
      const later = () => {
        timeout = null;
        if (!immediate) { func.apply(context, args); }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) { func.apply(context, args); }
    };
  }
}
