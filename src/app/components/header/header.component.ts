import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="bg-primary text-white p-4 mb-4">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <a routerLink="/" class="text-white text-decoration-none">
            <h1>Blog Smarters</h1>
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      header {
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
})
export class HeaderComponent {}
