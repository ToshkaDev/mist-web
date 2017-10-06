import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';

export class ApiCursor {
  private execute$: Subscription;
  private response: Response;

  constructor(
    private http: Http,
    query: any,
    options: any,
  ) {}

  exec() {
    this.response = null;
    this.cancelPendingExecute();
    this.execute$ = this.http.get('https://api.mistdb.com/v1/genomes')
      .subscribe((response: Response) => {
        this.response = response;
      }, (error) => {

      }, () => {
        this.execute$ = null;
      });
  }

  hasError() {

  }

  isExecuting() {
    return this.execute$ !== null;
  }

  data() {

  }

  count() {

  }

  currentPage() {

  }

  totalPages() {

  }

  first() {

  }

  next() {

  }

  prev() {

  }

  last() {

  }

  private cancelPendingExecute() {
    if (this.execute$) {
      this.execute$.unsubscribe();
    }
  }
}
