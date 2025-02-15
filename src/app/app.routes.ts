import { Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { OrderComponent } from './order/order.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', 
    redirectTo: 'customer',
    pathMatch:'full'
   },
    { path: "customer", component: CustomerComponent },
  { path: "order", component: OrderComponent }

];
