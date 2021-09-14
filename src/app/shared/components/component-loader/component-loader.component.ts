import { locobuzzAnimations } from '@locobuzz/animations';
import { LoaderService } from '../../services/loader.service';
import { Component, OnInit, OnDestroy, Input  } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-component-loader',
  templateUrl: './component-loader.component.html',
  styleUrls: ['./component-loader.component.scss'],
  animations: locobuzzAnimations
})
export class ComponentLoaderComponent implements OnInit, OnDestroy {
  @Input() section: string = '';
  public loaderSubscription: Subscription;
  constructor(private _loaderService: LoaderService) { }
  loaderStatus: boolean = false;
  ngOnInit(): void {
   this.loaderSubscription =  this._loaderService.componentLoaderStatus.subscribe(state => {
     if (this.loaderStatus !== state.status){
       this.loaderStatus = (state.status && (state.section === this.section));
     }
    });
  }

  ngOnDestroy(): void {
    this.loaderSubscription.unsubscribe();
  }
}
