import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'datetimeFormatter'
})
export class DatetimeFormatterPipe implements PipeTransform {

  transform(value: Date , args?: string): unknown {
    if (args === 'chatbot'){
      const timeNow = moment();
      const today = timeNow.clone().startOf('day');
      const yesterday = timeNow.clone().subtract(1, 'days').startOf('day');
      const aWeekOld = timeNow.clone().subtract(7, 'days').startOf('day');
      const aYearOld = timeNow.clone().subtract(1, 'year').startOf('day');

      if (moment(value).isSame(today, 'd')){
        return  moment.utc(value).local().format('hh:mm a');
      } else if (moment(value).isSame(yesterday, 'd')){
        return  `Yesterday ${moment.utc(value).local().format('hh:mm a')}`;
      }else if (moment(value).isAfter(aWeekOld)){
        const inWeekdate =  moment(value, 'YYYY-MM-DD hh:mm a');
        return  inWeekdate.format('ddd hh:mm a');
      }else if (moment(value).isAfter(aYearOld)){
        return moment.utc(value).local().format('DD MMM hh:mm a');
      }else{
        return moment.utc(value).local().format('DD MMM YYYY hh:mm a');
      }
    }

    return  moment.utc(value).local().format(args);
  }

}
