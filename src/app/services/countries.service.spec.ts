import { inject, TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

// SERVICES
import { CountriesService } from './countries.service';

// INTERFACES
import { ICountry } from '../interfaces/country.model';

describe('CountriesService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let countriesService: CountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        CountriesService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.overrideProvider(HttpClient, { useValue: httpClientSpy });
    countriesService = TestBed.inject(CountriesService);
  });

  it('should create', () => {
    expect(countriesService).toBeTruthy();
  });

  it('should be initialized', inject(
    [CountriesService],
    (countriesService: CountriesService) => {
      expect(countriesService).toBeTruthy();
    }
  ));

  describe('getCountries', () => {
    it('should return expected countries (HttpClient called once)', (done: DoneFn) => {
      const expectedCountries: ICountry[] = [
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

      httpClientSpy.get.and.returnValue(of(expectedCountries));
      countriesService.getCountries().subscribe({
        next: (data) => {
          expect(data)
            .withContext('expected countries')
            .toEqual(expectedCountries);
          done();
        },
        error: done.fail,
      });
      expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
    });

    it('should surface an error when HttpClient fails', (done: DoneFn) => {
      const errorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error',
        error: 'Server failure',
      });

      httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

      countriesService.getCountries().subscribe({
        next: () => done.fail('expected an error, but got data'),
        error: (err) => {
          expect(err).toContain('Server returned code: 500');
          done();
        },
      });
    });
  });
});
