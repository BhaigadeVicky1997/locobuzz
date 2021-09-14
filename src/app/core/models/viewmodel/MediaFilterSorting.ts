export class MediaFilterSorting
{
    mediaType: FilterTypeObject[];
    ratings: FilterTypeObject[];
    sortBy: FilterTypeObject[];
    orderBy: FilterTypeObject[];

    constructor(){
        this.mediaType = FilterTypeObject.getfilterObj('mediatype');
        this.ratings = FilterTypeObject.getfilterObj('rating');
        this.sortBy = FilterTypeObject.getfilterObj('sortby');
        this.orderBy = FilterTypeObject.getfilterObj('sortorder');
    }
}
export class FilterTypeObject
{
    type?: string;
    name?: string;
    value?: number;
    checked?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    constructor(type: string) {
        this.checked = false;
        this.disabled = false;
        this.hidden = false;
        this.type = type;
    }

    static getfilterObj(type: string): FilterTypeObject[]
    {
        if (type === 'mediatype')
        {
            const filterarray: FilterTypeObject[] = [];
            let filterobj = new FilterTypeObject(type);
            filterobj.name = 'Image';
            filterobj.value = 2;
            filterobj.checked = true;
            filterarray.push(filterobj);
            filterobj = new FilterTypeObject(type);
            filterobj.name = 'Video';
            filterobj.value = 3;
            filterarray.push(filterobj);
            filterobj = new FilterTypeObject(type);
            filterobj.name = 'UGC';
            filterobj.value = -1;
            filterarray.push(filterobj);
            filterobj = new FilterTypeObject(type);
            filterobj.name = 'File';
            filterobj.value = 19;
            filterarray.push(filterobj);
            return filterarray;
        }

        if (type === 'rating')
        {
            const filterarray: FilterTypeObject[] = [];
            let filterobj = new FilterTypeObject(type);
            filterobj.name = 'five';
            filterobj.value = 5;
            filterarray.push(filterobj);
            filterobj = new FilterTypeObject(type);
            filterobj.name = 'four';
            filterobj.value = 4;
            filterarray.push(filterobj);
            filterobj = new FilterTypeObject(type);
            filterobj.name = 'three';
            filterobj.value = 3;
            filterarray.push(filterobj);
            filterobj = new FilterTypeObject(type);
            filterobj.name = 'two';
            filterobj.value = 2;
            filterarray.push(filterobj);
            filterobj = new FilterTypeObject(type);
            filterobj.name = '1';
            filterobj.value = 1;
            filterarray.push(filterobj);
            return filterarray;
        }
        if (type === 'sortby')
        {
            const filterarray: FilterTypeObject[] = [];
            let filterobj = new FilterTypeObject(type);
            filterobj.name = 'Created Date';
            filterobj.value = 1;
            filterarray.push(filterobj);
            filterobj = new FilterTypeObject(type);
            filterobj.name = 'Rating';
            filterobj.value = 2;
            filterarray.push(filterobj);
            return filterarray;
        }
        if (type === 'sortorder')
        {
            const filterarray: FilterTypeObject[] = [];
            let filterobj = new FilterTypeObject(type);
            filterobj.name = 'Ascending';
            filterobj.value = 1;
            filterarray.push(filterobj);
            filterobj = new FilterTypeObject(type);
            filterobj.name = 'Descending';
            filterobj.value = 2;
            filterarray.push(filterobj);
            return filterarray;
        }


    }
}
