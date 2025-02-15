import { Component } from '@angular/core';
import { FooterComponent } from './components/shared/footer/footer.component';
import { SideBarreComponent } from './components/shared/side-barre/side-barre.component';
import { MainAreaComponent } from './components/main-area/main-area.component';


@Component({
  selector: 'app-root',
  imports: [
   FooterComponent,
  SideBarreComponent,
MainAreaComponent,
   ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tp-angular-basics';
}
