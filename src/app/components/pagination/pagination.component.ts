import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav aria-label="Page navigation" *ngIf="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" [class.disabled]="currentPage === 1">
          <a
            class="page-link"
            (click)="onPageChange(currentPage - 1)"
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        <ng-container *ngFor="let page of getPages()">
          <li class="page-item" [class.active]="page === currentPage">
            <a class="page-link" (click)="onPageChange(page)">{{ page }}</a>
          </li>
        </ng-container>

        <li class="page-item" [class.disabled]="currentPage === totalPages">
          <a
            class="page-link"
            (click)="onPageChange(currentPage + 1)"
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [
    `
      .page-link {
        cursor: pointer;
      }
    `,
  ],
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChanged = new EventEmitter<number>();

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChanged.emit(page);
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
