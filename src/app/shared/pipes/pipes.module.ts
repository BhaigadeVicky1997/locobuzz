import { NgModule } from '@angular/core';

import { KeysPipe } from './keys.pipe';
import { GetByIdPipe } from './getById.pipe';
import { HtmlToPlaintextPipe } from './htmlToPlaintext.pipe';
import { FilterPipe } from './filter.pipe';
import { CamelCaseToDashPipe } from './camelCaseToDash.pipe';
import { TrimPipe } from './trim.pipe';
import { DatetimeFormatterPipe } from './datetime-formatter.pipe';
import { SafehtmlPipe } from './safehtml.pipe';


@NgModule({
    declarations: [
        KeysPipe,
        GetByIdPipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe,
        TrimPipe,
        DatetimeFormatterPipe,
        SafehtmlPipe
    ],
    imports     : [],
    exports     : [
        KeysPipe,
        GetByIdPipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe,
        TrimPipe,
        DatetimeFormatterPipe,
        SafehtmlPipe
    ]
})
export class LocobuzzPipesModule
{
}
