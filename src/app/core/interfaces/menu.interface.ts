export interface Menu {
  _id?: string;
  name: string;
  path: string;
  icon?: string;
  parentId?: string;
  children?: Menu[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMenuDTO {
  name: string;
  path: string;
  icon?: string;
  parentId?: string;
}

export interface UpdateMenuDTO extends Partial<CreateMenuDTO> {} 