export interface ICategory {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  taskCount?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
