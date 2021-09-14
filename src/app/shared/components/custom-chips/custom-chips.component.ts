import { locobuzzAnimations } from '@locobuzz/animations';
import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-chips',
  templateUrl: './custom-chips.component.html',
  styleUrls: ['./custom-chips.component.scss'],
  animations: locobuzzAnimations
})
export class CustomChipsComponent implements OnInit, AfterViewInit {
    @Input() label: string;
    @Input() formval: [];
    @Output() outputEvent = new EventEmitter();

    Selectable = true;
    Removable = true;
    AddOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    Array: string[];

    ngOnInit(): void {
        this.Array = [];
    }

    ngAfterViewInit(): void
    {
        if (this.formval)
        {
            this.formval.forEach(element => {
            this.Array.push(element);
            });
        }
    }
    chipAdd(event: MatChipInputEvent): void
    {
        const input = event.input;
        const value = event.value;

        // Add our keyword
        if ((value || '').trim()) {
        this.Array.push(value.trim());
        }

        // Reset the input value
        if (input) {
        input.value = '';
        }
        this.outputEvent.emit(this.Array);
    }

    chipRemove(searchValue: string): void
    {
        const index = this.Array.indexOf(searchValue);
        if (index >= 0)
        {
            this.Array.splice(index, 1);
        }
        this.outputEvent.emit(this.Array);
    }

}
