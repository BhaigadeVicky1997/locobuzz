export interface YoutubeRequest {
    requestBodyType?: string;
    requestBody?: any;
}

export interface InnerSnippet {
    textOriginal?: string;
}

export interface TopLevelComment {
    snippet?: InnerSnippet;
}

export interface Snippet {
    channelId?: string;
    videoId?: string;
    topLevelComment?: TopLevelComment;
}

export interface YoutubePostComment {
    snippet?: Snippet;
}

export interface YoutubeReplyComment {
    snippet?: ReplyCommentSnippet;
}

export interface ReplyCommentSnippet {
    parentId?: string;
    textOriginal?: string;
}