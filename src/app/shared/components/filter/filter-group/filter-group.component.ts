import { FilterGroupService } from '../../../../social-inbox/services/filter-group.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OnInit, Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationService } from 'app/core/services/navigation.service';
import { TabService } from 'app/core/services/tab.service';

@Component({
    selector: 'app-filter-group',
    templateUrl: './filter-group.component.html',
    styleUrls: ['./filter-group.component.scss'],
})
export class FilterGroupComponent implements OnInit {

    filterGroupForm: FormGroup;
    tabindex: number;
    constructor(
        private _filterGroupService: FilterGroupService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<FilterGroupComponent>,
        private _snackBar: MatSnackBar,
        private _tabService: TabService,
        @Inject(MAT_DIALOG_DATA) public whoCalled: { TabIndex: number}
    ) {
        if (whoCalled && whoCalled.TabIndex > -1)
        {
            this.tabindex = whoCalled.TabIndex;
        }
        this.generateForm();
    }

    ngOnInit(): void { }

    // Create From for Filter Group
    generateForm(): void {
        this.filterGroupForm = new FormGroup({
            GroupName : new FormControl(null),
            Description: new FormControl(null)
        });
    }

    // Take the From Filled Data
    submit(): void {
        const filterGroupformObj = this.filterGroupForm.getRawValue();
        if (filterGroupformObj.GroupName)
        {
            const filterFormData = this.whoCalled;
            this._filterGroupService.saveData(filterGroupformObj, this.tabindex)
            .subscribe(response => {
                if (response.success)
                {
                    this._snackBar.open('Tab added successfully', 'Ok', {
                        duration: 2000,
                      });
                    this.dialog.closeAll();
                    this._tabService.addNewTab(response.tab);
                }
                else{
                    this._snackBar.open('Some error occurred while saving tab', 'Ok', {
                        duration: 2000,
                      });
                }
            });
            this.closeDialog();
        }
        else{
            this._snackBar.open('please enter group name', 'Ok', {
                duration: 2000,
              });
        }
    }

    // To close this dialog
    closeDialog(): void {
        // this.dialog.closeAll();
        this.dialogRef.close(true);
    }
}
