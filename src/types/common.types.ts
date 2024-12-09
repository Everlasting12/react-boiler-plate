export type Data<T> = {
  total: number;
  skip: number;
  limit: number;
  data: T[];
};

export interface Query {
  paginate: boolean;
  skip?: number;
  limit?: number;
  isActive?: boolean;
  relation?: boolean;
  select?: string[];
}
