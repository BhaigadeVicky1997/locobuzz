import { ticketMentionDropdown } from '../../app-data/filter';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PostOptionService {
    optionForm: FormGroup;
    constructor() {
        this.generateForms();
     }

    generateForms(): void
    {
        this.optionForm = new FormGroup({});
        this.optionForm.addControl('sortBy', new FormControl(ticketMentionDropdown.sortBy.default));
        this.optionForm.addControl('sortOrder', new FormControl(ticketMentionDropdown.sortOrder.default));
    }
    setSortByValue(value: string): void
    {
        // this.optionForm.get('sortBy').setValue(value, {emitEvent: false});
    }
    setSortOrderValue(value: string): void
    {
        // this.optionForm.get('sortOrder').setValue(value, {emitEvent: false});
    }
}
