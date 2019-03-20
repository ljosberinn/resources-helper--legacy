import * as React from 'react';
import { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setAPIKey } from '../../actions/API';
import { IPreloadedState } from '../../types';

interface PropsFromState {
  APIKey: string;
}

interface PropsFromDispatch {
  setAPIKey: typeof setAPIKey;
}

type APIKeyInputProps = PropsFromState & PropsFromDispatch;

const APIKeyInput: FunctionComponent<APIKeyInputProps> = props => (
  <div>
    <label>
      <input
        type={'text'}
        maxLength={45}
        placeholder={'API key'}
        defaultValue={props.APIKey}
        dir={'auto'}
        onChange={e => {
          const APIKey = e.target.value;

          if (isValidAPIKey(APIKey)) {
            props.setAPIKey(APIKey);
          }
        }}
      />
    </label>
  </div>
);

const isValidAPIKey = (APIKey: string) => APIKey.length === 45 && /[a-zA-Z0-9]/.test(APIKey);

const mapStateToProps = ({ user }: IPreloadedState) => ({
  APIKey: user.API.key,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setAPIKey: (APIKey: string) => dispatch(setAPIKey(APIKey)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(APIKeyInput);
