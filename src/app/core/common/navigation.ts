export interface Filter {
    reset();
}

export class Navigation {
    constructor(
        public url: string,
        public scope: string,
        public filter: Filter,
        public isGetIdList: boolean = false
    ){} 
}