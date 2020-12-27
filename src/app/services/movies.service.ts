import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  PipeTransform,
} from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  of,
  Subject,
} from 'rxjs';
import {
  debounceTime,
  delay,
  switchMap,
  tap,
} from 'rxjs/operators';

import {
  COUNTRIES,
  Movies,
} from '../components/movies-details/movies';
import {
  SortColumn,
  SortDirection,
} from '../components/movies-details/sortable.directive';

interface SearchResult {
  countries: Movies[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}


const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
function sort(countries: Movies[], column: SortColumn, direction: string): Movies[] {
  if (direction === '' || column === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(country: Movies, term: string, pipe: PipeTransform) {
  return country.Title.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(country.Year).includes(term)
    || pipe.transform(country.BoxOffice).includes(term)
    || pipe.transform(country.imdbRating).includes(term);
}

@Injectable({providedIn: 'root'})
export class MovieService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _Movies = new BehaviorSubject<Movies[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe,private httpClient: HttpClient) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._Movies.next(result.countries);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get Movies() { return this._Movies.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let countries = sort(COUNTRIES, sortColumn, sortDirection);

    // 2. filter
    countries = countries.filter(country => matches(country, searchTerm, this.pipe));
    const total = countries.length;

    // 3. paginate
    countries = countries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({countries, total});


  }
}