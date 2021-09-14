import { MatDialog } from '@angular/material/dialog';
import { AlertPopupComponent } from '../../alert-popup/alert-popup.component';
import { AdvanceFilterService } from '../../../../social-inbox/services/advance-filter.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { Component, Input, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { AlertDialogModel } from 'app/shared/components/alert-popup/alert-popup.component';


@Component({
  selector: 'app-advance-filter',
  templateUrl: './advance-filter.component.html',
  styleUrls: ['./advance-filter.component.scss'],
})
export class AdvanceFilterComponent implements OnInit, OnDestroy {
  @ViewChild('allSelectedBrand') private allSelectedBrand: MatOption;
  brandDurationForm: FormGroup;
  AdvanceFilterDisplayData: any;
  brandTouchedDone: boolean;
  durationTouchedDone: boolean;
  Object = Object;
  advanceFilterRuleDisplay: { metaData?: any };
  advanceFilterRuleForm: FormGroup;
  allAttributeOptions = [];
  notToRepeatOgName: string[];
  notToRepeatDisplayName: string[];
  hideOnTickets: string[];
  hideOnMention: string[];
  whatToMonitor: string;
  // Form Values
  duratioLabel: string = 'Last Two Days';
  customDurationToggle: boolean = false;
  constructor(private _advanceFilterService: AdvanceFilterService,
    public dialog: MatDialog) {
  }


  ngOnInit(): void {
    this.hideOnMention = this._advanceFilterService.hideOnMentions;
    this.hideOnTickets = this._advanceFilterService.hideOnTickets;
    this.AdvanceFilterDisplayData = this._advanceFilterService.AdvanceFilterDisplayData;
    this.brandDurationForm = this._advanceFilterService.brandDurationForm;
    this.notToRepeatOgName = this._advanceFilterService.notToRepeatOgName;
    this.notToRepeatDisplayName = this._advanceFilterService.notToRepeatDisplayName;

    // call this as Done in filter
    this._advanceFilterService.getValue().subscribe(
      (value) => {
        if (value) {
          this.AdvanceFilterDisplayData = this._advanceFilterService.AdvanceFilterDisplayData;
          console.log(this.AdvanceFilterDisplayData);
          console.log('me again called');
        }
      }
    );

    // make all brands selected
    if (this.brandDurationForm.controls.selectBrand.value === null) {
      this.brandDurationForm.controls.selectBrand
        .patchValue([...this.AdvanceFilterDisplayData.brandDateDuration.selectBrand.options.map(item => item.id), 'All']);
    }

    this.advanceFilterRuleDisplay = this._advanceFilterService.advanceFilterRuleDisplay;
    this.advanceFilterRuleForm = this._advanceFilterService.advanceFilterRuleForm;
    this.allAttributeOptions = this._advanceFilterService.allAttributeOptions;

    console.log(this.brandDurationForm);
    this.whatToMonitor = this._advanceFilterService.whatToMonitor;
    this.switchTicketsAndMention(this.whatToMonitor);

    this.notifyWhatToMonitor(this.whatToMonitor);
  }



  notifyWhatToMonitor(value): void {
    if (this.whatToMonitor !== value) {
      if (Object.keys(this.advanceFilterRuleDisplay).length < 2) {
        this.whatToMonitor = value;
        this.switchTicketsAndMention(value);
      }
      else {
        // Show Dialog
        const message = 'Changing To ' + value + ' Can Reset the Filters Do you want to continue ?';
        const dialogData = new AlertDialogModel('Autoclosure', message, 'Yes', 'No');
        const dialogRef = this.dialog.open(AlertPopupComponent, {
          disableClose: true,
          autoFocus: false,
          data: dialogData
        });

        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult) {
            // Reset the Rules
            for (const each of Object.keys(this.advanceFilterRuleDisplay)) {
              if (each === 'metaData') {
                continue;
              }
              delete (this.advanceFilterRuleDisplay[each]);
              delete this.advanceFilterRuleForm.controls[each];
            }
            this.switchTicketsAndMention(value);
            this.whatToMonitor = value;
          }
          else {
            console.log(this.brandDurationForm.controls.whatToMonitor.value);
            this.brandDurationForm.controls.whatToMonitor.patchValue(this.whatToMonitor);
          }
        });
      }
    }
  }


  switchTicketsAndMention(name): void {
    switch (name) {
      case 'Tickets':
        {
          const AttOptions: string[] = [];
          for (const each of this._advanceFilterService.allAttributeOptions) {
            if (this.hideOnTickets.indexOf(each.label) !== -1) {
              continue;
            }
            AttOptions.push(each);
          }
          this.allAttributeOptions = AttOptions;
          break;
        }
      case 'All Mentions':
        {
          const AttOptions: string[] = [];
          for (const each of this._advanceFilterService.allAttributeOptions) {
            if (this.hideOnMention.indexOf(each.label) !== -1) {
              continue;
            }
            AttOptions.push(each);
          }
          this.allAttributeOptions = AttOptions;
          break;
        }
      default:
        {
          break;
        }
    }
  }



  ngOnDestroy(): void {
    this._advanceFilterService.advanceFilterRuleDisplay = this.advanceFilterRuleDisplay;
    this._advanceFilterService.advanceFilterRuleForm = this.advanceFilterRuleForm;
    this._advanceFilterService.whatToMonitor = this.whatToMonitor;
  }


  toggleAllBrandSelection(): void {
    if (this.allSelectedBrand.selected) {
      this.brandDurationForm.controls.selectBrand
        .patchValue([...this.AdvanceFilterDisplayData.brandDateDuration.selectBrand.options.map(item => item.id)]);
      this.allSelectedBrand.select();
    } else {
      this.brandDurationForm.controls.selectBrand.patchValue([]);
      this.allSelectedBrand.deselect();
    }
  }

  tosslePerOneBrand(): void {
    if (this.allSelectedBrand.selected) {
      this.allSelectedBrand.deselect();
    }
    else if
      (
      this.brandDurationForm.controls.selectBrand.value.length
      === this.AdvanceFilterDisplayData.brandDateDuration.selectBrand.options.length
    ) {
      this.allSelectedBrand.select();
    }
  }

  brandTouched(value: boolean): void {
    if (!value) {
      this.brandTouchedDone = true;
      if (this.brandDurationForm.controls.selectBrand.value.length === 0) {
        this.brandDurationForm.controls.selectBrand
          .patchValue([...this.AdvanceFilterDisplayData.brandDateDuration.selectBrand.options.map(item => item.id)]);
        this.allSelectedBrand.select();
      }
      //   call api
      this._advanceFilterService.fillBrandSelected(this.brandDurationForm);
    }
  }

  durationTouched(value: boolean): void {
    if (!value) {
      this.durationTouchedDone = true;
      if (this.brandTouchedDone && this.durationTouchedDone) {
        if (this.brandDurationForm.controls.selectBrand.value.length === 0) {
          this.brandDurationForm.controls.selectBrand
            .patchValue([...this.AdvanceFilterDisplayData.brandDateDuration.selectBrand.options.map(item => item.id)]);
          this.allSelectedBrand.select();
        }
        // call API
        this._advanceFilterService.fillBrandSelected(this.brandDurationForm);
      }
      else {
        this._advanceFilterService.onlyDurationSelected(this.brandDurationForm.controls.Duration.value.StartDate.value,
          this.brandDurationForm.controls.Duration.value.EndDate);
      }
    }
  }

  customDurationStartdate(event): void {
    if (event.value) {
      console.log(this.brandDurationForm);
      console.log(event);
      const date = event.value.getDate();
      const month = event.value.getMonth();
      const year = event.value.getFullYear();
      ((this.brandDurationForm.get('Duration') as FormGroup).get('StartDate') as FormControl)
        .patchValue(moment([year, month, date]).unix());
    }
  }

  customDurationEnddate(event): void {
    if (event.value) {
      console.log(this.brandDurationForm);
      console.log(event);
      const date = event.value.getDate();
      const month = event.value.getMonth();
      const year = event.value.getFullYear();
      ((this.brandDurationForm.get('Duration') as FormGroup).get('EndDate') as FormControl)
        .patchValue(moment([year, month, date]).unix());
    }
  }

  setDurationValue(item, event): void {
    console.log(item, event);
    console.log(moment().subtract(item.id, 'days').utc().unix(), moment().endOf('day').unix());
    ((this.brandDurationForm.get('Duration') as FormGroup).get('StartDate') as FormControl)
      .patchValue(moment().subtract(item.id, 'days').utc().unix());

    ((this.brandDurationForm.get('Duration') as FormGroup).get('EndDate') as FormControl)
      .patchValue(moment().endOf('day').unix());
    this.duratioLabel = item.label;
    if (item?.label === 'Custom') {
      event.stopPropogation();
    }
    if (item?.label !== 'Custom') {
      this.customDurationToggle = false;
    }
    console.log(this.brandDurationForm);
  }


  filledCustomDuration(): void {
    const start = new Date(this.brandDurationForm.value.Duration.StartDate * 1000)
      .toLocaleDateString('en-US');
    const end = new Date(this.brandDurationForm.value.Duration.EndDate * 1000)
      .toLocaleDateString('en-US');
    const label = start + '-' + end;
    this.duratioLabel = label;
    this.customDurationToggle = false;
    this.durationTouched(false);
  }


  // Dropdown Width
  getWidth(element: HTMLElement): string {
    return `${element.clientWidth}px`;
  }

  addGroupsToRules(): void {
    let key = 0;
    this.advanceFilterRuleDisplay.metaData.maxGroupkey += 1;
    key = this.advanceFilterRuleDisplay.metaData.maxGroupkey;
    this.advanceFilterRuleDisplay[key] =
    {
      metaData: {
        maxAttributekey: 0,
        options: this.allAttributeOptions
      },
      0: {
        attributeOptions: {
          displayName: 'Attribute',
          options: this.allAttributeOptions,
        },
        originalAttribute: {
          displayName: 'Please Select Attribute First',
          type: 'select',
          options: []
        }
      }
    };
    const formgroup = new FormGroup({});
    const formgroup1 = new FormGroup({});
    const attributeOptions = new FormControl(null);
    const originalAttribute = new FormControl(null);
    formgroup1.addControl('attributeOptions', attributeOptions);
    formgroup1.addControl('originalAttribute', originalAttribute);
    formgroup.addControl('0', formgroup1);
    formgroup.addControl('condition', new FormControl('AND'));

    this.advanceFilterRuleForm.addControl(key.toString(), formgroup);
    (((this.advanceFilterRuleForm.get(key.toString()) as FormGroup).get('0') as FormGroup)
      .get('originalAttribute') as FormControl).disable();


    this.valueChangeNortify(key.toString());
    console.log(this.advanceFilterRuleDisplay);
    console.log(this.advanceFilterRuleForm);
  }

  valueChangeNortify(group: string): void {
    ((this.advanceFilterRuleForm.get(group) as FormGroup).get('condition') as FormControl)
      .valueChanges.subscribe(
        (value) => {
          if (value === 'OR') {
            this.advanceFilterRuleDisplay[group].metaData.options = this.allAttributeOptions;
          }
          else {
            const message = 'Changing To ' + value + ' Can Reset some filters Do you want to continue ?';
            const dialogData = new AlertDialogModel('Autoclosure', message, 'Yes', 'No');
            const dialogRef = this.dialog.open(AlertPopupComponent, {
              disableClose: true,
              autoFocus: false,
              data: dialogData
            });

            dialogRef.afterClosed().subscribe(dialogResult => {
              if (dialogResult) {
                let attributesOption = this.allAttributeOptions;
                const countRemove = [];
                for (const attribute of Object.keys(this.advanceFilterRuleDisplay[group])) {
                  if (attribute === 'metaData') {
                    continue;
                  }
                  const ind = this.notToRepeatDisplayName.
                    indexOf(this.advanceFilterRuleDisplay[group][attribute].originalAttribute.displayName);
                  if (ind !== -1) {
                    const replaceOption = [];
                    let verify = 0;
                    for (const check of attributesOption) {
                      if (check.label === this.advanceFilterRuleDisplay[group][attribute].originalAttribute.displayName) {
                        verify += 1;
                        continue;
                      }
                      replaceOption.push(check);
                    }
                    attributesOption = replaceOption;
                    if (verify === 0) {
                      countRemove.push([group, attribute]);
                    }
                  }
                }
                this.advanceFilterRuleDisplay[group].metaData.options = attributesOption;
                for (const each of countRemove) {
                  delete this.advanceFilterRuleDisplay[each[0]][each[1]];
                  delete (this.advanceFilterRuleForm.get(each[0]) as FormGroup).controls[each[1]];
                }
              }
              else {
                ((this.advanceFilterRuleForm.get(group) as FormGroup).get('condition') as FormControl).patchValue('OR');
              }
            });
          }
        }
      );
  }

  attributeSelected(group: string, attribute, event): void {
    console.log(group, attribute, event);
    if (((this.advanceFilterRuleForm.get(group) as FormGroup).get('condition') as FormControl).value === 'AND'
      || ((this.advanceFilterRuleForm.get(group) as FormGroup).get('condition') as FormControl).value === 'NOT') {
      if (this.notToRepeatOgName.indexOf(event.value) !== -1) {
        const each = { id: event.value, label: this.AdvanceFilterDisplayData.allFilterAttribute[event.value].displayName };
        const option = [];
        for (const one of this.advanceFilterRuleDisplay[group].metaData.options) {
          if (one.id === each.id && one.label === each.label) {
            continue;
          }
          option.push(one);
        }
        this.advanceFilterRuleDisplay[group].metaData.options = option;
        console.log(this.advanceFilterRuleDisplay[group].metaData.options, each);
      }
    }
    this.advanceFilterRuleDisplay[group][attribute].originalAttribute = this.AdvanceFilterDisplayData.allFilterAttribute[event.value];
    (((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup).get('attributeOptions') as FormControl).disable();
    (((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup).get('originalAttribute') as FormControl).enable();
    if (event.value === 'Category' || event.value === 'upperCategory') {
      ((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup)
        .addControl(event.value + 'condition', new FormControl(true));
    }
  }

  addNewAttribute(group: string): void {
    console.log(group);
    let key = 0;
    this.advanceFilterRuleDisplay[group].metaData.maxAttributekey += 1;
    key = this.advanceFilterRuleDisplay[group].metaData.maxAttributekey;
    this.advanceFilterRuleDisplay[group][key] =
    {
      attributeOptions: {
        displayName: 'Attribute',
        options: this.advanceFilterRuleDisplay[group].metaData.options,
      },
      originalAttribute: {
        displayName: 'Please Select Attribute First',
        type: 'select',
        options: []
      }
    };
    // this.advanceFilterRuleForm.controls.group.controls.addControl()
    const formgroup = new FormGroup({});
    const attributeOptions = new FormControl(null);
    const originalAttribute = new FormControl(null);
    formgroup.addControl('attributeOptions', attributeOptions);
    formgroup.addControl('originalAttribute', originalAttribute);
    (this.advanceFilterRuleForm.get(group) as FormGroup).addControl(key.toString(), formgroup);
    (((this.advanceFilterRuleForm.get(group) as FormGroup).get(key.toString()) as FormGroup)
      .get('originalAttribute') as FormControl).disable();

    console.log(this.advanceFilterRuleForm);
  }

  deleteAttribute(group: string, attribute: string): void {
    console.log(this.advanceFilterRuleDisplay[group][attribute].originalAttribute.displayName);
    if (((this.advanceFilterRuleForm.get(group) as FormGroup).get('condition') as FormControl).value === 'AND'
      || ((this.advanceFilterRuleForm.get(group) as FormGroup).get('condition') as FormControl).value === 'NOT') {
      const ind = this.notToRepeatDisplayName.indexOf(this.advanceFilterRuleDisplay[group][attribute].originalAttribute.displayName);
      console.log(ind, this.notToRepeatOgName[ind]);
      if (ind !== -1) {
        const each =
        {
          id: this.notToRepeatOgName[ind],
          label: this.AdvanceFilterDisplayData.allFilterAttribute[this.notToRepeatOgName[ind]].displayName
        };
        this.advanceFilterRuleDisplay[group].metaData.options.push(each);
      }
    }
    delete this.advanceFilterRuleDisplay[group][attribute];
    delete (this.advanceFilterRuleForm.get(group) as FormGroup).controls[attribute];
  }

  deleteGroup(group): void {
    delete (this.advanceFilterRuleDisplay[group]);
    delete this.advanceFilterRuleForm.controls[group];
    console.log(this.advanceFilterRuleForm);
    console.log(this.advanceFilterRuleDisplay);
  }

  setSlidderValue(group: string, attribute: string, event): void {
    console.log(event);
    if (event) {
      const optionvalue = event;
      ((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup).get('originalAttribute')
        .patchValue(
          {
            from: optionvalue[0],
            to: optionvalue[1]
          });
    }
    else {
      ((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup).get('originalAttribute')
        .patchValue(null);
    }
    console.log(this.advanceFilterRuleForm);
  }

  setAutoCompleteValue(group: string, attribute: string, event): void {
    ((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup).get('originalAttribute').patchValue(event);
    console.log(this.advanceFilterRuleForm);
  }

  setMultiSelectValue(group, attribute, event): void {
    if (event.length > 1) {
      const condition = event[1];
      if (((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup)
        .get((((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup)
          .get('attributeOptions') as FormControl).value + 'condition')) {
        ((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup)
          .get((((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup)
            .get('attributeOptions') as FormControl).value + 'condition')
          .patchValue(condition.value);
      }
    }
    if (event) {
      let optionvalue = event[0].value;
      optionvalue = optionvalue.filter((val) => val !== 'All');
      ((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup).get('originalAttribute')
        .patchValue([...optionvalue.map(item => item)]);
    }
    else {
      ((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup).get('originalAttribute')
        .patchValue([]);
    }
  }

  setRatingValue(group: string, attribute: string, event): void {
    console.log(event);
    if (event) {
      let optionvalue = event.value;
      optionvalue = optionvalue.filter((val) => val !== 'All');
      ((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup).get('originalAttribute')
        .patchValue([...optionvalue.map(item => item)]);
    }
    else {
      ((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute) as FormGroup).get('originalAttribute')
        .patchValue([]);
    }
    console.log(this.advanceFilterRuleForm);
  }

  assignTreeCheckListData(group: string, attribute: string, event: []): void {
    ((this.advanceFilterRuleForm.get(group) as FormGroup).get(attribute)).get('originalAttribute').patchValue(event);
    console.log(this.advanceFilterRuleForm);
  }

  advanceFilterFormSubmit(callextraapis = true): void {
    this._advanceFilterService.fillAdvanceFilterForm(this.advanceFilterRuleForm, this.brandDurationForm, callextraapis);
  }
}
