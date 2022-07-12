import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";

interface Reader<T> {
  findUnique(item: T): Promise<T>;
  findFirst(item: T): Promise<T>;
  findMany(item: T): Promise<T[]>;
}

interface Write<T> {
  create(item: T): void;
  createMany(item: T): void;
  update(item: T): void;
  updateMany(item: T): void;
  delete(item: T): void;
  deleteMany(item: T): void;
}

@Service()
export default abstract class BasePrismaRepo<T> implements Reader<T>, Write<T> {
  public readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  findUnique(item: T): Promise<T> {
    throw new Error("findUnique Method is not implemnted.");
  }

  findFirst(item: T): Promise<T> {
    throw new Error("findFirst Method is not implemnted.");
  }

  findMany(item: T): Promise<T[]> {
    throw new Error("item Method is not implemnted.");
  }

  create(item: T): void {
    throw new Error("create Method is not implemnted.");
  }

  createMany(item: T): void {
    throw new Error("createMany Method is not implemnted.");
  }

  update(item: T): void {
    throw new Error("update Method is not implemnted.");
  }

  updateMany(item: T): void {
    throw new Error("updateMany Method is not implemnted.");
  }

  delete(item: T): void {
    throw new Error("delete Method is not implemnted.");
  }

  deleteMany(item: T): void {
    throw new Error("deleteMany Method is not implemnted.");
  }
}
