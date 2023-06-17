import { animate, state, style, transition, trigger } from "@angular/animations";

export default  [trigger('isVisibilityChanged', [
    state('void', style({
      right: '-100%'
    })),
    state('closed', style({
      right: '-50%'
    })),
    state('opened', style({
      right: '2.5rem'
    })),
    transition(':enter', [
      animate('1s ease-in-out', style({ right: '2.5rem' }))
    ]),
    transition(':leave', [
      animate('1s ease-in-out', style({ right: '-50%' }))
    ])
  ])]