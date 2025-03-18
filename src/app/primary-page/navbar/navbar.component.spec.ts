import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore, DocumentData } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideRouter(routes)
      ],
      imports: [NavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add admin link for admin', () => {
    const local = component['localStorage'];
    const mockUserData = { email: 'some@gmail.com', role: 'admin' }
    local.setItem('user', JSON.stringify(mockUserData));
    local.getItem = jest.fn().mockReturnValue(JSON.stringify(mockUserData))
    component.ngOnInit();
    expect(local.getItem).toHaveBeenCalledWith('user');
    expect(component.navlinks()[0]).toEqual({ path: 'home', link: 'Home' })
    expect(component.navlinks()[1]).toEqual({ path: 'events', link: 'Events' })
    expect(component.navlinks()[2]).toEqual({ path: 'admin', link: 'Admin' })
    fixture.detectChanges();
    const navLinkElements = fixture.debugElement.queryAll(By.css('li a'));
    expect(navLinkElements.length).toBe(3);
    expect(navLinkElements[0].nativeElement.textContent.trim()).toBe('Home');
    expect(navLinkElements[1].nativeElement.textContent.trim()).toBe('Events');
    expect(navLinkElements[2].nativeElement.textContent.trim()).toBe('Admin');
    
    expect(navLinkElements[0].attributes['ng-reflect-router-link']).toBe('home');
    expect(navLinkElements[1].attributes['ng-reflect-router-link']).toBe('events');
    expect(navLinkElements[2].attributes['ng-reflect-router-link']).toBe('admin');
    local.clear()
  })

  it('should not show admin link to regular user', () => {
    const local = component['localStorage'];
    const mockUserData = {role: 'user' }
    local.setItem('user', JSON.stringify(mockUserData));
    local.getItem = jest.fn().mockReturnValue(JSON.stringify(mockUserData))
    component.ngOnInit();
    expect(local.getItem).toHaveBeenCalledWith('user');
    expect(component.navlinks()[0]).toEqual({ path: 'home', link: 'Home' })
    expect(component.navlinks()[1]).toEqual({ path: 'events', link: 'Events' })
    fixture.detectChanges();
    const navLinkElements = fixture.debugElement.queryAll(By.css('li a'));
    expect(navLinkElements.length).toBe(2);
    expect(navLinkElements[0].nativeElement.textContent.trim()).toBe('Home');
    expect(navLinkElements[1].nativeElement.textContent.trim()).toBe('Events');
    
    expect(navLinkElements[0].attributes['ng-reflect-router-link']).toBe('home');
    expect(navLinkElements[1].attributes['ng-reflect-router-link']).toBe('events');
    local.clear()
  })

  it('should sign out user', () => {
    const fire = component['fireStore'].loggedUser!['set'] = jest.fn()
    const route = component['route'].navigateByUrl = jest.fn()
    const local = component['localStorage'].removeItem = jest.fn()
    const login = component['loginService'].singOut = jest.fn()
    component.signOut();
    expect(fire).toHaveBeenCalledWith(null)
    expect(local).toHaveBeenCalledWith('user')
    expect(login).toHaveBeenCalled()
    expect(route).toHaveBeenCalledWith('/login')
  })
});
