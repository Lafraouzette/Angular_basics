import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarreComponent } from './nav-barre.component';

describe('NavBarreComponent', () => {
  let component: NavBarreComponent;
  let fixture: ComponentFixture<NavBarreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
