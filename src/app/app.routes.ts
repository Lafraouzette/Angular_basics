import { Routes } from '@angular/router';

import { CustomerComponent } from './components/customer/customer.component';
import { OrderComponent } from './components/order/order.component';

export const routes: Routes = [
  { path: '', 
    redirectTo: 'customer',
    pathMatch:'full'
   },
    { path: "customer", component:CustomerComponent  },
  { path: "order", component:OrderComponent  }

];
