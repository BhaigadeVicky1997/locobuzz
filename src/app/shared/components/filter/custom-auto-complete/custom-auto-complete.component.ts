import { FilterConfig } from '../../../../social-inbox/services/filter.config.service';
import { OnInit, Component, Inject, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, timeout } from 'rxjs/operators';
import { EachOptions } from '../filter-models/excludeDisplay.model';

@Component({
    selector: 'app-auto-complete',
    templateUrl: './custom-auto-complete.component.html',
    styleUrls: ['./custom-auto-complete.component.scss'],
})
export class CustomAutoCompleteComponent implements OnInit {
    @Input() allOptions: string[];
    @Input() URL: string;
    @Input() BrandID: number[];
    @Input() StartDateEpoch: number;
    @Input() EndDateEpoch: number;
    @Input() label: string;
    @Input() formval: FormControl;
    @Output() selectedData = new EventEmitter();
    @ViewChild('Input') Input: ElementRef;
    inputForm: FormControl;
    filteredOptions: Observable<string[]>;
    currOptions: any[];

    constructor(private _filterConfig: FilterConfig)
    {}
    ngOnInit(): void
    {
        this.inputForm = new FormControl(null);
        this.filteredOptions = this.filteredOptions = this.inputForm.valueChanges
        .pipe(
            startWith(''),
            map(value => this._filter(value))
        );
        if (this.allOptions)
        {
            this.currOptions = this.allOptions;
            this.filteredOptions = this.inputForm.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );
            this.inputForm.valueChanges
            .subscribe((val) => {
                this.selectedData.emit(val);
            });
        }

        if (this.URL && this.BrandID && this.StartDateEpoch && this.EndDateEpoch)
        {
            const x = JSON.stringify(this.BrandID);
            this.BrandID = JSON.parse(x);
            this.BrandID.pop();
            this.currOptions = [];
            this.inputForm.valueChanges
            .subscribe((val) => {
                this.fetchValue(val);
                this.selectedData.emit(val);
            });

        }
        this.allOptions = [''];
    }

    fetchValue(value: string): void
    {
        const replyBody = {
            BrandIDs: this.BrandID,
            startDateEpcoh: this.StartDateEpoch,
            EndDateEpoch: this.EndDateEpoch,
            AuthorName: value
        };
        this._filterConfig.postData(this.URL, replyBody).subscribe(resData => {
            const data1 = JSON.stringify(resData);
            this.allOptions = JSON.parse(data1).data;
            this.currOptions = JSON.parse(data1).data;
            this.filteredOptions = this.inputForm.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );
        });
    }

    selection(): void
    {
        this.Input.nativeElement.blur();
    }

    private _filter(value: string): string[] {
        let filterValue = '';
        if (value) {
          filterValue = value.toLowerCase();
        }
        if (!(this.URL && this.BrandID && this.StartDateEpoch && this.EndDateEpoch))
        {
            for (const each of this.allOptions) {
            this.currOptions = this.currOptions.filter(option => option !== each);
            }
        }
        return this.currOptions.filter(option => option.toLowerCase().includes(filterValue));
      }
}
