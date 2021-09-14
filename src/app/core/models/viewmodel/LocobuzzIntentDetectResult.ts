import { IntentHistory } from './IntentHistory';

export interface LocobuzzIntentDetectedResult {
    category_id?: number;
    category_name?: string;
    recommended_response?: string;
    responses?: string[];
    score?: number;
}

export interface LocoAPIRootObject {
    input?: string[];
    operation?: Operation;
    results?: LocobuzzIntentDetectedResult[];
    status?: string;
}

export interface Operation {
    model?: string[];
    time_ms?: number;
}

export interface LocoDetectRequest {
    recommender_id?: string;
    cutoff?: number;
    history?: IntentHistory[];
    text?: string[];
    source?: number;
}

export interface AllCategoriesObject {
    id?: number;
    name?: string;
}

export interface AllResponseObject {
    id?: number;
    name?: string;
    responses?: string[];
}
