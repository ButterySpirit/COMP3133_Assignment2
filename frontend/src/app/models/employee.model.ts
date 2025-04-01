export interface Employee {
    id?: string; // optional because MongoDB will generate it
    first_name: string;
    last_name: string;
    email: string;
    gender: 'Male' | 'Female' | 'Other';
    designation: string;
    department: string;
    salary: number;
    date_of_joining: string; // use string for ISO date
    employee_photo?: string; // optional
    created_at?: string;
    updated_at?: string;
  }
  