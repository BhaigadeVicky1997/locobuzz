import { Pipe, PipeTransform } from '@angular/core';
// import { LocobuzzUtils } from '@locobuzz/animations';

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform
{
    transform(mainArr: any[], searchText: string, property: string): any
    {
        // return LocobuzzUtils.filterArrayByString(mainArr, searchText);
    }
}
