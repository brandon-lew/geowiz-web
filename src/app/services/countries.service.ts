import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// INTERFACES
import { ICountry } from '../interfaces/country.model';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private http = inject(HttpClient);

  // DEFINE PRIVATE DATA LOCATION
  private dataUrl = 'assets/data/countries.json';

  // PRIVATE HTTP ERROR HANDLING METHOD
  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    // console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  // GET COUNTRIES METHOD
  getCountries(): Observable<ICountry[]> {
    return this.http
      .get<ICountry[]>(this.dataUrl)
      .pipe(tap(), catchError(this.handleError));
  }
}
