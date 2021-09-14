import { Tab } from '../models/menu/Menu';
import { FilterData } from '../../shared/components/filter/filter-models/filterData.model';
export interface LocobuzzNavigationItem
{
    id?: string;
    menuid?: number;
    title?: string;
    translate?: string;
    icon?: string;
    hidden?: boolean;
    url?: string;
    classes?: string;
    exactMatch?: boolean;
    externalUrl?: boolean;
    openInNewTab?: boolean;
    function?: any;
    pin?: {
        function?: any;
    };
    children?: LocobuzzNavigationItem[];
    // defaultTabs?: DefaultTabs[];
    defaultTabs?: Tab[];
    savedFilter?: Tab[];
}

export interface LocobuzzNavigation extends LocobuzzNavigationItem
{
    children?: LocobuzzNavigationItem[];

}

export interface SidebarNavigationItem {
    label?: string;
    value?: string;
}


export interface navbarItem {
    id: string;
    label?: string;
    value?: string;
}

export interface DefaultTabs {
  id?: string;
  title?: string;
  icon?: string;
  url?: string;
  guid?: string;
  tabId?: number;
  menuId?: number;
}


export interface categoryFilterItem
{

  postRequestData: object;
  nullSentiment: boolean;
  savedparent: Map<string, string>;
  upperCategories: Array<string>;
  savedsubCategory: Map<string, string>;
  savedsubsubCategory: Map<string, string>;
  parentRadio: Map<string, string>;
  subchildRadio: Map<string, string>;
  subsubRadio: Map<string, string>;
  selectedUpper: object;
  treeData: Array<object>;
  dataSource: Array<object>;
  temp: Array<object>;
  categoryCards: Array<object>[];
//   upper: string;
  DefaultSelected: string;
  inputValue: string;
  categoryType: string;

}


export interface Filter {
    name: string;
  }

export interface FilterServiceStructure {
    filterForm: any;
    filterData: FilterData;
    // channel Requirements
    fetchedChannelData: any;
    channelConfigUrl: string;
    // Filter Form methods
    getFilled(FilterData: any, ChannelData: any): void;
    populateFilter(): void;
    fillChannelData(chData: {}): void;
    // Flag For TreeCheckList
    getValue(): any;
    setValue(newValue: boolean): void;
}

export interface FilterComponentStructure {
    minDate: Date;
    maxDate: Date;
    filterData: object;
    filterForm: any;
    Object: Object;
    // Flag for TreeChecklist
    startTreelist: boolean;
    // For Adding values to Keywords1
    ANDChipAdd(event: any): void;
    ANDChipRemove(fruit: Filter): void;
    // For Adding values to Keywords2
    ORChipAdd(event: any): void;
    ORChipRemove(fruit: Filter): void;
    // For Adding values to Keywords3
    DoNotChipadd(event: any): void;
    DoNotChipRemove(fruit: Filter): void;
    // To Submit the Form
    filterFormSubmited(isForCount: boolean): void;

  }
