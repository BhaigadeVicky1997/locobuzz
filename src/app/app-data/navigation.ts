import { LocobuzzNavigation } from 'app/core/interfaces/locobuzz-navigation';

export const navigation: LocobuzzNavigation[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        url: '/dashboard',
        // defaultTabs: [{id: '1', title: 'dashboard', icon: 'dashboard', url: '/dashboard'}]
    },
    {
        id: 'Analytics',
        title: 'Analytics',
        icon: 'poll',
        url: '/analytics',
        // defaultTabs: [{id: '1', title: 'Analytics', icon: 'Analytics', url: '/Analytics'}]
    },
    {
        id: 'social-inbox',
        title: 'Social Inbox',
        icon: 'inbox',
        url: '/social-inbox',
        // defaultTabs: [{id: '1', title: 'tickets', icon: 'tickets', url: '/tickets'},
        //              {id: '2', title: 'All Mentions', icon: 'all-mentions', url: '/all-mentions'} ]
    },
    {
        id: 'email-marketing',
        title: 'Email Marketing',
        icon: 'email',
        url: '/email-marketing',
        // defaultTabs: [{id: '1', title: 'email-marketing', icon: 'email-marketing', url: '/email-marketing'}]
    },
    {
        id: 'calendar',
        title: 'Calender',
        icon: 'calendar_today',
        url: '/calendar',
        // defaultTabs: [{id: '1', title: 'calendar', icon: 'calendar', url: '/calendar'}]
    },
    {
        id: 'pr-dashboard',
        title: 'PR Dashboard',
        icon: 'poll',
        url: '/pr-dashboard',
        // defaultTabs: [{id: '1', title: 'pr-dashboard', icon: 'pr-dashboard', url: '/pr-dashboard'}]
    }
];
