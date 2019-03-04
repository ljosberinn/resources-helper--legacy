import { IUser } from "./user";
import { IFactory } from "./factory";
import { IHeadquarter } from "./headquarter";
import { ISpecialBuilding } from "./specialBuildings";
import { IMine } from "./mines";

export interface IPreloadedState {
  user: IUser;
  factories: IFactory[];
  headquarter: IHeadquarter;
  specialBuildings: ISpecialBuilding[];
  mines: IMine[];
}






