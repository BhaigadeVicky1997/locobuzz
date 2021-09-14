import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { locobuzzAnimations } from '@locobuzz/animations';
import { FilterService } from 'app/social-inbox/services/filter.service';
import * as moment from 'moment';
import { PostSearchService } from './../../services/post-search.service';

@Component({
  selector: 'app-post-search',
  templateUrl: './post-search.component.html',
  styleUrls: ['./post-search.component.scss'],
  animations: locobuzzAnimations
})
export class PostSearchComponent implements OnInit, OnDestroy{
  @Output() selectedData: EventEmitter<any>;
  channelDisplayData: {};
  searchForm: FormGroup;
  channelVal: string;

  constructor(
    private _filterService: FilterService,
    private _searchService: PostSearchService
  ) {
    this.selectedData = new EventEmitter();
  }

  ngOnInit(): void {

    this._filterService.getValue().subscribe(() => {
      this.channelDisplayData = this._filterService.fetchedChannelDisplayData;
    });
    this.searchForm = new FormGroup({});
    this.searchForm.addControl('Search', new FormControl(''));
    this._filterService.setSearch.subscribe((val) => {
      this.setSearchValue(val);
    });
  }

  ngOnDestroy(): void
  {
    if (this.searchForm.get('Search').dirty){
      this.searchForm.get('Search').patchValue('');
      this.selectedData.emit([this.searchForm.get('Search'), true]);
      // this._searchService.searchForm = new FormControl('');
    }
  }

  setSearchValue(value: string): void
  {
    this.searchForm.get('Search').patchValue(value);
  }

  search(event, isApplyed: boolean): void {
    this.selectedData.emit([this.searchForm.get('Search'), isApplyed]);
  }

  setChipsValue(name: string, value): void
  {
    (this.searchForm.get(name) as FormArray).patchValue(value);
  }

  dateSelected(name: string, event): void
  {
    if (name === 'dropdown')
    {
      (this.searchForm.get('StartDate') as FormControl).patchValue(null);
      (this.searchForm.get('EndDate') as FormControl).patchValue(null);
      (this.searchForm.get('OgEndDate') as FormControl).patchValue(moment().endOf('day').utc().unix());
      (this.searchForm.get('OgStartDate') as FormControl).patchValue(moment().subtract(event, 'days').startOf('day').utc().unix());
    }
    else if (name === 'Custom start')
    {
      (this.searchForm.get('DateWithin') as FormControl).patchValue(null);
      if (event.value) {
        const date = event.value.getDate();
        const month = event.value.getMonth();
        const year = event.value.getFullYear();
        (this.searchForm.get('OgStartDate') as FormControl).patchValue(moment([year, month, date]).unix());
      }
    }
    else if (name === 'Custom end')
    {
      (this.searchForm.get('DateWithin') as FormControl).patchValue(null);
      if (event.value) {
        const date = event.value.getDate();
        const month = event.value.getMonth();
        const year = event.value.getFullYear();
        (this.searchForm.get('OgEndDate') as FormControl).patchValue(moment([year, month, date]).unix());
      }
    }
    console.log(this.searchForm);
  }

  treeCheckList(name: string, event): void
  {
    (this.searchForm.get(name) as FormArray).patchValue(event);
    this.channelVal = 'Selected:' + this.searchForm.value.Channels.length;
    console.log(this.channelVal);
  }

}
