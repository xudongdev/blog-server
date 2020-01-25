/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-dupe-class-members */
/* eslint-disable no-param-reassign */

import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  getMetadataArgsStorage,
  ObjectID,
  QueryRunner,
  RemoveOptions,
  Repository,
  SaveOptions,
  SelectQueryBuilder
} from "typeorm";

export class EntityService<Entity> {
  constructor(public readonly repository: Repository<Entity>) {
    return this;
  }

  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<Entity> {
    return this.repository.createQueryBuilder(alias, queryRunner);
  }

  create(): Entity;

  create(entityLikeArray: DeepPartial<Entity>[]): Entity[];

  create(entityLike: DeepPartial<Entity>): Entity;

  create(
    plainEntityLikeOrPlainEntityLikes?:
      | DeepPartial<Entity>
      | DeepPartial<Entity>[]
  ): Entity | Entity[] {
    return this.repository.create(plainEntityLikeOrPlainEntityLikes as any);
  }

  findOne(
    id?: string | number | Date | ObjectID,
    options?: FindOneOptions<Entity>
  ): Promise<Entity | undefined>;

  findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined>;

  findOne(
    conditions?: FindConditions<Entity>,
    options?: FindOneOptions<Entity>
  ): Promise<Entity | undefined>;

  findOne(
    optionsOrConditions?:
      | string
      | number
      | Date
      | ObjectID
      | FindOneOptions<Entity>
      | FindConditions<Entity>,
    maybeOptions?: FindOneOptions<Entity>
  ): Promise<Entity | undefined> {
    return this.repository.findOne(optionsOrConditions as any, maybeOptions);
  }

  find(options?: FindManyOptions<Entity>): Promise<Entity[]>;

  find(conditions?: FindConditions<Entity>): Promise<Entity[]>;

  find(
    optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>
  ): Promise<Entity[]> {
    return this.repository.find(optionsOrConditions as any);
  }

  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false }
  ): Promise<T[]>;

  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions
  ): Promise<(T & Entity)[]>;

  save<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false }
  ): Promise<T>;

  save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions
  ): Promise<T & Entity>;

  save<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions
  ): Promise<T | T[]> {
    return this.repository.save(entityOrEntities as any, options);
  }

  remove(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;

  remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;

  remove(
    entityOrEntities: Entity | Entity[],
    options?: RemoveOptions
  ): Promise<Entity | Entity[]> {
    return this.repository.remove(entityOrEntities as any, options);
  }

  async load<PropertyName extends keyof Entity>(
    entity: Entity,
    propertyName: PropertyName & string
  ): Promise<Entity[PropertyName]> {
    const relation = getMetadataArgsStorage().relations.find(
      item =>
        item.target === entity.constructor && item.propertyName === propertyName
    );

    if (!relation) {
      throw new Error("Relation is not found.");
    }

    const queryBuilder = this.repository
      .createQueryBuilder()
      .relation(entity.constructor, propertyName)
      .of(entity);

    switch (relation.relationType) {
      case "one-to-many":
      case "many-to-many":
        entity[propertyName] = (await queryBuilder.loadMany()) as any;
        break;
      case "one-to-one":
      case "many-to-one":
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        entity[propertyName] = await queryBuilder.loadOne();
        break;
      default:
    }

    return entity[propertyName];
  }
}
