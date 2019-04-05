import React from 'react';
import { logout } from '../../actions/Authentication';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

interface PropsFromState extends RouteComponentProps {}
interface PropsFromDispatch {
  logout: typeof logout;
}

type LogoutProps = PropsFromState & PropsFromDispatch;

export const ConnectedLogout = (props: LogoutProps) => {
  const handleClick = () => {
    props.logout();
    props.history.push('/login');
  };

  return (
    <button type="button" onClick={handleClick}>
      Logout
    </button>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout: () => dispatch(logout()),
});

const preconnect = connect(
  null,
  mapDispatchToProps,
);

export const Logout = withRouter(preconnect(ConnectedLogout));
