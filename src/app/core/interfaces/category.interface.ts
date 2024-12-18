export interface SubCategoryDetail {
  _id: string;
  nombre_subcategoria_detalle: string;
  descripcion: string;
}

export interface SubCategory {
  _id: string;
  nombre_subcategoria: string;
  descripcion_subcategoria: string;
  color_subcategoria: string;
  subcategorias_detalle: SubCategoryDetail[];
}

export interface Category {
  _id: string;
  nombre_categoria: string;
  descripcion_categoria: string;
  color_categoria: string;
  subcategorias: SubCategory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
} 