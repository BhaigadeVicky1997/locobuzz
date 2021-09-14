import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'environments/environment';
import { objectEach } from 'highcharts';
import { SignalR, SignalRConnection } from 'ng2-signalr';
import { AuthUser } from '../interfaces/User';
import { SignalMessage } from '../models/viewmodel/SignalMessage';
import { TicketsignalrService } from './signalrservices/ticketsignalr.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRHelperService {
  huburl = environment.hubUrl;
  private hubConnection: HubConnection;
  private connection: SignalRConnection;
  private ticketServiceModes: number[] = [1, 116, 103, 107, 121, 104, 108, 105,
                                   106, 111, 112, 113, 119, 120, 25, 26, 27, 1751, 1752];
  constructor(private _signalR: SignalR,
              private ticketSignalrService: TicketsignalrService) { }
  // for dotnew Core
  createCoreHubConnection(user: AuthUser): void
  {
    this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.huburl + 'controllerName', {
          accessTokenFactory: () => user.data.token
        })
        .withAutomaticReconnect()
        .build();

    this.hubConnection
        .start()
        .catch(error => {console.log(error); });

    this.hubConnection.on('Connected', (obj: any) => {
      console.log(obj);
    });

  }

  stopCoreHubConnection(): void {
    this.hubConnection.stop().catch(error => console.log(error) );
  }
  // End of dot net core

  // start of Asp.net

  public createHubConnection(): void {
    this.connection = this._signalR.createConnection();

    // event raises when status change happense
    this.connection.status.subscribe((s) => {
      console.warn('Connection Status', s.name, s.value);
      console.log(`%c Connection Status -> ${s.name} ${s.value}`, 'background: #222; color: #bada55');
      if (s.value === 4)
      {
        this.connection.start();
      }
    });

    this.connection.start().then((c) => {
      console.log('signalr connected');
    });

    const onMessageSent$ = this.connection.listenForRaw('broadcastMessage');
    onMessageSent$.subscribe((data: any[]) => {
      console.log('Listen for Raw', data);
      this.mapSignalData(data);
    });
  }

  mapSignalData(data: any[]): void {

    if (data && data.length > 0)
    {
      const signalObj: SignalMessage = {
        signalId : data[0],
        message : JSON.parse(unescape(data[1]))
      };
      console.log('coming from service', JSON.stringify(signalObj));
      // if (+signalObj.message.BrandID === 7121)
      // {
      if (this.ticketServiceModes.includes(Number(signalObj.signalId)))
        {
          this.ticketSignalrService.processSignal(signalObj);
        }
      // switch (Number(signalObj.signalId))
      // {
      //   case 1:
      //     this.ticketSignalrService.processSignal(signalObj);
      //     break;
      //     case 116:
      //     this.ticketSignalrService.processSignal(signalObj);
      //     break;
      //     default:
      //       break;

      // }
    // }

    }

  }

  stopHubConnection(): void {
    this.connection.stop();
  }

  // end of asp.net
}



