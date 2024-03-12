import Material, { MaterialDeleted } from "./../entities/material.entity";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import MaterialService from "../services/material.service";
import { CreateMaterialInput, UpdateMaterialInput } from "../entities/material.entity";

@Resolver()
export default class MaterialResolver{
    @Query(() => [Material])
    async listMaterials () {
        const materials = await new MaterialService().listMaterials();
        console.log('MATERIALS', materials);
        return materials;
  }

  @Mutation(() => Material)
  async createMaterial (@Arg('data') data: CreateMaterialInput) {
    const newMaterial = await new MaterialService().createMaterial(data);
    return newMaterial;
  }

  @Mutation(() => MaterialDeleted)
  async deleteMaterial (@Arg('id') id: string) {
    const { id: idAd, ...ad } = await new MaterialService().deleteMaterial(id);
    return ad
  }

  @Mutation(() => Material)
  async updateMaterial (@Arg('data') data: UpdateMaterialInput) {
    const { id, ...otherData } = data;
    const materialToUpdate = await new MaterialService().updateMaterial(id, otherData);
    return materialToUpdate;
  }
}
