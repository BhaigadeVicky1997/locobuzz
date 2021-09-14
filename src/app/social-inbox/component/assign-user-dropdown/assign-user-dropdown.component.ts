import { Component, OnInit, Input, forwardRef, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LocobuzzUtils } from '@locobuzz/utils';
import _ from 'lodash';


@Component({
  selector: 'app-assign-user-dropdown',
  templateUrl: './assign-user-dropdown.component.html',
  styleUrls: ['./assign-user-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AssignUserDropdownComponent),
      multi: true
    }
  ]
})


export class AssignUserDropdownComponent implements OnInit, AfterViewInit {
  @Input() options: { [k: string]: any };
  @Input() label: string = '';
  @Input() value?: string;
  @ViewChild('inputElement') inputElement: ElementRef;
  @Output() selectedData = new EventEmitter();
  constructor() { }

  selectedOption: string;
  filteredOptionsGrouped: { [k: string]: any };
  filteredOptions: { [k: string]: any };
  disabled = false;
  form: FormControl;

  Object = Object;
  onChange: any = () => { };
  onTouched: any = () => { };
  ngOnInit(): void {
    this.options?.reverse();
    this.filteredOptions = LocobuzzUtils.ObjectByGroup(this.options, 'teamName');
    // this.ogOptions = this.filteredOptions;
    console.log(this.filteredOptions);
    this.form = new FormControl('Any User');
  }

  ngAfterViewInit(): void
  {
    if (this.value)
    {
      setTimeout(() => {
        this.selectedOption = this.setAssignValue(+this.value);
      }, 0);
    }
  }

  setAssignValue(value: number): string {
    return this.options.find(obj => {
      return obj.agentID === value;
    }).agentName;
  }

  writeValue(value: string): void {
    // this.selectedOption = this.ogOptions.filter((optionItem) => {
    //   if (optionItem[this.label] === value){
    //     return  optionItem[this.label];
    //   }
    //   return '';
    // });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setFormValue(value: string): void
  {
    this.form.patchValue(value);
    this.selectedData.emit(this.form);
  }



  filterOptions(value): any {
    const optionsGrouped = this._filter(value);
    this.filteredOptions = LocobuzzUtils.ObjectByGroup(optionsGrouped, 'teamName');
    this.onChange(this.selectedOption);
  }

  private _filter(value: string): { [k: string]: any } {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.agentName.toLowerCase().indexOf(filterValue) === 0);
  }

  filterSelection(event): void{
    console.log(event);
    this.selectedOption = event.option.value;
    this.inputElement.nativeElement.blur();
  }
}


