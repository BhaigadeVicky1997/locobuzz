import { PostDetailService } from './post-detail.service';
import { FilterService } from './filter.service';
import { Injectable } from '@angular/core';
import { AssignToList, AssignToListWithTeam } from '../../shared/components/filter/filter-models/assign-to.model';

@Injectable({
    providedIn: 'root'
})
export class PostAssignToService {

    assignTo: AssignToList[] = [];
    selectedAssignTo: number;
    defaultNote: string;
    constructor(
        private _filterService: FilterService,
        private _postDetailService: PostDetailService
    ){
        this.getAssignTo(this._filterService.fetchedAssignTo);
    }

    getAssignTo(list): void {

        console.log(this._postDetailService.postObj);
        const userwithteam: AssignToListWithTeam[] = [];
        for (const item of list) {
    
          for (const subItem of item.authorizedBrandsList) {
            if (subItem === this._postDetailService.postObj.brandInfo.brandID) {
              this.assignTo.push(item);
              if (userwithteam.length > 0) {
                for (const userObj of userwithteam) {
                  if (userObj.teamID === item.teamID) {
                    userObj.user.push(item);
                  }
                }
              } else {
                const userof: AssignToListWithTeam = {
                  teamID: item.teamID,
                  teamName: item.teamName,
                  user: [item]
                };
                userwithteam.push(userof);
              }
            }
          }
    
        }
    
        // setTimeout(() => {
    
        this.selectedAssignTo = this._postDetailService.postObj.ticketInfo.assignedTo;
        this.defaultNote = this._postDetailService.postObj.ticketInfo.lastNote;
        console.log(this.defaultNote);
        // }, 1);
      }
}
