import { Mention } from './../core/models/mentions/locobuzz/Mention';
// multi-select for multiple selection

export const filterData = {
    brandDateDuration: {
        displayName: 'Brand, Date duration',
        // API
        selectBrand: {
            displayName: 'Select Brand',
            type: 'brand',
            options: [],
            default: null
        },
        Duration: {
            displayName: 'Duration',
            type: 'Duration',
            options: [{ id: 0, label: 'Today'}, {id: 2, label: 'Last Two Days'}, {id: 7, label: 'Last Seven Days'},
            {id: 14, label: 'Last Fourteen Days'}, {id: 30, label: 'Last thirty Days'}, {id: -1, label: 'Custom'}],
            default: 2
        }
    },
    ticketsMentions: {
        displayName: 'Tickets and Mentions',

        whatToMonitor: {
            displayName: 'What you want to monitor?',
            type: 'radio',
            options: [{id: 0, label: 'Tickets'}, {id: 1, label: 'All Mentions'}],
            default: 0
            // options: [{id: 0, label: 'My Tickets'}, {id: 1, label: 'Shared With Me'}, {id: 1, label: 'Self Queue'},
            // {id: 1, label: 'Manual Queue'}, {id: 1, label: 'All Tickets'}]
        },
        Mentions: {
            displayName: 'Mentions',
            type: 'checkbox',
            options: [{id: 2, label: 'User Activity'}, {id: 1, label: 'Brand Activity'}],
            default: false
        },
        userActivity: {
            displayName: 'User Activity',
            type: 'checkbox',
            options: [{id: 1, label: 'Actionable'}, {id: 0, label: 'Non Actionable'}],
            default: null
        },
        brandActivity: {
            displayName: 'Brand Activity',
            type: 'checkbox',
            options: [{id: 1, label: 'Brand Replies'}, {id: 0, label: 'Brand Post'}],
            default: 0
        },
        ticketsYouWantToSee: {
            displayName: 'Which tickets you want to see?',
            type: 'select',
            options: [{id: 0, label: 'My Tickets'}, {id: 1, label: 'All Tickets'}],
            default: 1
        },
        myTickets: {
            displayName: 'My tickets',
            type: 'select',
            options: [{id: 4, label: 'Open Tickets'},{id: 0, label: 'All Tickets'}, {id: 0, label: 'Assigned to Me'}, {id: 10, label: 'Reply received for Approval'},
                {id: 0, label: 'Rejected Replies'}, {id: 7, label: 'On Hold Tickets'}, {id: 0, label: 'Approved by CSD'},
                {id: 0, label: 'Rejected by CSD'}, {id: 0, label: 'Approved by Brand'}, {id: 0, label: 'Rejected by Brand'},
                {id: 8, label: 'Awaiting Response from Customer'}, {id: 2, label: 'Closed'}, {id: 0, label: 'Escalated to CSD'},
                {id: 0, label: 'Escalated to Brand'}, {id: 1, label: 'Awaiting Response Tickets'},
                {id: 8, label: 'Awaiting From Customer'}, {id: 6 , label: 'Unassigned Tickets'}, {id: 7, label: 'On Hold Tickets'},
                {id: 9 , label: 'Not Closed'},
                {id: 5 , label: 'Pending'},
                {id: 10 , label: 'Awaiting TL Approval'}, {id: 12 , label: 'SSRE'}, ],
            default: 4
        },
        TAT: {
            displayName: 'TAT',
            type: 'select',
            options: [{id: 'All', label: 'All'}, {id: 2, label: 'TAT Already Breached'}, {id: 1, label: 'TAT About To Breached'}],
            default: 'All'
        },
        autocloserEnable: {
            displayName: 'Autocloser enable',
            type: 'select',
            options: [{id: 'All', label: 'Any'}, {id: true, label: 'Yes'}, {id: false, label: 'No'}],
            default: 'All'
        },
        subscribeTicket: {
            displayName: 'Subscribe ticket',
            type: 'select',
            options: [{id: 'All', label: 'All'}, {id: true, label: 'Yes'}, {id: false, label: 'No'}],
            default: 'All'
        },
        // ticketStatus: {
        //     displayName: 'Ticket Status',
        //     type: 'multi-select',
        //     options: [{id: 1, label: 'All Tickets'}, {id: 2, label: 'Assigned to Me'}, {id: 3, label: 'Reply received for Approval'},
        //     {id: 4, label: 'Rejected Replies'}, {id: 5, label: 'On Hold Tickets'}, {id: 6, label: 'Approved by CSD'},
        //     {id: 7, label: 'Rejected by CSD'}, {id: 8, label: 'Approved by Brand'}, {id: 9, label: 'Rejected by Brand'},
        //     {id: 10, label: 'Awaiting Response from Customer'}, {id: 11, label: 'Closed'}, {id: 12, label: 'Escalated to CSD'},
        //     {id: 13, label: 'Escalated to Brand'}]
        // },
        // TATBranchTime: {
        //     displayName: 'TAT Branch Time',
        //     type: 'select',
        //     options: [{id: 1, label: '5 minutes'}, {id: 1, label: '10 minutes'},
        //         {id: 1, label: '15 minutes'}, {id: 1, label: '20 minutes'}],
        // },
        Priority: {
            displayName: 'Priority',
            type: 'multi-select',
            options: [{id: 0, label: 'Low'}, {id: 1, label: 'Medium'}, {id: 2, label: 'High'}, {id: 3, label: 'Urgent'}],
            default: []
        },

        mediaType: {
            displayName: 'Media Type',
            type: 'multi-select',
            options: [{id: 2, label: 'Image Post'}, {id: 3, label: 'Video Post'}, {id: 1, label: 'Text'}, {id: 4, label: 'Links'}],
            default: []
        },
        // API
        upperCategory: {
            displayName: 'Upper Category',
            type: 'multi-select',
            options: [],
            default: []
        },
        // API
        Category: {
            displayName: 'Category',
            type: 'tree-checklist',
            options: {},
            default: []
        },
        // API
        Channel: {
            displayName: 'Channel',
            type: 'tree-checklist',
            options: {},
            default: []
        },
        // API
        socialProfile: {
            displayName: 'Social Profile',
            type: 'multi-select',
            options: [],
            default: ['All']
        },
        // postType: {
        //     displayName: 'Post Type',
        //     type: 'select',
        //     options: [{id: 'All', label: 'Any'}, {id: 1, label: 'Brand Activity'}, {id: 2, label: 'User Actitvity'}],
        //     default: 'All'
        // },
        Sentiments: {
            displayName: 'Sentiments',
            type: 'multi-select',
            options: [{id: 1, label: ' Positive'}, {id: 2, label: ' Negative'},
            {id: 0, label: ' Neutral'}, {id: 4, label: ' Multiple'}],
            default: []
        },
        // scheduleTicket: {
        //     displayName: 'Schedule ticket',
        //     type: 'select',
        //     options: [{id: 'All', label: 'All'}, {id: true, label: 'Yes'}, {id: false, label: 'No'}],
        // },
        deleteFromSocial: {
            displayName: 'Delete from social',
            type: 'select',
            options: [{id: 'All', label: 'All'}, {id: true, label: 'Yes'}, {id: false, label: 'No'}],
            default: 'All'
        }
    },
    teamcharacteristics: {
        displayName: 'Team characteristics',

        // Role: {
        //     displayName: 'Role',
        //     type: 'select',
        //     options: [{id: 1, label: 'Newbie'}, {id: 2, label: 'Agent'}, {id: 3, label: 'Super Agent'},
        //     {id: 4, label: 'Team Leader'}, {id: 5, label: 'Supervisor'}, {id: 6, label: 'CSD'}, {id: 7, label: 'Brand'}]
        // },
        // API
        assigendTo: {
            displayName: 'Assigned to',
            type: 'multi-select',
            options: [],
            default: []
        }
    },
    usercharacteristics: {
        displayName: 'User characteristics',
        authorName: {
            displayName: 'Author Name',
            type: 'auto-complete',
            option : [],
            URL: '/Tickets/GetAuthorNameList',
            default: ''
        },
        followersCount: {
            displayName: 'Followers Count',
            type: 'slidder',
            options: [0, 1000000],
            default: 'All'

        },
        influencerCategory: {
            displayName: 'Influencer Category',
            type: 'select',
            options: [{id: 'All', label: 'Any'},{id: 1, label: 'Clebrity'}, {id: 2, label: 'Politician'}, {id: 3, label: 'Police'},
                {id: 4, label: 'Doctor'}, {id: 5, label: 'Author'}, {id: 6, label: 'Business man'}],
            default: 'All'
        },
        VerifirdNonverified: {
            displayName: 'Verified /Non verified',
            type: 'select',
            options: [{id: 'All', label: 'All'}, {id: true, label: 'Yes'}, {id: false, label: 'No'}],
            default: 'All'
        },
        // influencerScore: {
        //     displayName: 'Influencer Score',
        //     type: 'slidder',
        //     options: [0, 10],
        //     default: 'All'
        // },
        SentimentUpliftScore: {
            displayName: 'Sentiment Uplift Score',
            type: 'slidder',
            options: [0, 100],
            default: null
        },
        // API
        userWith: {
            displayName: 'User With',
            type: 'select',
            options: [{id: 'Any', label: 'Any'}],
            default: 'Any'
        },
        NPSRating: {
            displayName: 'NPS Rating',
            type: 'slidder',
            options: [0, 10],
            default: 'All'
        },
    },
    Others: {
        displayName: 'Others',
        // API
        Campaign: {
            displayName : 'Campaign',
            type: 'multi-select',
            options: [],
            default: []
        },
        // API
        SsreStatuses: {
            displayName : 'SSRE Statuses',
            type: 'multi-select',
            options: [],
            default: []
        },
        refreshTime: {
            displayName: 'Refresh Time',
            type: 'select',
            options: [{id: 'Ask For Render', label: 'Ask For Render'}, {id: 'Auto Render In', label: 'Auto Render In'}, {id: 30000, label: '30 sec'},
            {id: 60000, label: '1 min'}, {id: 300000, label: '5 min'}],
            default: 'All'
        },
        FeedbackType: {
            displayName: 'Feedback Type',
            type: 'select',
            options: [{id: 'All', label: 'All'}, {id: 0, label: 'Feedback'}, {id: 1, label: 'NSP'}],
            default: 'All'
        },
        ReplyStatus: {
            displayName: 'Reply Status',
            type: 'select',
            options: [{id: 'All', label: 'All'}, {id: true, label: 'Replied'}, {id: false, label: 'Not Replied'}],
            default: 'All'
        },
        // API
        Language: {
            displayName: 'Language',
            type: 'multi-select',
            options: [],
            default: []
        },
        // API
        Countries: {
            displayName: 'Countries',
            type: 'multi-select',
            options: [],
            default: []
        },
        // API
        actionStatuses: {
            displayName: 'Action Statuses',
            type: 'multi-select',
            options: [],
            default: []
        },
        feedbackRequested: {
            displayName: 'Feedback Requested',
            type: 'select',
            options: [{id: 'All', label: 'All'}, {id: true, label: 'Yes'}, {id: false, label: 'No'}],
            default: 'All'
        },
        FeedbackRating: {
            displayName: 'Feedback Rating',
            type: 'rating',
            options: [{id: 1, label: '1'}, {id: 2, label: '2'}, {id: 3, label: '3'}, {id: 4, label: '4'}, {id: 5, label: '5'}],
            default: []
        },
    },
    Keywords: {
        displayName: 'Keywords',
        AND: {
            displayName: 'AND',
            type: 'chips-radio',
            options: []
        },
        Or: {
            displayName: 'Or',
            type: 'chips',
            options: []
        },
        Donot: {
            displayName: 'Donot',
            type: 'chips1',
            options: []
        }
    },
    excludeFilters: {
        displayName: 'Exclude Filters',
        searchFilter: {
            displayName: 'Search filter',
            type: 'search',
            options: []
        }
    }
};

export const notToShowInExclude: string[] =
    ['whatToMonitor', 'brandActivity', 'userActivity', 'Mentions', 'ticketsYouWantToSee', 'refreshTime'];
export const notToPass = ['upperCategorycondition', 'Categorycondition', 'refreshTime', 'searchFilter'];

export const ticketMentionDropdown =
    {
        sortBy: {
            createdDate: {
                ticket: 'DateCreated',
                mention: 'MentionDateCreated'
            },
            lastUpdated: {
                ticket: 'LastUpdated',
                mention: 'MentionLastUpdated'
            },
            authorName: {
                ticket: 'Author',
                mention: 'MentionEngagement'
            },
            default: 'createdDate'
        },
        sortOrder: {
            value: ['asc', 'desc'],
            default: '1'
        }
    };
