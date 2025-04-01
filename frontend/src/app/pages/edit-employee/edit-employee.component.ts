import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  submitted = false;
  employeeId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      employee_photo: ['']
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (emp: Employee) => {
        this.employeeForm.patchValue(emp);
      },
      error: (err) => {
        console.error('❌ Failed to load employee:', err);
        alert('Failed to load employee data.');
        this.router.navigate(['/employees']);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.employeeForm.invalid) return;

    this.employeeService.updateEmployee(this.employeeId, this.employeeForm.value).subscribe({
      next: () => {
        alert('✅ Employee updated!');
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error('❌ Update error:', err);
        alert('Failed to update employee.');
      }
    });
  }
}
