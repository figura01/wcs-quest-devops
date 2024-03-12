import { buildSchemaSync } from "type-graphql";
import CategoryResolver from "../../src/resolvers/category.resolver";
import { ApolloServer } from "@apollo/server";

import { addMocksToSchema } from "@graphql-tools/mock";
import assert from "assert";
import Category from "../../src/entities/category.entity";

import {
  LIST_CATEGORY,
  FIND_CATEGORY_BY_ID,
  LIST_CATEGORY_WITH_NAME,
} from "../requete_tests/queries_tests/category.queries";

import type { ResponseData, CategoryNameResponseData } from "../type_tests";

const categoryData: Category[] = [
  { id: "1", name: "Categorie 1" },
  { id: "2", name: "Catégorie 2" },
];

let server: ApolloServer;

const baseSchema = buildSchemaSync({
  resolvers: [CategoryResolver],
  authChecker: () => true,
});

beforeAll(async () => {
  const resolvers = () => ({
    Query: {
      categories() {
        return categoryData;
      },
      findCategory(_: any, args: { id: string }) {
        return categoryData.find((b) => b.id == args.id);
      },
    },
  });
  server = new ApolloServer({
    schema: addMocksToSchema({
      schema: baseSchema,
      resolvers: resolvers as unknown as ReturnType<typeof resolvers>,
    }),
  });
});

describe("Test sur les livres", () => {
  it("mon premier test", async () => {
    const response = await server.executeOperation<ResponseData>({
      query: LIST_CATEGORY,
    });

    assert(response.body.kind === "single");
    expect(response.body.singleResult.data?.categories).toHaveLength(2);
  });

  it("récupération des livres uniquement avec leurs nom", async () => {
    const response = await server.executeOperation<ResponseData>({
      query: LIST_CATEGORY_WITH_NAME,
    });

    assert(response.body.kind === "single");
    expect(response.body.singleResult.data).toEqual({
      categories: [{ name: "Categorie 1" }, { name: "Catégorie 2" }],
    });
  });

  it("récupération d'un uniquement avec leurs nom", async () => {
    const response = await server.executeOperation<CategoryNameResponseData>({
      query: FIND_CATEGORY_BY_ID,
      variables: {
        findCategoryId: "1",
      },
    });
    assert(response.body.kind === "single");
    expect(response.body.singleResult.data).toEqual({
      findCategory: categoryData[0],
    });
  });
});
