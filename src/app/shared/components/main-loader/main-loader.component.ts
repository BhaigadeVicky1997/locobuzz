import { LoaderService } from './../../services/loader.service';
import { locobuzzAnimations } from '@locobuzz/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-loader',
  templateUrl: './main-loader.component.html',
  styleUrls: ['./main-loader.component.scss'],
  animations: locobuzzAnimations
})
export class MainLoaderComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  constructor(private _loaderService: LoaderService) { }
  loaderStatus: boolean = true;
  ngOnInit(): void {
    this._loaderService.mainLoaderStatus.subscribe(status => {
      this.loaderStatus = status;
    });
  }

  ngOnDestroy(): void {
     this.subscription.unsubscribe();
  }

}
