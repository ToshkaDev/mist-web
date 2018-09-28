import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'replace'
  })
  export class ReplacePipe implements PipeTransform {
    transform(val: string, params: string[]): string {
      return val.replace(params[0], params[1]);
    }
  }