import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '../../../../core/services/user.service';
import { mockUsers } from '../../../../core/testing/mocks/data/users.mock';
import { of } from 'rxjs';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser']);
    spy.getUsers.and.returnValue(of({ data: mockUsers }));
    spy.deleteUser.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [
        UsersListComponent,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should display users in table', () => {
    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('tr.mat-mdc-row');
    expect(rows.length).toBe(mockUsers.length);
  });

  it('should delete user when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteUser('1');
    expect(userService.deleteUser).toHaveBeenCalledWith('1');
  });

  it('should not delete user when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteUser('1');
    expect(userService.deleteUser).not.toHaveBeenCalled();
  });
}); 