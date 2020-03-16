import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/do';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';

export const ApiHeaderNames: {[key: string]: string} = {
  First: 'first',
  Last: 'last',
  Next: 'next',
  Prev: 'prev',
};

/**
 * Usage:
 * const cursor = new ApiCursor('http://api.mistdb.com/v1/genomes');
 * cursor.execute()
 * cursor.next().execute()
 */
export class ApiCursor {
  data$ = new ReplaySubject<any>();
  error: any;

  private execute$: Subscription;
  private response: Response;
  private query: any;

  constructor(
    private http: HttpClient,
    private baseQuery: string,
  ) {
    this.query = baseQuery;
  }

  execute() {
    this.clear();
    this.cancelPendingExecute();
    this.execute$ = this.http.get(this.query)
      .do(
        (response) => this.processResponse(response),
        (error) => { this.error = error; },
        () => { this.execute$ = null; },
      )
      .subscribe();

    return this.data$;
  }

  isExecuting() {
    return this.execute$ !== null;
  }

  count() {

  }

  currentPage() {

  }

  totalPages() {

  }

  first() {
    this.setQueryFromHeader(ApiHeaderNames.First);
    return this.execute();
  }

  next() {
    this.setQueryFromHeader(ApiHeaderNames.Next);
    return this.execute();
  }

  prev() {
    this.setQueryFromHeader(ApiHeaderNames.Prev);
    return this.execute();
  }

  last() {
    this.setQueryFromHeader(ApiHeaderNames.Last);
    return this.execute();
  }

  private clear() {
    this.error = null;
    this.response = null;
    this.data$.next(undefined);
  }

  private cancelPendingExecute() {
    if (this.execute$) {
      this.execute$.unsubscribe();
      this.execute$ = null;
    }
  }

  private processResponse(response) {
    this.response = response;
    this.data$.next(response);
  }

  private setQueryFromHeader(headerName: string) {
    if (this.response && this.response.headers.has(headerName)) {
      this.query = this.response.headers.get(headerName);
    }
  }
}
