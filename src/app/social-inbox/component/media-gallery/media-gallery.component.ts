import { IsotopeGridDirective } from './../../../shared/directives/isotope-grid.directive';
import { MediaDropitemComponent } from './../media-dropitem/media-dropitem.component';
import { locobuzzAnimations } from '@locobuzz/animations';
import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GenericRequestParameters } from 'app/core/models/viewmodel/GenericRequestParameters';
import { MediaGalleryFilter } from 'app/core/models/viewmodel/MediaGalleryFilter';
import { MediaGalleryParameters } from 'app/core/models/viewmodel/MediaGalleryParameters';
import { UGCBrandMentionInformation } from 'app/core/models/viewmodel/UGCBrandMentionInformation';
import { UgcMention } from 'app/core/models/viewmodel/UgcMention';
import { MediagalleryService } from 'app/core/services/mediagallery.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { Subject } from 'rxjs';
import { MediaDropzoneComponent } from '../media-dropzone/media-dropzone.component';
import { CommonModule } from '@angular/common';
import { MediaFilterSorting } from 'app/core/models/viewmodel/MediaFilterSorting';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from './../../../shared/services/loader.service';
import { SubSink } from 'subsink';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { MediaEnum } from 'app/core/enums/MediaTypeEnum';

@Component({
  selector: 'app-media-gallery',
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.scss'],
  animations: locobuzzAnimations,
})
export class MediaGalleryComponent implements OnInit, OnDestroy {
  UGCMentionObj: UGCBrandMentionInformation;

  UGCMentionList = new Subject<UgcMention[]>();
  UGCMentionList$ = this.UGCMentionList.asObservable();
  clickedFromMediaGallery = false;
  selectedMedia: number = 0;
  mediaGalleryFilter: MediaGalleryFilter;
  mediaFilterSorting: MediaFilterSorting;
  showLoadMore = true;

  constructor(
    private dialog: MatDialog,
    private _filterService: FilterService,
    private _postDetailService: PostDetailService,
    private _mediaGalleryService: MediagalleryService,
    private changeDetector: ChangeDetectorRef,
    private replyService: ReplyService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<MediaGalleryComponent>,
    private _loaderService: LoaderService
  ) {
    this.mediaGalleryFilter = new MediaGalleryFilter();
    this.mediaFilterSorting = new MediaFilterSorting();
  }

  isActive: boolean = false;
  MediaSection = ['Media', 'UGC'];
  activeSection = this.MediaSection[0];
  subs = new SubSink();
  searchText = '';
  recordOffset = 0;
  ngOnInit(): void {
    // this._mediaGalleryService.LoadMediaGallery.subscribe(
    // (value) => {
    // if (value) {
    this.loadMediaGallery();
    this.subscribetoDropzoneEvent();
    this.subscribeToLoadMediaGallery();
    this.setCustomFiltersBasedOnMention();
    //  }
    // }
    // );
  }
  subscribeToLoadMediaGallery(): void {
    this.subs.add(this._mediaGalleryService.LoadMediaGallery.subscribe((value) => {
      if (value) {
        this.loadMediaGallery();
      }
    }));
  }

  openMediaDropzone(): void {
    this.clickedFromMediaGallery = false;
    this.dialog.open(MediaDropzoneComponent, {
      autoFocus: false,
      width: '900px',
      disableClose: true,
    });
  }

  setCustomFiltersBasedOnMention(): void {
    if (this._postDetailService.postObj.channelGroup === ChannelGroup.Twitter)
    {
      // remove file if twitter
      this.mediaFilterSorting.mediaType = this.mediaFilterSorting.mediaType.filter(obj => {
        return +obj.value !== 19;
      });
    }
  }

  public get mediaTypeEnum(): typeof MediaEnum {
    return MediaEnum;
  }


  loadMediaGallery(reloadAll?: boolean): void {
    this._loaderService.togglComponentLoader({
      section: 'media-gallery',
      status: true
    });

    let genericFilter: GenericRequestParameters = this._filterService.getGenericRequestFilter(
      this._postDetailService.postObj
    );
    genericFilter.oFFSET = this.recordOffset;
    // const mediaGalleryFilter = new MediaGalleryFilter();
    // mediaGalleryFilter.mediaTypes.push(2);
    genericFilter.noOfRows = 20;
    const mediafilter: MediaGalleryParameters = {
      param: genericFilter,
      scheduleID: 0,
      filters: this.mediaGalleryFilter,
    };

    this.subs.add(this._mediaGalleryService.GetMediaList(mediafilter).subscribe((data) => {
      console.log(`data`, data);
      data.lstUGCMention = data.lstUGCMention.map(obj => {
        obj.clicked = false;
        return obj;
      });
      if (this.UGCMentionObj && this.UGCMentionObj.lstUGCMention &&
         this.UGCMentionObj.lstUGCMention.length > 0 && !reloadAll)
      {
        if (data.lstUGCMention.length > 0)
        {
          this.UGCMentionObj.lstUGCMention.push(...data.lstUGCMention);
        }
        this.UGCMentionObj.totalRecords = data.totalRecords;
      }else{
        this.UGCMentionObj = data;
      }

      if (this.UGCMentionObj.lstUGCMention.length >= this.UGCMentionObj.totalRecords)
      {
        this.showLoadMore = false;
      }
      this.UGCMentionList.next(this.UGCMentionObj.lstUGCMention);
      this.changeDetector.detectChanges();
      this._loaderService.togglComponentLoader({
        section: 'media-gallery',
        status: false
      });
    }));
  }

  toggleSelectStatus(): void {
    this.isActive = !this.isActive;
  }

  openImagepopup(image): void {
    const ugcmentionObj = this.UGCMentionObj.lstUGCMention.filter((obj) => {
      if (obj.displayFileName === image) {
        return obj;
      }
    })[0];
    this._mediaGalleryService.currentUGC = JSON.parse(
      JSON.stringify(ugcmentionObj)
    );
    this.clickedFromMediaGallery = true;
    const dialogRef = this.dialog.open(MediaDropitemComponent, {
      autoFocus: false,
      width: '500px',
    });
    dialogRef.componentInstance.image = ugcmentionObj.mediaPath;
    dialogRef.componentInstance.inModal = true;
    dialogRef.componentInstance.displayName = ugcmentionObj.displayFileName;
    dialogRef.componentInstance.ugcMention = ugcmentionObj;
  }

  subscribetoDropzoneEvent(): void {
    this.subs.add(this._mediaGalleryService.EmitStarChangeEvent.subscribe((event) => {
      if (event && this.clickedFromMediaGallery) {
        const obj = JSON.parse(JSON.stringify(event));
        if (obj.value) {
          this.starAffect(obj);
        }
      }
    }));

    this.subs.add(this._mediaGalleryService.EmitPillsChanged.subscribe((event) => {
      if (event && this.clickedFromMediaGallery) {
        const obj = JSON.parse(JSON.stringify(event));
        if (obj.pillvalue) {
          this.onPillsChanged(obj);
        }
      }
    }));
  }

  onPillsChanged(event): void {
    if (this._mediaGalleryService.currentUGC) {
      if (event.operation === 'remove') {
        const index = this._mediaGalleryService.currentUGC.mediaTags.indexOf(
          event.pillvalue
        );
        if (index > -1) {
          this._mediaGalleryService.currentUGC.mediaTags.splice(index, 1);
        }
      } else if (event.operation === 'add') {
        if (this._mediaGalleryService.currentUGC) {
          if (
            this._mediaGalleryService.currentUGC &&
            this._mediaGalleryService.currentUGC.mediaTags &&
            this._mediaGalleryService.currentUGC.mediaTags.length > 0
          ) {
            this._mediaGalleryService.currentUGC.mediaTags.push(
              event.pillvalue
            );
          } else {
            this._mediaGalleryService.currentUGC.mediaTags = [];
            this._mediaGalleryService.currentUGC.mediaTags.push(
              event.pillvalue
            );
          }
        }
      }
    }
  }

  public starAffect(event): void {
    if (this._mediaGalleryService.currentUGC) {
      this._mediaGalleryService.currentUGC.rating = event.value;
    }
  }
  selectGivenMedia(event, ugcmention: UgcMention, index): void {
    console.log(event);
    console.log(ugcmention);
    // this.selectedIndex = index;
    // this.clickedFromMediaGallery = !this.clickedFromMediaGallery;
    this.UGCMentionObj.lstUGCMention = this.UGCMentionObj.lstUGCMention.map((obj) => {
      if (obj.mediaID === ugcmention.mediaID) {
        obj.clicked = !obj.clicked;
        if (obj.clicked) {
          this._mediaGalleryService.selectedMedia.push(ugcmention);
        } else {
          if (this._mediaGalleryService.selectedMedia && this._mediaGalleryService.selectedMedia.length > 0) {
            this._mediaGalleryService.selectedMedia = this._mediaGalleryService.selectedMedia.filter(
              object => {
                return object.mediaID !== obj.mediaID;
              }
            );
          }
        }
        console.log('current selected media', this._mediaGalleryService.selectedMedia);
        this.selectedMedia = this._mediaGalleryService.selectedMedia.length;
      }

      return obj;
    });
  }

  clearAllFilters(): void {

  }

  applyMediaFilter(event, item): void {
    console.log('media type', event);
    let selectedMediaType = false;
    // console.log((event.target as HTMLInputElement).value);
    if (item.type === 'mediatype') {
      if (event.checked) {
        this.mediaGalleryFilter.mediaTypes = [];
        this.mediaFilterSorting.mediaType.forEach(obj => {
          obj.checked = obj.value === +item.value ? true : false;
        });
        this.mediaGalleryFilter.mediaTypes.push(+item.value);
      }
      else {
        this.mediaGalleryFilter.mediaTypes = this.mediaGalleryFilter.mediaTypes.filter(
          obj => {
            return obj !== +item.value;
          }
        );
        if (this.mediaGalleryFilter.mediaTypes.length === 0)
        {
          this.mediaGalleryFilter.mediaTypes.push(MediaEnum.IMAGE);
          this.mediaFilterSorting.mediaType.forEach(obj => {
            obj.checked = obj.value === MediaEnum.IMAGE ? true : false;
          });
        }
      }
      selectedMediaType = true;
    }
    else if (item.type === 'rating') {
      if (event.checked) {
        this.mediaGalleryFilter.ratings.push(+item.value);
      }
      else {
        this.mediaGalleryFilter.ratings = this.mediaGalleryFilter.ratings.filter(
          obj => {
            return obj !== +item.value;
          }
        );
      }
    }
    else if (item.type === 'sortby') {
      if (item.value === 1) {
        this.mediaGalleryFilter.sortcolumn = 'CreatedDate';
      }
      else if (item.value === 2) {
        this.mediaGalleryFilter.sortcolumn = 'rating';
      }
    }
    else if (item.type === 'sortorder') {
      if (item.value === 1) {
        this.mediaGalleryFilter.sortby = 'asc';
      }
      else if (item.value === 2) {
        this.mediaGalleryFilter.sortby = 'desc';
      }
    }
    this.loadMediaGallery(selectedMediaType);
  }

  attachMediaToReply(): void {
    if (this._mediaGalleryService.selectedMedia && this._mediaGalleryService.selectedMedia.length > 0) {
      this.replyService.selectedMedia.next(this._mediaGalleryService.selectedMedia);
      this.dialogRef.close(true);
    }
    else {
      this._snackBar.open(`Please select at least one media file`, 'Ok', {
        duration: 2000
      });
    }
  }

  ngOnDestroy(): void {
    // this._mediaGalleryService.EmitPillsChanged.unsubscribe();
    // this._mediaGalleryService.EmitStarChangeEvent.unsubscribe();
    // this._mediaGalleryService.LoadMediaGallery.unsubscribe();
    this._mediaGalleryService.LoadMediaGallery.next(false);
    this.subs.unsubscribe();
  }

  imageLoaded(): void {
    // loaded functionality
  }

  toggleSection(section): void {
    this.activeSection = section;
  }

  searchMedia(): void {
    if (this.searchText.trim())
    {
      this.mediaGalleryFilter.imageTags.push(this.searchText);
      this.loadMediaGallery();
    }
    else
    {
      this.mediaGalleryFilter.imageTags = [];
      this.loadMediaGallery();
    }
  }

  loadMoreMedia(): void {
    this.recordOffset = this.recordOffset + 20;
    this.loadMediaGallery();
  }
}
