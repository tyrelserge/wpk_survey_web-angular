import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyResourceComponent } from './survey-resource.component';

describe('SurveyResourceComponent', () => {
  let component: SurveyResourceComponent;
  let fixture: ComponentFixture<SurveyResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyResourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
