import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, ViewContainerRef } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { Router, Event, NavigationEnd, ActivatedRoute  } from '@angular/router';
import { navigation } from 'app/app-data/navigation';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit {

  @Input()
  navigation: any;
  currentUrl: string;
  link1SubMenu: boolean;
  link2SubMenu: boolean;
  showSideNav: boolean;
  // navigation;


  constructor(
    private _navigationService: NavigationService,
    private router: Router,
  ) {

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
          this._navigationService.getNavigationData(event.urlAfterRedirects);
      }
    });
  }


  
  ngOnInit(): void {
    this.navigation = this._navigationService.navigation;
    // this.navigation = navigation || this.navigation || this._navigationService.getCurrentNavigation();
  }

}
