
import {
  Component,
  Input,
  ComponentFactoryResolver,
  ViewChild,
  OnInit,
  ViewContainerRef,
  AfterViewInit
} from '@angular/core';
import { LocobuzzTab } from 'app/core/models/viewmodel/LocobuzzTab';
import { ContentcontainerDirective } from 'app/shared/directives/contentcontainer.directive';
@Component({
  selector: 'app-tabcontent',
  template: '<ng-template appContentcontainer></ng-template>',
  styleUrls: ['./tabcontent.component.scss']
})
export class TabcontentComponent implements OnInit, AfterViewInit {

  @Input() tab;
  @ViewChild(ContentcontainerDirective, { static: false })
  contentContainer: ContentcontainerDirective;

  // @ViewChild('appContentcontainer', {static: true, read: ViewContainerRef}) container: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}
  ngAfterViewInit(): void {
    setTimeout(() => this.generateView(), 1);
  }

  generateView(): void
  {
    const tab: LocobuzzTab = this.tab;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      tab.component
    );
    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    componentRef.instance.postDetailTab = this.tab;
  }

  ngOnInit(): void {
  }
}

