import { SystemRoles } from '@core/modules/authorization/model/authorization.config';
import { MenuItemModel } from './model/layout.interface';


const userLinks: MenuItemModel[] = [
  {
    label: "Home",
    link: "home",
    materialIcon: {
      isSvg: true,
      name: 'home'
    },
    roles: [
      SystemRoles.Master,
    ]
  },
  {
    label: 'My Tasks',
    link: 'my-tasks',
    materialIcon: {
      isSvg: true,
      name: 'my-tasks'
    },
    roles: [
      SystemRoles.Master
    ]
  },
  {
    label: 'Users Management',
    link: "users-management",
    materialIcon: {
      isSvg: true,
      name: 'users-managment'
    },
    roles: [SystemRoles.PermissionManagement]
  },

  {
    label: 'My Requests',
    link: 'my-requests',
    materialIcon: {
      isSvg: true,
      name: 'my-requests'
    },
    roles: [
      SystemRoles.Master
    ]
  }, {
    label: 'All Requests',
    link: 'requests',
    materialIcon: {
      isSvg: true,
      name: 'all-requests'
    },
    roles: [
      SystemRoles.workflowManagement
    ]
  },
  {
    label: 'All Leaves',
    link: 'all-leave',
    materialIcon: {
      isSvg: true,
      name: 'all-leave'
    },
    roles: [
      SystemRoles.workflowManagement, SystemRoles.leaveManagement
    ]
  },
  {
    label: `My Team's Leaves`,
    link: 'my-team-leave',
    materialIcon: {
      isSvg: true,
      name: 'my-team-leave'
    },
    roles: [
      SystemRoles.viewTeamLeaves
    ]
  },
  {
    label: `My Team's Requests`,
    link: 'my-team-requests',
    materialIcon: {
      isSvg: true,
      name: 'team-request'
    },
    roles: [
      SystemRoles.viewTeamRequests
    ]
  },
  {
    label: `My Team's Tasks`,
    link: 'my-teams-tasks',
    materialIcon: {
      isSvg: true,
      name: 'team-request'
    },
    roles: [
      SystemRoles.viewTeamTasks
    ]
  },
  {
    label: 'Expense History',
    link: 'expense-history',
    materialIcon: {
      isSvg: true,
      name: 'expense_history'
    },
    roles:[ SystemRoles.viewExpenseRequests ]
  }
  // {
  //   label: 'Requests',
  //   roles: [SystemRoles.Master],
  //   children: [
  //     {
  //       label: 'My Requests',
  //       link: 'requests/own-requests',
  //       roles: [
  //         SystemRoles.Master
  //       ]
  //     }, {
  //       label: 'All Requests',
  //       link: 'requests',
  //       roles: [
  //         SystemRoles.workflowManagement
  //       ]
  //     },
  //   ]
  // },



  // {
  //   label: 'Payslip',
  //   roles: [
  //     SystemRoles.CEO,
  //     SystemRoles.ITSupport,
  //     SystemRoles.Employee,
  //     SystemRoles.Finance,
  //     SystemRoles.Manager,
  //     SystemRoles.PayrollManager,
  //     SystemRoles.HRManager,
  //   ],
  //   children: [
  //     {
  //       label: 'My Payslip',
  //       link: '/payslips/my-payslip',
  //       roles: [
  //         SystemRoles.CEO,
  //         SystemRoles.ITSupport,
  //         SystemRoles.Employee,
  //         SystemRoles.Finance,
  //         SystemRoles.Manager,
  //         SystemRoles.PayrollManager,
  //         SystemRoles.HRManager,

  //       ],
  //     }, {
  //       label: 'My Team Payslips',
  //       link: '/payslips/team-payslips',
  //       roles: [SystemRoles.PayrollManager]
  //     }
  //   ]
  // },
];


/**
 * 
 * @param roles 
 * @returns {MenuItemModel[]} - Array of sidenav links
 */
export function getLinksBasedOnRole(roles: string[]): MenuItemModel[] {
  let assignedLinks = [];
  assignedLinks = userLinks.filter((link: MenuItemModel) => {
    if (link.roles && roles.length) {
      const canLoad: boolean = link.roles.some((val) => roles.indexOf(val) !== -1);
      if (canLoad && link.children) link.children = link.children.filter((child: MenuItemModel) => {
        if (child.roles && roles.length) {
          const canLoadChild = child.roles.some((val) => roles.indexOf(val) !== -1);
          if (canLoadChild) return child;
        }
      })
      if (canLoad) return link;
    }
  })
  return assignedLinks
}


// Recursive but not now
// export function getLinksBasedOnRole(roles: string[], assignedLinks = [], children: boolean = false): MenuItemModel[] {
//   userLinks.forEach((link: MenuItemModel) => {
//     if (link.roles && roles.length) {
//       const canLoad: boolean = link.roles.some((val) => roles.indexOf(val) !== -1);
//       if (canLoad && !children) {
//         assignedLinks.push(link);
//         if (link.children) {
//           getLinksBasedOnRole(roles, assignedLinks.find(assignedLink => assignedLink.label = link.label), true)
//         }
//       }
//       else if (canLoad && children) assignedLinks.push(link)
//     }

//   })

//   return assignedLinks;
// }

