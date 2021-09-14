import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLoaderComponent } from './shared/components/main-loader/main-loader.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ExceptionInterceptor } from './interceptors/exception.interceptor';
import { RootComponent } from './root.component';
import { SignalRConfiguration, SignalRModule } from 'ng2-signalr';
import { CrmService } from './social-inbox/services/crm.service';

export function createConfig(): SignalRConfiguration {
  const c = new SignalRConfiguration();
  c.hubName = 'chathub';
  c.qs = 'groupID=3398&UserRole=Admin';
  c.url = 'https://signalr.locobuzz.com/signalr/';
  c.logging = true; // make it false to not show logging messages

  // >= v5.0.0
  c.executeEventsInZone = true; // optional, default is true
  c.executeErrorsInZone = false; // optional, default is false
  c.executeStatusChangeInZone = true; // optional, default is true
  return c;
}

@NgModule({
  declarations: [
    AppComponent,
    MainLoaderComponent,
    RootComponent
  ],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SignalRModule.forRoot(createConfig)
  ],
  exports:[BrowserAnimationsModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ExceptionInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    CrmService
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
