import { Directive, HostListener,ElementRef } from '@angular/core';

@Directive({
  selector: '[appResponsiveAdapt]'
})
export class ResponsiveAdaptDirective {

  constructor(private _element:ElementRef) {}
   
  ngOnInit() {  
    console.log('Directive called');
  }

  ngAfterContentInit(): void {
    let parentWidth:Number = this._element.nativeElement.offsetWidth;
    let childElSum:Number = 0;
    let childElemArray = Array.prototype.slice.call(this._element.nativeElement.childNodes);
    childElemArray.forEach(element => {
      if(element.className == "responsive-elem-item"){
       console.log(element)
      }
      // if(element.attributes.includes('appResponsiveAdaptItem')){        
      //   childElSum += element.offsetWidth
      // }
    });
  }
}
