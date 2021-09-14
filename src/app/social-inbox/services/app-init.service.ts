import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  private readonly CONFIG_URL = 'assets/config/config.js';
  private config$: Observable<any>;

  constructor() { }
}
