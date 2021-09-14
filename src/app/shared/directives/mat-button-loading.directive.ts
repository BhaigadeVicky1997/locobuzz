import {
  ComponentFactory, ComponentFactoryResolver, ComponentRef,
  Directive, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewContainerRef
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoaderService } from './../services/loader.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mat-button][loading],[mat-raised-button][loading],[mat-icon-button][loading],[mat-fab][loading],[mat-mini-fab][loading], [mat-stroked-button][loading],[mat-flat-button][loading]'
})
export class MatButtonLoadingDirective implements OnChanges {
  @Input() loading: boolean;
  @Input() disabled: boolean = false;
  @Input() color: ThemePalette;
  @Input() section: string;
  private spinnerFactory: ComponentFactory<MatProgressSpinner>;
  private spinner: ComponentRef<MatProgressSpinner>;
  constructor(
    private _loaderService: LoaderService,
    private matButton: MatButton,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) {
    this.spinnerFactory = this.componentFactoryResolver.resolveComponentFactory(MatProgressSpinner);
  }

  get nativeElement(): HTMLElement {
    return this.matButton._elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.loading) {
      return;
    }

    if (changes.loading.currentValue) {
      this.nativeElement.classList.add('mat-loading');
      this.matButton.disabled = true;
      this.createSpinner();
    } else if (!changes.loading.firstChange) {
      this.nativeElement.classList.remove('mat-loading');
      this.matButton.disabled = this.disabled;
      this.destroySpinner();
    }
  }

  private createSpinner(): void {
    if (!this.spinner) {
      this.spinner = this.viewContainerRef.createComponent(this.spinnerFactory);
      this.spinner.instance.color = this.color;
      this.spinner.instance.diameter = 20;
      this.spinner.instance.mode = 'indeterminate';
      this.renderer.appendChild(this.nativeElement, this.spinner.instance._elementRef.nativeElement);
    }
  }

  private destroySpinner(): void {
    if (this.spinner) {
      this.spinner.destroy();
      this.spinner = null;
    }
  }
}
