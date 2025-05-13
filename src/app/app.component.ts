import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer class="bg-light py-4 mt-5">
      <div class="container text-center">
        <p class="mb-0">
          &copy; {{ currentYear }} Blog Smarters. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  `,
  styles: [
    `
      main {
        min-height: calc(100vh - 180px);
      }
    `,
  ],
})
export class AppComponent {
  currentYear = new Date().getFullYear();
}
