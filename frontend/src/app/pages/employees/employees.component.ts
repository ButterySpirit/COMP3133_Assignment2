import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
  searchForm: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      department: [''],
      designation: ['']
    });
  }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load employees:', err);
        this.loading = false;
      }
    });
  }

  deleteEmployee(id: string) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.employees = this.employees.filter(emp => emp.id !== id);
      },
      error: (err) => console.error('❌ Delete failed:', err)
    });
  }

  onSearch() {
    const { department, designation } = this.searchForm.value;

    this.employeeService.searchEmployees(department, designation).subscribe({
      next: (res) => {
        this.employees = res;
      },
      error: (err) => {
        console.error('❌ Search failed:', err);
      }
    });
  }
}
