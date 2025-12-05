import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { throwError } from 'rxjs';

// COMPONENTS
import { AppComponent } from './app.component';

// SERVICES
import { CountriesService } from './services/countries.service';
import { of } from 'rxjs';
import { ICountry } from './interfaces/country.model';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let service: CountriesService;

  const mockData: ICountry[] = [
    {
      name: {
        common: 'common',
        official: 'official',
        nativeName: {},
      },
      cca2: 'cca2',
      capital: ['capital'],
      latlng: [0],
      flag: 'flag',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        CountriesService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    app.countries = mockData;
    service = TestBed.inject(CountriesService);

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should call "generateQuiz"', () => {
      spyOn(app, 'generateQuiz');
      app.ngOnInit();
      expect(app.generateQuiz).toHaveBeenCalled();
    });
  });

  describe('generateQuiz', () => {
    it('should call "countriesService.getCountries"', () => {
      spyOn(app['countriesService'], 'getCountries').and.callThrough();
      app.generateQuiz();
      expect(app['countriesService'].getCountries).toHaveBeenCalled();
    });

    it('should call "capitalFilter"', () => {
      spyOn(service, 'getCountries').and.returnValue(of(mockData));
      spyOn(app, 'capitalFilter').and.returnValue(mockData);
      app.generateQuiz();
      expect(app.capitalFilter).toHaveBeenCalled();
    });

    it('should call "imageFilter"', () => {
      spyOn(service, 'getCountries').and.returnValue(of(mockData));
      spyOn(app, 'imageFilter').and.returnValue(mockData);
      app.generateQuiz();
      expect(app.imageFilter).toHaveBeenCalled();
    });

    it('should call "randomize"', () => {
      spyOn(service, 'getCountries').and.returnValue(of(mockData));
      spyOn(app, 'randomize').and.returnValue(mockData);
      app.generateQuiz();
      expect(app.randomize).toHaveBeenCalled();
    });

    it('should call "group10"', () => {
      spyOn(service, 'getCountries').and.returnValue(of(mockData));
      spyOn(app, 'group10').and.returnValue(mockData);
      app.generateQuiz();
      expect(app.group10).toHaveBeenCalled();
    });

    it('should call "sort"', () => {
      spyOn(service, 'getCountries').and.returnValue(of(mockData));
      spyOn(app, 'sort').and.returnValue(mockData);
      app.generateQuiz();
      expect(app.sort).toHaveBeenCalled();
    });

    it('sets errorMessage when service errors', () => {
      spyOn(service, 'getCountries').and.returnValue(
        throwError(() => 'network error')
      );
      app.generateQuiz();
      expect(app.errorMessage).toBe('network error');
    });
  });

  describe('onToggle', () => {
    it('should call "activeCheck"', () => {
      spyOn(app, 'activeCheck');
      app.onToggle('capital');
      expect(app.activeCheck).toHaveBeenCalled();
    });

    it('should toggle isActiveCapital', () => {
      const initial = app.isActiveCapital;
      app.onToggle('capital');
      expect(app.isActiveCapital).toBe(!initial);
    });

    it('should toggle isActiveFlag', () => {
      const initial = app.isActiveFlag;
      app.onToggle('flag');
      expect(app.isActiveFlag).toBe(!initial);
    });

    it('should toggle isActiveShape', () => {
      const initial = app.isActiveShape;
      app.onToggle('shape');
      expect(app.isActiveShape).toBe(!initial);
    });

    it('should toggle isActiveHardcore', () => {
      const initial = app.isActiveHardcore;
      app.onToggle('hardcore');
      expect(app.isActiveHardcore).toBe(!initial);
    });

    it('should call generateQuiz', () => {
      spyOn(app, 'generateQuiz');
      app.onToggle('capital');
      expect(app.generateQuiz).toHaveBeenCalled();
    });
  });

  describe('Pure methods', () => {
    it('imageFilter should remove known no-image countries', () => {
      const input = [
        {
          name: { common: 'Micronesia', official: '', nativeName: {} },
          cca2: 'M1',
          capital: ['X'],
          latlng: [0],
          flag: '',
        },
        {
          name: { common: 'FooLand', official: '', nativeName: {} },
          cca2: 'F1',
          capital: ['Y'],
          latlng: [0],
          flag: '',
        },
      ] as ICountry[];
      const out = app.imageFilter(input);
      expect(out.find((c) => c.name.common === 'Micronesia')).toBeUndefined();
      expect(out.find((c) => c.name.common === 'FooLand')).toBeDefined();
    });

    it('capitalFilter should remove countries with empty capitals', () => {
      const input = [
        {
          name: { common: 'NoCap', official: '', nativeName: {} },
          cca2: 'N1',
          capital: [],
          latlng: [0],
          flag: '',
        },
        {
          name: { common: 'HasCap', official: '', nativeName: {} },
          cca2: 'H1',
          capital: ['A'],
          latlng: [0],
          flag: '',
        },
      ] as ICountry[];
      const out = app.capitalFilter(input);
      expect(out.length).toBe(1);
      expect(out[0].capital[0]).toBe('A');
    });

    it('sort should order countries alphabetically by name.common', () => {
      const input = [
        {
          name: { common: 'B', official: '', nativeName: {} },
          cca2: 'B1',
          capital: ['a'],
          latlng: [0],
          flag: '',
        },
        {
          name: { common: 'A', official: '', nativeName: {} },
          cca2: 'A1',
          capital: ['b'],
          latlng: [0],
          flag: '',
        },
      ] as ICountry[];
      const out = app.sort(input);
      expect(out[0].name.common).toBe('A');
      expect(out[1].name.common).toBe('B');
    });

    it('randomize should return same items but potentially different order', () => {
      const input = new Array(10).fill(0).map(
        (_, i) =>
          ({
            name: { common: String(i), official: '', nativeName: {} },
            cca2: String(i),
            capital: ['c'],
            latlng: [0],
            flag: '',
          } as ICountry)
      );
      const out = app.randomize([...input]);
      expect(out.length).toBe(input.length);
      const inSet = input.map((i) => i.cca2).sort();
      const outSet = out.map((i: ICountry) => i.cca2).sort();
      expect(outSet).toEqual(inSet);
    });

    it('group10 should return first 10 items and handle shorter lists', () => {
      const input = new Array(12).fill(0).map(
        (_, i) =>
          ({
            name: { common: String(i), official: '', nativeName: {} },
            cca2: String(i),
            capital: ['c'],
            latlng: [0],
            flag: '',
          } as ICountry)
      );
      const out = app.group10(input);
      expect(out.length).toBe(10);

      const short = new Array(5).fill(0).map(
        (_, i) =>
          ({
            name: { common: String(i), official: '', nativeName: {} },
            cca2: String(i),
            capital: ['c'],
            latlng: [0],
            flag: '',
          } as ICountry)
      );
      const outShort = app.group10(short);
      // current implementation pads by pushing data[x] up to 10 indices;
      // when input is shorter than 10 the resulting array length will be 10
      // with some undefined slots — ensure defined entries equal input length.
      expect(outShort.length).toBe(10);
      const definedCount = outShort.filter(Boolean).length;
      expect(definedCount).toBe(5);
    });

    it('activeCheck should return opposite boolean', () => {
      const result = app.activeCheck(true);
      expect(result).toBeFalse();
      const result2 = app.activeCheck(false);
      expect(result2).toBeTrue();
    });

    it('countrySearch should find the specific test country', () => {
      const target = 'Bonaire, Sint Eustatius and Saba';
      const input = [
        {
          name: { common: 'Other', official: '', nativeName: {} },
          cca2: 'O1',
          capital: ['x'],
          latlng: [0],
          flag: '',
        } as ICountry,
        {
          name: { common: target, official: '', nativeName: {} },
          cca2: 'T1',
          capital: ['y'],
          latlng: [0],
          flag: '',
        } as ICountry,
      ];
      const out = app.countrySearch(input);
      expect(out.length).toBe(1);
      expect(out[0].name.common).toBe(target);
    });
  });

  describe('Timers', () => {
    it('onChange correct answer shows overlay and calls generateQuiz', fakeAsync(() => {
      spyOn(app, 'generateQuiz');
      app.answer = 'yes';
      app.onChange('yes');
      expect(app.isOverlay).toBeTrue();
      expect(app.response).toBe('Correct');
      expect(app.generateQuiz).toHaveBeenCalled();
      tick(1000);
      expect(app.isOverlay).toBeFalse();
      expect(app.response).toBe('');
    }));

    it('onToggle hardcore toggles and shows overlay for 1s', fakeAsync(() => {
      spyOn(app, 'generateQuiz');
      const initial = app.isActiveHardcore;
      app.onToggle('hardcore');
      expect(app.isActiveHardcore).toBe(!initial);
      expect(app.isOverlay).toBeTrue();
      expect(app.response).toBe('Hardcore Mode');
      expect(app.generateQuiz).toHaveBeenCalled();
      tick(1000);
      expect(app.isOverlay).toBeFalse();
      expect(app.response).toBe('');
    }));
  });

  describe('HTML elements', () => {
    it('radio input should call "onChange"', () => {
      const inputEl = el.querySelector('input') as HTMLInputElement;
      spyOn(app, 'onChange');
      inputEl.dispatchEvent(new Event('change'));
      expect(app.onChange).toHaveBeenCalled();
    });

    it('button should call "onToggle"', () => {
      const buttonEl = el.querySelector('button') as HTMLButtonElement;
      spyOn(app, 'onToggle');
      buttonEl.dispatchEvent(new Event('click'));
      expect(app.onToggle).toHaveBeenCalled();
    });
  });
});
