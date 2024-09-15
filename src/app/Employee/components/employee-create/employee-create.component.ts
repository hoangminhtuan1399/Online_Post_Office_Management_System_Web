import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent {
  employee: Employee = {
    id: '',
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: new Date(),
    officeId: '',
    accountId: ''
  };

  successMessage: string | null = null;  // Khai báo thuộc tính successMessage

  constructor(private employeeService: EmployeeService) { }

  createEmployee(): void {
    this.employeeService.createEmployee(this.employee).subscribe(() => {
      this.successMessage = 'Employee created successfully!';  // Đặt thông báo thành công
      this.resetForm();  // Reset form sau khi tạo thành công
    });
  }

  resetForm(): void {
    this.employee = {
      id: '',
      name: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: new Date(),
      officeId: '',
      accountId: ''
    };
  }
}
