import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from '../models/pagination';

@Component({
    selector: 'app-pagination',
    templateUrl: 'pagination.component.html'
})

export class PaginationComponent implements OnInit {

    @Input() pagination: Pagination;
    @Output() pageChange = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit() { }

    private onSelect(page: number): void {
        this.pageChange.emit(page);
    }
}