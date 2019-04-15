import React from 'react';
import { logout } from '../../actions/Authentication';
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

const mapDispatchToProps = () => ({
  logout,
});

const preconnect = connect(
  null,
  mapDispatchToProps,
);

const Logout = withRouter(preconnect(ConnectedLogout));
export default Logout;