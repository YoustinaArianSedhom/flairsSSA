import { SystemRoles } from "@core/modules/authorization/model/authorization.config";
import { PermissionModel } from "@core/modules/authorization/model/authorization.model";

export const REQUESTS_MODULE_PERMISSIONS: PermissionModel[] = [
    {
        name: 'CREATE_RAISE',
        roles: [SystemRoles.CreateRaise]
    }, {
        name: 'CREATE_PROMOTION',
        roles: [SystemRoles.CreatePromotion]
    },
    {
        name: 'CREATE_CHANGE_MANGER',
        roles: [SystemRoles.createChangeManager]
    },
    {
        name: 'CREATE_VOUCHER',
        roles: [SystemRoles.createVoucherRequest]
    },
    {
        name: 'CREATE_TERMINATION',
        roles: [SystemRoles.createTermination]
    },
    {
        name: 'CREATE_REFERRAL',
        roles: [SystemRoles.createReferralRequest]
    },
    {
        name: 'CREATE_GOUNA_VOUCHER',
        roles: [SystemRoles.createGounaVoucher]
    },
    {
        name: 'CREATE_HR_LETTER',
        roles: [SystemRoles.createHRLetterRequest]
    },
    {
        name: 'CREATE_TRAINING',
        roles: [SystemRoles.createTrainingRequest]
    },
    {
        name: 'VIEW_MANAGERS_REQUESTS',
        roles: [
            SystemRoles.CreateRaise,
            SystemRoles.CreatePromotion,
            SystemRoles.createChangeManager,
            SystemRoles.createVoucherRequest,
            SystemRoles.createGounaVoucher,
            SystemRoles.createRecruitment,
            SystemRoles.createExpenseRepayment,
            SystemRoles.createPIP
        ]
    },
    {
        name: 'CREATE_PEER_TO_PEER',
        roles: [SystemRoles.createPeerToPeer]
    },
    {
        name: 'CREATE_Leave',
        roles: [SystemRoles.createLeave]
    },
    {
        name: 'BALANCE_MANAGEMENT',
        roles: [SystemRoles.balanceManagement]
    },
    {
        name: 'CREATE_ALLOCATION',
        roles: [SystemRoles.createAllocation]
    },
    {
        name: 'CREATE_RESIGNATION',
        roles: [SystemRoles.createResignation]
    },
    {
        name: 'CREATE_RECRUITMENT',
        roles: [SystemRoles.createRecruitment]
    },
    {
        name: 'EXPENSE_REPAYMENT',
        roles: [SystemRoles.createExpenseRepayment]
    },
    {
        name: 'VIEW_EXPENSE_REQUESTS',
        roles: [SystemRoles.viewExpenseRequests]
    },
    {
        name: 'CREATE_PIP',
        roles: [SystemRoles.createPIP]
    }

]
