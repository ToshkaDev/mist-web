import { Router } from '@angular/router';
import { databaseToCookies as DatabaseToCookies } from './databaseToCookies';

export abstract class MistDatabaseGetter {
  currentDatabase: string;
  private mistRouter: Router;

  constructor(router: Router)  {
    this.mistRouter = router;
  }

  getCartCookie() {
    this.currentDatabase = this.getCurrentDatabase();
    return DatabaseToCookies.get(this.currentDatabase); 
  }

  getCurrentDatabase(): string {
      if (this.mistRouter.url) {
        const rootUrl = this.mistRouter.url.split("/")[1];
        if (rootUrl === "")
          return "mist";
        else if (rootUrl === "mist" || rootUrl === "mist-metagenomes")
          return rootUrl;
      } 
      return null;
    }
}