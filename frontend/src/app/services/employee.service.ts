import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getEmployees() {
    return this.apollo.query({
      query: gql`
        query {
          getEmployees {
            id
            first_name
            last_name
            email
            gender
            designation
            department
            salary
            date_of_joining
            employee_photo
          }
        }
      `,
      fetchPolicy: 'no-cache'
    }).pipe(map((res: any) => res.data.getEmployees));
  }

  getEmployeeById(id: string) {
    return this.apollo.query({
      query: gql`
        query GetEmployeeById($id: ID!) {
          getEmployeeById(id: $id) {
            id
            first_name
            last_name
            email
            gender
            designation
            department
            salary
            date_of_joining
            employee_photo
          }
        }
      `,
      variables: { id }
    }).pipe(map((res: any) => res.data.getEmployeeById));
  }

  addEmployee(employee: Employee) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddEmployee(
          $first_name: String!,
          $last_name: String!,
          $email: String!,
          $gender: String!,
          $designation: String!,
          $department: String!,
          $salary: Float!,
          $date_of_joining: String!,
          $employee_photo: String
        ) {
          addEmployee(
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            gender: $gender,
            designation: $designation,
            department: $department,
            salary: $salary,
            date_of_joining: $date_of_joining,
            employee_photo: $employee_photo
          ) {
            id
          }
        }
      `,
      variables: {
        ...employee,
        date_of_joining: new Date(employee.date_of_joining).toISOString(),
      }
    });
  }

  updateEmployee(id: string, updates: Partial<Employee>) {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateEmployee(
          $id: ID!,
          $first_name: String!,
          $last_name: String!,
          $email: String!,
          $gender: String!,
          $designation: String!,
          $department: String!,
          $salary: Float!,
          $date_of_joining: String!,
          $employee_photo: String
        ) {
          updateEmployee(
            id: $id,
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            gender: $gender,
            designation: $designation,
            department: $department,
            salary: $salary,
            date_of_joining: $date_of_joining,
            employee_photo: $employee_photo
          ) {
            id
          }
        }
      `,
      variables: {
        id,
        ...updates,
        date_of_joining: new Date(updates.date_of_joining!).toISOString(),
        employee_photo: updates.employee_photo || ""
      }
    });
  }

  searchEmployees(department: string, designation: string) {
    return this.apollo.query({
      query: gql`
        query SearchEmployees($department: String, $designation: String) {
          searchEmployeesByDesignationOrDepartment(department: $department, designation: $designation) {
            id
            first_name
            last_name
            email
            gender
            designation
            department
            salary
            date_of_joining
            employee_photo
          }
        }
      `,
      variables: { department, designation },
      fetchPolicy: 'no-cache'
    }).pipe(map((res: any) => res.data.searchEmployeesByDesignationOrDepartment));
  }

  deleteEmployee(id: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployee(id: $id)
        }
      `,
      variables: { id }
    });
  }
}
