import assert from "assert";
import Category, {
  CreateCategoryInput,
} from "../../src/entities/category.entity";
import {
  IMockStore,
  addMocksToSchema,
  createMockStore,
} from "@graphql-tools/mock";
import { ApolloServer } from "@apollo/server";
import { buildSchemaSync } from "type-graphql";
import { printSchema } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import CategoryResolver from "../../src/resolvers/category.resolver";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
} from "../requete_tests/mutations_tests/category.mutation";

import {
  LIST_CATEGORY,
  FIND_CATEGORY_BY_ID,
} from "../requete_tests/queries_tests/category.queries";

import type {
  ResponseData,
  CreateResponseData,
  DeleteResponseData,
} from "../type_tests";

const categoryData: Category[] = [
  { id: "1", name: "Catégorie 1" },
  { id: "2", name: "Catégorie 2" },
];

let server: ApolloServer;

const baseSchema = buildSchemaSync({
  resolvers: [CategoryResolver],
  authChecker: () => true,
});

const schemaString = printSchema(baseSchema);
const schema = makeExecutableSchema({ typeDefs: schemaString });

beforeAll(async () => {
  const store = createMockStore({ schema });
  store.set("Query", "ROOT", "categories", categoryData);

  const resolvers = (store: IMockStore) => ({
    Query: {
      categories() {
        return store.get("Query", "ROOT", "categories");
      },
      findCategory(_: null, id: { id: string }) {
        return store.get("Category", id);
      },
    },
    Mutation: {
      createCategory(_: null, { data }: { data: CreateCategoryInput }) {
        store.set("Category", "3", data);
        return store.get("Category", "3");
      },
      deleteCategory(_: null, { id }: { id: string }) {
        const categoryToDelete = store.get("Category", id);
        store.set(
          "Query",
          "ROOT",
          "categories",
          categoryData.filter((category) => category.id !== id)
        );

        return categoryToDelete;
      },
    },
  });

  server = new ApolloServer({
    schema: addMocksToSchema({
      schema: baseSchema,
      store,
      resolvers,
    }),
  });
});
const categoryIds = categoryData.map((category) => ({ id: category.id }));
describe("Test sur les catégorie", () => {
  it("Récupération des catégorie depuis le store", async () => {
    const response = await server.executeOperation<ResponseData>({
      query: LIST_CATEGORY,
    });
    assert(response.body.kind === "single");
    console.log(response);

    expect(response.body.singleResult.data).toEqual({
      categories: categoryIds,
    });
  });

  it("Ajout d'un livre", async () => {
    const createResponse = await server.executeOperation<CreateResponseData>({
      query: CREATE_CATEGORY,
      variables: {
        data: {
          name: "Categorie 3",
        },
      },
    });
    assert(createResponse.body.kind === "single");
    expect(createResponse.body.singleResult.data).toEqual({
      createCategory: {
        id: "3",
        name: "Categorie 3",
      },
    });
  });
  it("Récupérer une catégorie", async () => {
    const recupResponse = await server.executeOperation<ResponseData>({
      query: FIND_CATEGORY_BY_ID,
      variables: {
        findCategoryId: "2",
      },
    });
    assert(recupResponse.body.kind === "single");
    expect(recupResponse.body.singleResult.data).toEqual({
      findCategory: {
        id: "2",
        name: "Catégorie 2",
      },
    });
  });

  test("Effacer une catégorie", async () => {
    const deleteResponse = await server.executeOperation<DeleteResponseData>({
      query: DELETE_CATEGORY,
      variables: {
        deleteCategoryId: "1",
      },
    });
    assert(deleteResponse.body.kind === "single");
    expect(deleteResponse.body.singleResult.data).toEqual({
      deleteCategory: {
        id: "1",
        name: "Catégorie 1",
      },
    });
  });
});
