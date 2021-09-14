import { MatOption } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EachOptions } from '../filter-models/excludeDisplay.model';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnChanges, AfterViewInit, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.scss'],
})
export class MultipleSelectComponent implements OnInit, OnChanges {
  @Input() Options: EachOptions[];
  @Input() label: string;
  @Input() formval: FormControl;
  @Input() formcondition: FormControl;
  @Output() selectedData = new EventEmitter();
  @ViewChild('allSelected') private allSelected: MatOption;
  Form: FormGroup;

  ngOnInit(): void
  {
    this.Form = new FormGroup({});
    this.Form.addControl('options', new FormControl(this.formval.value));
    this.Form.addControl('condition', new FormControl(true));
    this.Form.get('options').valueChanges.subscribe(data => {
      this.selectedData.emit([this.Form.controls.options, this.Form.controls.condition]);
    });
    if (this.formcondition)
    {
      this.Form.get('condition').patchValue(this.formcondition.value);
      this.formcondition.valueChanges.subscribe((val) => {
        const tempForm = this.Form.get('condition');
        tempForm.patchValue(val);
        if (this.formcondition.disabled)
        {
          tempForm.disable();
          console.log('ME working')
        }
        else
        {
          tempForm.enable();
        }
      });
    }
  }
  ngOnChanges(): void
  {
    this.Form = new FormGroup({});
    this.Form.addControl('options', new FormControl(this.formval.value));
    this.Form.addControl('condition', new FormControl(true));
    this.Form.get('options').valueChanges.subscribe(data => {
      this.selectedData.emit([this.Form.controls.options, this.Form.controls.condition]);
    });
    if (this.formcondition)
    {
      this.Form.get('condition').patchValue(this.formcondition.value);
      this.formcondition.valueChanges.subscribe((val) => {
        const tempForm = this.Form.get('condition');
        tempForm.patchValue(val);
        if (this.formcondition.disabled)
        {
          tempForm.disable();
          console.log('ME working')
        }
        else
        {
          tempForm.enable();
        }
      });
    }
  }



  toggleAllSelection(): void{
    if (this.allSelected.selected){
      this.Form.controls.options.patchValue([...this.Options.map(item => item.id)]);
      this.allSelected.select();
    } else {
      this.Form.controls.options.patchValue([]);
    }
  }

  tosslePerOne(): void{
    if (this.allSelected.selected) {
      this.allSelected.deselect();
    }
    else if (this.Form.controls.options.value.length === this.Options.length){
      this.allSelected.select();
    }
  }
}
