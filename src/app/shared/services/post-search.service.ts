import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PostSearchService {
    searchForm: FormGroup;
    constructor() {
    }

    // generateForms(): void
    // {
    //     // this.searchForm = new FormGroup({});
    //     // this.searchForm.addControl('Search', new FormControl(''));
    //     // this.searchForm.addControl('AuthorName', new FormControl(''));
    //     // this.searchForm.addControl('DateWithin', new FormControl('6'));
    //     // this.searchForm.addControl('StartDate', new FormControl(null));
    //     // this.searchForm.addControl('EndDate', new FormControl(null));
    //     // this.searchForm.addControl('OgStartDate', new FormControl(moment().subtract(6, 'days').startOf('day').utc().unix()));
    //     // this.searchForm.addControl('OgEndDate', new FormControl(moment().endOf('day').utc().unix()));
    //     // this.searchForm.addControl('HasWords', new FormControl([]));
    //     // this.searchForm.addControl('NotWords', new FormControl([]));
    //     // this.searchForm.addControl('Channels', new FormControl([]));
    //     // this.searchForm.addControl('HasAttached', new FormControl(true));
    //     // this.searchForm.addControl('NotAttached', new FormControl(true));
    // }
}
