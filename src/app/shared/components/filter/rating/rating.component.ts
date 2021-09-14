import { MatOption } from '@angular/material/core';
import { EachOptions } from '../filter-models/excludeDisplay.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnChanges, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit, OnChanges{
    @Input() default: any;
    @Input() options: EachOptions[];
    @Input() label: string;
    @Output() selectedData = new EventEmitter();
    @ViewChild('allSelected') private allSelected: MatOption;
    Form: FormGroup;


    ngOnInit(): void{
        this.Form = new FormGroup({});
        this.Form.addControl('options', new FormControl(this.default.value));
        this.Form.get('options').valueChanges.subscribe(data => {
        this.selectedData.emit(this.Form.controls.options);
        });
    }

    ngOnChanges(): void{
        this.Form = new FormGroup({});
        this.Form.addControl('options', new FormControl(this.default.value));
        this.Form.get('options').valueChanges.subscribe(data => {
        this.selectedData.emit(this.Form.controls.options);
        });
    }

    toggleAllSelection(): void{
        if (this.allSelected.selected){
          this.Form.controls.options.patchValue([...this.options.map(item => item.id)]);
          this.allSelected.select();
        } else {
          this.Form.controls.options.patchValue([]);
        }
      }

      tosslePerOne(): void{
        if (this.allSelected.selected) {
          this.allSelected.deselect();
        }
        else if (this.Form.controls.options.value.length === this.options.length){
          this.allSelected.select();
        }
      }

}
