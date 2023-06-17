import { trigger, transition, query, style, stagger, animate, state } from "@angular/animations";

export default [
    // trigger("animatedInfoCards", [
    //   transition(':enter', [
    //     query('section', [
    //       style({
    //         transform: 'translateX(-100%)'
    //       }),
    //       stagger('100ms',
    //         animate('.5s ease-in-out',
    //           style({ transform: 'translateX(0)' })
    //         )
    //       )
    //     ]),
    //   ]),
    //   transition(":leave", [
    //     query('section', [
    //       stagger('300ms',
    //         animate(".5s ease-in-out",
    //           style({ transform: ' translateX(-150%)' })
    //         )
    //       )
    //     ])
    //   ])
    // ]),
    trigger('animatedInfoCard', [
      state('void', style(
        {
          transform: 'translateX(-100%)'
        }
      )),
      transition(':enter', animate('0.5s ease-in-out',
        style({
          transform: 'translateX(0)'
        })
      )),
      transition(':leave', animate('0.5s ease-in-out',
        style({
          transform: 'translateX(-150%)'
        })
      )),

    ])
  ]
