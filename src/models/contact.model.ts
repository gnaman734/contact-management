export interface IContact {
  id: string;
  name: string;
  email?: string;
  phone: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Contact {
  public id: string;
  public name: string;
  public email?: string;
  public phone: string;
  public tags: string[];
  public isFavorite: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string | undefined,
    phone: string,
    tags: string[],
    isFavorite: boolean,
    createdAt?: string | Date,
    updatedAt?: string | Date
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.tags = tags;
    this.isFavorite = isFavorite;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
    this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
  }

  update(data: Partial<Omit<IContact, 'id' | 'createdAt' | 'updatedAt'>>) {
    if (data.name !== undefined) this.name = data.name;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.tags !== undefined) this.tags = data.tags;
    if (data.isFavorite !== undefined) this.isFavorite = data.isFavorite;
    this.updatedAt = new Date();
  }
}