import * as Loadable from 'react-loadable';
import LoadingGears  from './Loading';
import * as React    from 'react';

const Loading = (props: any) => {
  if (props.error) {
    return <div>Error! <button onClick={props.retry}>Retry</button></div>;
  }

  if (props.timedOut) {
    return <div>Taking a long time... <button onClick={props.retry}>Retry</button></div>;
  }

  if (props.pastDelay) {
    return <LoadingGears/>;
  }

  return null;
};

interface IWeakLoadableOptions {
  loader: () => any;
}

const WeakLoadable = (options: IWeakLoadableOptions) => Loadable(Object.assign({
  loading: Loading,
  delay  : 200,
  timeout: 3000,
}, options));

export {
  WeakLoadable,
  Loading
};
