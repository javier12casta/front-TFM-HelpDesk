export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRoleDTO {
  name: string;
  description: string;
  permissions: string[];
  menu: [];
} 