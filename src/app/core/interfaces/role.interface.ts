interface RoleMenu {
  _id: string;
  name: string;
  path: string;
  icon: string;
}

export interface Role {
  _id?: string;
  name: string;
  description: string;
  permissions: string[];
  menus: RoleMenu[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRoleDTO {
  name: string;
  description: string;
  permissions: string[];
  menus: string[];
  isActive: boolean;
} 