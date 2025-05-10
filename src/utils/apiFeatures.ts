import { PrismaClient } from '@prisma/client';

interface PaginationResult {
  currentPage: number;
  limit: number;
  numberOfPages: number;
  next?: number;
  prev?: number;
}

// Define a type that represents the model clients in PrismaClient
type PrismaModelName = 'user' | 'product' | 'category' | 'order' | 'review' | 'brand';

export class ApiFeatures<T> {
  private prismaQuery: PrismaClient;
  private queryString: Record<string, any>;
  private model: string;
  paginationResult?: PaginationResult;

  constructor(prisma: PrismaClient, model: PrismaModelName, queryString: Record<string, any>) {
    this.prismaQuery = prisma;
    this.queryString = queryString;
    this.model = model;
  }

  filter() {
    const excludesFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    let filters: Record<string, any> = {};

    Object.entries(this.queryString).forEach(([key, value]) => {
      if (!excludesFields.includes(key)) {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([operator, val]) => {
            filters[key] = { [`${operator}`]: val };
          });
        } else {
          filters[key] = value;
        }
      }
    });

    return filters;
  }

  sort() {
    if (this.queryString.sort) {
      const sortFields = this.queryString.sort.split(',').map((field: string) => ({
        [field]: 'asc',
      }));
      return sortFields;
    }
    return [{ createdAt: 'desc' }];
  }

  limitFields() {
    if (this.queryString.fields) {
      return this.queryString.fields.split(',').reduce((acc: any, field: string) => {
        acc[field] = true;
        return acc;
      }, {});
    }
    return {};
  }

  search() {
    if (this.queryString.keyword) {
      return {
        OR: [
          { title: { contains: this.queryString.keyword, mode: 'insensitive' } },
          { description: { contains: this.queryString.keyword, mode: 'insensitive' } },
        ],
      };
    }
    return {};
  }

  async paginate(countDocuments: number) {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination: PaginationResult = {
      currentPage: page,
      limit,
      numberOfPages: Math.ceil(countDocuments / limit),
    };

    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.paginationResult = pagination;
    return { skip, take: limit };
  }

  async apply() {
    const filters = this.filter();
    const sort = this.sort();
    const fields = this.limitFields();
    const search = this.search();

    // Use the model name as a dynamic key with proper type casting
    const prismaModel = this.prismaQuery[this.model as keyof PrismaClient] as any;

    // Make sure the model has the required methods
    if (!prismaModel || typeof prismaModel.count !== 'function' || typeof prismaModel.findMany !== 'function') {
      throw new Error(`Invalid model name: ${this.model}`);
    }

    const totalCount = await prismaModel.count({
      where: { ...filters, ...search },
    });

    const { skip, take } = await this.paginate(totalCount);

    const results = await prismaModel.findMany({
      where: { ...filters, ...search },
      orderBy: sort,
      select: Object.keys(fields).length > 0 ? fields : undefined,
      skip,
      take,
    });

    return { results, pagination: this.paginationResult };
  }
}
