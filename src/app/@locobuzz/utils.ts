import _ from 'lodash';
export class LocobuzzUtils {
  public static filterArrayByString(mainArr, searchText): any {
    if (searchText === '') {
      return mainArr;
    }

    searchText = searchText.toLowerCase();

    return mainArr.filter((itemObj) => {
      return this.searchInObj(itemObj, searchText);
    });
  }

  public static searchInObj(itemObj, searchText): boolean {
    for (const prop in itemObj) {
      if (!itemObj.hasOwnProperty(prop)) {
        continue;
      }

      const value = itemObj[prop];

      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      } else if (Array.isArray(value)) {
        if (this.searchInArray(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
  }

  public static searchInArray(arr, searchText): boolean {
    for (const value of arr) {
      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
  }
  public static searchInString(value, searchText): any {
    return value.toLowerCase().includes(searchText);
  }
  public static generateGUID(): string {
    function S4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return S4() + S4();
  }
  public static toggleInArray(item, array): void {
    if (array.indexOf(item) === -1) {
      array.push(item);
    } else {
      array.splice(array.indexOf(item), 1);
    }
  }
  public static handleize(text): string {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  public static ObjectByGroup(object, keyName): { [k: string]: any } {
    return _.mapValues(_.groupBy(object, keyName), (clist) =>
      clist.map((option) => _.omit(option, keyName))
    );
  }

  public static isJSON(val): boolean {
    if (typeof val !== 'string') {
      val = JSON.stringify(val);
    }

    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }
}
