import { DEV_SETTINGS } from "../developmentSettings";
import { IPreloadedState } from "../types";
import { IFactory } from "../types/factory";
//import { ISpecialBuildingState } from "../types/specialBuildings";
import { IFactoryLocalization } from "./Factories/interfaces";
//import { ISpecialBuildingsLocalization } from "./Buildings/interfaces";

const getStaticData = async (state: IPreloadedState, component: string) => {
  if (state[component].length > 0) {
    //return await state[component];
  }

  const uri = DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development;

  const response = await fetch(`${uri}/static/?type=${component}`);

  return (await response.json()) as /*ISpecialBuildingState[] |*/ IFactory[];
};

const getLocalization = async ({ localization }: IPreloadedState, component: string, locale = "en") => {
  if (localization[component].length !== 0) {
    // return await localization[component];
  }

  const uri = DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development;

  const response = await fetch(`${uri}/static/?type=localization&locale=${locale}&component=${component}`);

  return (await response.json()) as IFactoryLocalization /*| ISpecialBuildingsLocalization*/;
};

const filterFactoryByPropsID = (factories: IFactory[], props: { id: number }) => factories.find((factory) => factory.id === props.id);

export { getLocalization, getStaticData, filterFactoryByPropsID };
