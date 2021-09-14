export class Rule {
    id?: string;
    field?: string;
    type?: string;
    operator?: string;
    value?: any;
    input?: string;
    condition?: string;
    rules?: Rule[];
}
