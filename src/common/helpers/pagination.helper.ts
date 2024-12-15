import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PageParams, SortParams } from '../models';

export async function paginate<Entity>(
  repo: Repository<Entity>,
  pageParams: PageParams,
  sortParams: SortParams<any>,
  relations: string[] | undefined,
  conditions: FindOptionsWhere<Entity> = {},
) {
  const orderBy: FindOptionsOrder<Entity> = {};
  const query = repo.createQueryBuilder();
  let totalCount = 0;
  let items: Entity[] = [];

  if (sortParams) {
    orderBy[sortParams.sort] = sortParams.direction;
  }

  query.setFindOptions({
    where: conditions,
    relations: relations,
    skip: pageParams.limit * (pageParams.page - 1),
    take: pageParams.limit,
    order: orderBy,
  });

  if (pageParams.needTotalCount) {
    totalCount = await query.getCount();
  }

  if (!pageParams.onlyCount) {
    items = await query.getMany();
  }

  return {
    page: pageParams.page,
    totalCount: totalCount,
    rawItems: items,
  };
}
