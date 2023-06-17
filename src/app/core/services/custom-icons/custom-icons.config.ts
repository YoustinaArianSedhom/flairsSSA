/**
 * @summary Here we define the custom icons base path along side the custom icons config
 *
 * @explain the name of the icon will be used alongside the base path, and with the svg extension at the end
 * to format the path automatically on the CustomIcons service
 *
 *
 * @note Incase there's another path for specific icon you should define its own path to override the default path formatter
 *
 *
 * @note Name of the icon that you defined here will be used as value for "svgIcon" on the mat-icon element
 *
 *
 * For reference
 * @see [https://alligator.io/angular/custom-svg-icons-angular-material/]
 */

interface CustomIcon {
  name: string;
  path?: string;
}

export const ICONS_BASE_PATH = "assets/images/";

export const customIcons: CustomIcon[] = [
  {
    name: 'voucher'
  },
  {
    name: 'referral-bonus'
  },
  {
    name: 'HR-letter'
  },
  {
    name: 'change-management'
  },
  {
    name: 'promotion'
  },
  {
    name: 'raise'
  },
  {
    name: 'Training'
  },
  {
    name: 'Gouna'
  },
  {
    name: 'P2P'
  },
  {
    name: 'leaves'
  },
  {
    name: 'plus'
  },
  {
    name: 'file'
  },
  {
    name: 'balance-recovery'
  },
  {
    name: 'allocation'
  },
  {
    name: 'my-tasks'
  },
  {
    name: 'all-requests'
  },
  {
    name: 'home'
  },
  {
    name: 'my-requests'
  },
  {
    name: 'users-managment'
  },
  {
    name: 'all-leave'
  },
  {
    name: 'my-team-leave'
  },
  {
    name: 'in-progress'
  },
  {
    name: 'applied'
  },
  {
    name: 'reviewed'
  },
  {
    name: 'confirmed'
  },
  {
    name: 'accepted'
  },
  {
    name: 'approved'
  },
  {
    name: 'rejected'
  },
  {
    name: 'archieved'
  },
  {
    name: 'deleted'
  },
  {
    name: 'Expired'
  },
  {
    name: 'Failed'
  },
  {
    name: 'closed'
  },
  {
    name: 'Dismiss'
  },
  {
    name: 'Failed'
  },
  {
    name: 'resignation'
  },
  {
    name: 'completed'
  },
  {
    name: 'done'
  },
  {
    name: 'termination'
  },
  {
    name: 'team-request'
  },
  {
    name: 'recruitment'
  },
  {
    name: 'flairs-accounts',
  },
  {
    name: 'expenses-repayment',
  },
  {
    name: 'file-download',
  },
  {
    name: 'no_response'
  },
  {
    name: 'expense_history'
  },
  {
    name:'add_comment'
  },
  {
    name: 'start-pip'
  },
  {
    name: 'lock'
  },
  {
    name: 'unlock'
  },
  {
    name: 'open-dribble'
  },
  {
    name: 'close-dribble'
  },
  {
    name: 'Icon-open-grid-two-up'
  },
  {
    name: 'Icon-awesome-toggle-on'
  },
  {
    name: 'Icon-awesome-toggle-off'
  },
  {
    name: 'support'
  },
  {
    name: 'revert'
  },

];
