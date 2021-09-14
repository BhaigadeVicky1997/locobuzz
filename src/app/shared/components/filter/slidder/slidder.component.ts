import { FormGroup, FormControl } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';

@Component({
    selector: 'app-slidder',
    templateUrl: './slidder.component.html',
    styleUrls: ['./slidder.component.scss'],
})
export class SlidderComponent implements OnInit {
    @Input() min: number;
    @Input() max: number;
    @Input() formVal: any;
    @Input() label: string;
    @Output() selectedData = new EventEmitter();
    @Output() DelExclude = new EventEmitter();
    @Input() isExclude: boolean;
    // follower Count sider
    followerCountRange: [number, number];
    followerCountMin: number;
    followerCountMax: number;
    followerValue: string;
    form: FormControl;
    setmin: number;
    setmax: number;

    ngOnInit(): void {
        if (this.formVal)
        {
            this.setmin = this.formVal.from;
            this.setmax = this.formVal.to;
        }
        this.followerCountRange = [this.min, this.max];
        if (this.setmin && this.setmax)
        {
            this.followerCountMin = this.setmin;
            this.followerCountMax = this.setmax;
        }
        else
        {
            this.followerCountMin = this.followerCountRange[0];
            this.followerCountMax = this.followerCountRange[1];
        }
        this.followerValue = `${this.followerCountMin} - ${this.followerCountMax}`;
    }

    // ngOnChanges(): void {
    //     this.followerCountRange = [this.min, this.max];
    //     if (this.setmin && this.setmax)
    //     {
    //         this.followerCountMin = this.setmin;
    //         this.followerCountMax = this.setmax;
    //         this.followerValue = `${this.followerCountMin} - ${this.followerCountMax}`;
    //     }
    //     else
    //     {
    //         this.followerCountMin = this.followerCountRange[0];
    //         this.followerCountMax = this.followerCountRange[1];
    //         this.followerValue = `${this.followerCountMin} - ${this.followerCountMax}`;
    //     }
    // }

    onSliderChange(countRange): void {
        this.followerCountMin = countRange[0];
        this.followerCountMax = countRange[1];
        this.followerValue = `${this.followerCountMin} - ${this.followerCountMax}`;
        this.selectedData.emit(countRange);
    }

    onRangeInput(type, event): void {
        const rangeAray: [number, number] = [ this.followerCountRange[0], this.followerCountRange[1]];
        if (type === 'min')
        {
            const mini = +event.target.value;
            rangeAray[0] = +event.target.value;
        }
        else
        {
            rangeAray[1] = +event.target.value;
        }
        this.followerCountRange = rangeAray;
        this.selectedData.emit(this.followerCountRange);
    }
    removeExcludeFilter(pass): void
    {
        this.DelExclude.emit(pass);
    }
}
