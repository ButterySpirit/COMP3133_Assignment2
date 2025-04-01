import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { ViewEmployeeComponent } from './pages/view-employee/view-employee.component';
import { EditEmployeeComponent } from './pages/edit-employee/edit-employee.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employees', component: EmployeesComponent },

  // Add employee - support both routes
  { path: 'add-employee', component: AddEmployeeComponent },
  { path: 'employees/add', component: AddEmployeeComponent },

  // View & Edit
  { path: 'employees/:id', component: ViewEmployeeComponent },
  { path: 'employees/:id/edit', component: EditEmployeeComponent },

  // Wildcard route (optional, for 404)
  { path: '**', redirectTo: 'login' }
];
