import { TestBed } from '@angular/core/testing';

import { MyTeamsTasksGuard } from './my-teams-tasks.guard';

describe('MyTeamsTasksGuard', () => {
  let guard: MyTeamsTasksGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MyTeamsTasksGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
