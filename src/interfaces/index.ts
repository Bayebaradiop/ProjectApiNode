export interface IBaseRepository<T, TCreate, TUpdate = Partial<TCreate>, TKey = number> {
  findAll(): Promise<T[]>;
  findById(id: TKey): Promise<T | null>;
  create(data: TCreate): Promise<T>;
  update(id: TKey, data: TUpdate): Promise<T>;
  delete(id: TKey): Promise<void>;
}
