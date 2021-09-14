import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Directive({
  selector: '[appHoverDropdown]'
})
export class HoverDropdownDirective implements OnInit{

  isInHoverBlock = false;

    constructor(private el: ElementRef) {}

    @Input() hoverTrigger: MatMenuTrigger;
    @Input() menu: any;

    ngOnInit(): void {
        this.el.nativeElement.addEventListener('mouseenter', () => {
            // this.setHoverState(true);
            this.hoverTrigger.openMenu();

            const openMenu = document.querySelector(`.mat-menu-after.${this.menu._elementRef.nativeElement.className}`);
            if (!openMenu) {
                // this.hoverTrigger.closeMenu();
                return;
            }
            openMenu.addEventListener('mouseenter', () => {
                this.setHoverState(true);
            });
            openMenu.addEventListener('mouseleave', () => {
                this.setHoverState(false);
            });
        });
        this.el.nativeElement.addEventListener('mouseleave', () => {
            // this.setHoverState(false);
        });
    }

    private setHoverState(isInBlock: boolean): void {
        this.isInHoverBlock = isInBlock;
        if (!isInBlock) {
            this.checkHover();
        }
    }

    private checkHover(): void {
        setTimeout(() => {
            if (!this.isInHoverBlock && this.hoverTrigger.menuOpen) {
                this.hoverTrigger.closeMenu();
            }
        }, 50);
    }
}
