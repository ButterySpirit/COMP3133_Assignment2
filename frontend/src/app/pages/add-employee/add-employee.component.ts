import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
  submitted = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private http: HttpClient
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['Male', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      salary: [1000, [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      employee_photo: [''], // Will hold the uploaded filename
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result as string;
    reader.readAsDataURL(this.selectedFile);
  }

  onSubmit() {
    this.submitted = true;
    if (this.employeeForm.invalid) return;

    if (this.selectedFile) {
      const formData = new FormData();

      // 👇 FIXED field name to match Multer backend config
      formData.append('employee_photo', this.selectedFile);

      this.http.post<{ filename: string }>('http://localhost:5000/upload', formData).subscribe({
        next: (res) => {
          this.employeeForm.patchValue({ employee_photo: res.filename });
          this.submitForm();
        },
        error: (err) => {
          console.error('❌ Image upload failed:', err);
          alert('Image upload failed');
        }
      });
    } else {
      this.submitForm();
    }
  }

  private submitForm() {
    const formValue = this.employeeForm.value;
    this.employeeService.addEmployee(formValue).subscribe({
      next: () => {
        alert('✅ Employee added successfully!');
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error('❌ Add employee error:', err);
        alert('Failed to add employee.');
      }
    });
  }
}
