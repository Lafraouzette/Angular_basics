import { Component } from '@angular/core';
import { FooterComponent } from './shared/footer/footer.component';
import { SideBarreComponent } from './shared/side-barre/side-barre.component';
import { MainAreaComponent } from './main-area/main-area.component';

@Component({
  selector: 'app-root',
  imports: [
   
    FooterComponent,
    SideBarreComponent,
    MainAreaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tp-angular-basics';
}
