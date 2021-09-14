import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy
} from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss']
})
export class CustomDropdownComponent implements OnInit, OnDestroy {

  @Input() model;
  @Input() labelKey = 'label';
  @Input() idKey = 'id';
  @Input() placeholder: string = 'Select Option';
  @Input() options = [];
  @Input() searchOptions: boolean = false;
  @Output() selectChange = new EventEmitter();
  @Output() dropdownState = new EventEmitter();
  visibleOptions = 2;
  inputSubject: any;
  searchControl = new FormControl();
  private originalOptions = [];

  constructor() {}



  ngOnInit(): void {
    this.originalOptions = [...this.options];
    if (this.model !== undefined) {
      this.model = this.options.find(currentOption => currentOption[this.idKey] === this.model);
    }

    this.inputSubject = this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
      )
      .subscribe((term: string) => this.search(term));
  }

  get label(): string {
    return this.model ? this.model[this.labelKey] : this.placeholder;
  }

  customDropdownOpened(): void {
      this.dropdownState.emit(true);
  }

  customDropdownClosed(): void {
    this.dropdownState.emit(false);
  }


  select(option): void {
    this.model = option;
    this.selectChange.emit(option[this.idKey]);
  }

  isActive(option): any {
    if (!this.model) {
      return false;
    }
    return option[this.idKey] === this.model[this.idKey];
  }

  search(value: string): void {
    this.options = this.originalOptions.filter(option => option[this.labelKey].toLowerCase().includes(value.toLowerCase()));
    requestAnimationFrame(() => (this.visibleOptions = this.options.length || 1));
  }

  ngOnDestroy(): void {
    this.inputSubject.unsubscribe();
  }


}
