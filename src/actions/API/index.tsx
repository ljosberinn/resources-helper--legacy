import { action } from 'typesafe-actions';

enum UserActions {
  SET_API_KEY = '@@user/SET_API_KEY',
}

const setAPIKey = (APIKey: string) => action(UserActions.SET_API_KEY, APIKey);

export { UserActions, setAPIKey };
