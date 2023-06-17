import { RecoursesServerConfig, STSServerConfig } from './servers.config';
import { CRUD_ACTIONS, CRUD_CONFIRMING_MESSAGES, CRUD_ERRORS_MESSAGES, CRUD_PAGINATION_DEFAULTS, CRUD_SORT_TYPES, CRUD_SUCCESSFUL_MESSAGES, CRUD_TYPES_CODES } from './crud.config';

class AppConfig {

    public readonly APP_NAME = 'SSA';

    // CRUD ACTIONS CONFIG
    public CRUD_CONFIG = {
        actions: CRUD_ACTIONS,
        successMessages: CRUD_SUCCESSFUL_MESSAGES,
        confirmationMessages: CRUD_CONFIRMING_MESSAGES,
        paginationDefaults: CRUD_PAGINATION_DEFAULTS,
        sort: CRUD_SORT_TYPES,
        errorsTypes: CRUD_TYPES_CODES,
        errorsMessages: CRUD_ERRORS_MESSAGES
    }

    // Communicated servers config
    public SERVERS_CONFIG = {
        STS: STSServerConfig,
        resources: RecoursesServerConfig
        
    }


    public ROUTES_CONFIG = {
        root: '/home',
        login: '/guest/login',
        logout: '/guest/logout',
        unauthorized: '/unauthorized',
        forbidden: 'unexpected/forbidden',
    }

    public REQUEST_TYPES_CONFIG = {
        0: 'Raise',
        1: 'Promotion',
        2: 'HR Letter',
        3: 'Change Management',
        4: 'Voucher',
        5: 'Referral Bonus',
        6: 'Gouna Voucher',
        7: 'Training',
        8: 'Peer-to-Peer',
        9: 'Offer',
        10: 'Onboarding',
        11: 'Probation',
        12: 'Annual Leave',
        13: 'Maternity Leave',
        14: 'Sick Leave',
        15: 'Military Leave',
        16: 'Emergency Leave',
        17: 'Bereavement Leave',
        18: 'Balance Management',
        19: 'Allocation Request',
        20: 'Unpaid Leave',
        21: 'No Show',
        22: 'Half-day Leave',
        23: 'Resignation',
        25: 'Recruitment',
        26: 'Expense Repayment',
        27: 'PIP'
    }

    public requestTypes = [
        {
            name: 'Raise',
            id: 0,
        },
        {
            name: 'Promotion',
            id: 1,
        },
        {
            name: 'HR Letter',
            id: 2,
        },
        {
            id: 3,
            name: 'Change Management',
        },
        {
            id: 4,
            name: 'Voucher',
        },
        {
            id: 5,
            name: 'Referral Bonus',
        },
        {
            id: 6,
            name: 'Gouna Voucher',
        },
        {
            id: 7,
            name: 'Training',
        },
        {
            id: 8,
            name: 'Peer-to-Peer',
        },
        {
            id: 9,
            name: 'Offer',
        },
        {
            id: 10,
            name: 'Onboarding',
        },
        {
            id: 11,
            name: 'Probation',
        },
        {
            id: 12,
            name: 'Annual Leave',
        },
        {
            id: 13,
            name: 'Maternity Leave',
        },
        {
            id: 14,
            name: 'Sick Leave',
        },
        {
            id: 15,
            name: 'Military Leave',
        },
        {
            id: 16,
            name: 'Emergency Leave',
        },
        {
            id: 17,
            name: 'Bereavement Leave',
        },
        {
            id: 18,
            name: 'Balance Management',
        },
        {
            id: 19,
            name: 'Allocation',
        },
        {
            id: 20,
            name: 'Unpaid Leave',
        },
        {
            id: 21,
            name: 'No Show',
        },
        {
            id: 22,
            name: 'Half-day Leave',
        },
        {
            id: 23,
            name: 'Resignation',
        },
        {
            id: 25,
            name: 'Recruitment',
        },
        {
            id: 26,
            name: 'Expense Repayment',
        },
        {
            id: 27,
            name: 'PIP'
        }
    ];
    constructor() { }
    public GetSortedRequestTypes(): { id: number, name: string }[] {
        return this.requestTypes.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        })
    }
}

export const SSAConfigInst: AppConfig = new AppConfig();


