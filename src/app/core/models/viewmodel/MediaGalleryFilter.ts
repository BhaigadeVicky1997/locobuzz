export class MediaGalleryFilter {
    mediaTypes?: number[];
    imageTags?: string[];
    serachOption?: number;
    serachText?: string;
    isUGC?: boolean;
    sortby?: string;
    sortcolumn?: string;
    ratings?: number[];

    constructor(){
    this.mediaTypes = [2];
    this.imageTags = [];
    this.serachOption = 0;
    this.serachText = '';
    this.isUGC = false;
    this.sortby = 'desc';
    this.sortcolumn = 'CreatedDate';
    this.ratings = [];
    }
}