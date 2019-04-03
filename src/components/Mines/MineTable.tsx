import React, { memo, ChangeEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setMineCount, setMines, setTechedMiningRate } from '../../actions/Mines';
import { IMineState } from '../../types/mines';
import { getStaticData, evaluateLoadingAnimationTimeout } from '../helperFunctions';
import { IPreloadedState } from '../../types';
import { store } from '../..';
import { Loading } from '../Shared/Loading';

interface PropsFromState {
  mines: IMineState[];
}

interface PropsFromDispatch {
  setMineCount: typeof setMineCount;
  setMines: typeof setMines;
  setTechedMiningRate: typeof setTechedMiningRate;
}

type MineTableType = PropsFromState & PropsFromDispatch;

const getMineAmountSum = (mines: IMineState[]) => mines.reduce((sum, currentMine) => sum + currentMine.amount, 0);

const ConnectedMineTable = memo((props: MineTableType) => {
  const { setMineCount, setTechedMiningRate } = props;

  const currentStore = store.getState();

  const [mines, setMines] = useState(currentStore.mines);
  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const isLoading = mines.length === 0;

  useEffect(() => {
    if (isLoading && !hasError) {
      const getMineData = (currentStore: IPreloadedState, props: MineTableType) => {
        const loadingStart = new Date().getMilliseconds();

        Promise.resolve(getStaticData(currentStore, 'mines', setError, setErrorType)).then(mines => {
          const timePassed = new Date().getMilliseconds() - loadingStart;

          setTimeout(() => {
            // Redux
            props.setMines(mines);

            // Hooks
            setMines(mines);
          }, evaluateLoadingAnimationTimeout(timePassed));
        });
      };

      getMineData(currentStore, props);
    }
  }, [mines]);

  if (hasError) {
    if (errorType === 'AbortError') {
      return <p>Server unavailable</p>;
    }

    return <p>Error</p>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <table>
      <thead>
        <tr />
      </thead>
      <tbody>
        {Object.values(mines).map(mine => {
          const updateTechedMiningRate = (e: ChangeEvent<HTMLInputElement>) => {
            const miningRate = parseInt(e.target.value);

            setTechedMiningRate(mine.resourceID, Number.isNaN(miningRate) ? 0 : miningRate);
          };

          const updateMineCount = (e: ChangeEvent<HTMLInputElement>) => {
            const mineCount = parseInt(e.target.value);

            setMineCount(mine.resourceID, Number.isNaN(mineCount) ? 0 : mineCount);
          };

          return (
            <tr key={mine.resourceID}>
              <td>ID {mine.resourceID}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="200000000"
                  onChange={updateTechedMiningRate}
                  defaultValue={mine.sumTechRate.toString()}
                  placeholder="rate/hr"
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="35000"
                  onChange={updateMineCount}
                  defaultValue={mine.amount.toString()}
                  placeholder="mine amount"
                />
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td>{getMineAmountSum(mines)}</td>
        </tr>
      </tfoot>
    </table>
  );
});

const mapStateToProps = ({ mines }: MineTableType) => ({ mines });

const mapDispatchToProps = {
  setMineCount,
  setMines,
  setTechedMiningRate,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const MineTable = preconnect(ConnectedMineTable);
MineTable.displayName = 'MineTable';
