import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setFactories, setLocalization } from "../../actions/Factories";
import { saveState, store } from "../../Store";
import { IPreloadedState } from "../../types";
import { IFactory } from "../../types/factory";
import { getLocalization, getStaticData } from "../helper";
import LoadingGears from "../Shared/Loading";
import FactoryTable from "./FactoryTable";
import { IFactoryLocalization } from "./interfaces";

interface PropsFromState {
  loading: boolean;
  factories: IFactory[];
  localization: IFactoryLocalization;
}

interface PropsFromDispatch {
  setFactories: typeof setFactories;
  setLocalization: typeof setLocalization;
}

type FactoriesProps = PropsFromState & PropsFromDispatch;

const Factories: React.FunctionComponent<FactoriesProps> = (props) => {
  const [factories, setFactories] = React.useState<IFactory[]>();
  const [localization, setLocalization] = React.useState<IFactoryLocalization>();

  React.useEffect(() => {
    if (factories === undefined && localization === undefined) {
      const currentStore = store.getState();

      Promise.all([getLocalization(currentStore, "factories"), getStaticData(currentStore, "factories")]).then((fulfilledPromises) => {
        const [localization, factories] = fulfilledPromises;

        setTimeout(() => {
          props.setFactories(factories);
          props.setLocalization("factories", localization);

          saveState();

          setLocalization(localization);
          setFactories(factories);
        }, 1000);
      });
    }
  }, [factories, localization]);

  if (factories === undefined || localization === undefined) {
    return <LoadingGears />;
  }

  return <FactoryTable localization={localization} factories={factories} />;
};

const mapStateToProps = (state: IPreloadedState) => ({ ...state.factories });

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFactories: (factories: IFactory[]) => dispatch(setFactories(factories)),
  setLocalization: (type: string, localization: IFactoryLocalization) => dispatch(setLocalization(type, localization))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Factories);
