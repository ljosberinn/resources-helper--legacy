import { IPreloadedState }       from '../types';
import { IUserAPIState }         from '../types/user';
import { DEV_SETTINGS }          from '../developmentSettings';
import { IMineState }            from '../types/mines';
import { ISpecialBuildingState } from '../types/specialBuildings';

const UserAPIState: IUserAPIState = {
  key              : '',
  lastAPICall      : 0,
  userAPIStatistics: [
    { id: 0, lastCall: 0, amount: 0 },
    { id: 1, lastCall: 0, amount: 0 },
    { id: 2, lastCall: 0, amount: 0 },
    { id: 3, lastCall: 0, amount: 0 },
    { id: 4, lastCall: 0, amount: 0 },
    { id: 5, lastCall: 0, amount: 0 },
    { id: 51, lastCall: 0, amount: 0 },
    { id: 6, lastCall: 0, amount: 0 },
    { id: 7, lastCall: 0, amount: 0 },
    { id: 8, lastCall: 0, amount: 0 },
    { id: 9, lastCall: 0, amount: 0 },
    { id: 10, lastCall: 0, amount: 0 },
  ]
};

const UserPlayerInfoState = {
  userName  : '',
  level     : 0,
  rank      : 0,
  registered: 0,
};

const UserSettingState = {
  remembersAPIKey: false,
  locale         : 'en',
};

const CompanyWorthState = {
  headquarter     : 0,
  factories       : 0,
  specialBuildings: 0,
  mines           : 0,
};

const UserState = {
  isAPIUser : false,
  settings  : UserSettingState,
  playerInfo: UserPlayerInfoState,
  API       : UserAPIState,
};


const preloadedState: IPreloadedState = {
  user            : UserState,
  factories       : [],
  mines           : [],
  specialBuildings: [],
  headquarter     : [],
  companyWorth    : CompanyWorthState,
};

['mines', 'specialBuildings'].forEach(key => {
  (async () => {
    const response = await fetch(`${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/static/?type=${key}`);
    const json: IMineState[] | ISpecialBuildingState[] = await response.json();

    json.forEach((value: IMineState | ISpecialBuildingState) => preloadedState[key].push(value));
  })();
});

export {
  UserAPIState,
  UserPlayerInfoState,
  UserSettingState,
  preloadedState
};
