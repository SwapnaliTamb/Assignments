import { DecimalPipe } from '@angular/common';
import {
  Component,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { Observable } from 'rxjs';
import { MovieService } from 'src/app/services/movies.service';

import { Movies } from './movies';
import {
  NgbdSortableHeader,
  SortEvent,
} from './sortable.directive';

@Component({
  selector: 'app-movies-details',
  templateUrl: './movies-details.component.html',
  styleUrls: ['./movies-details.component.scss'],
  providers: [MovieService, DecimalPipe]
})
export class MoviesDetailsComponent {
  Movies: Observable<Movies[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: MovieService) {
    this.Movies = service.Movies;
    console.log(this.Movies);
    this.total$ = service.total$;
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}