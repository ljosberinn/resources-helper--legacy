import React, { Fragment } from "react";
import Factory from "./Factory";
import { IFactories } from "../../types/factory";

interface IFactoryTableProps {
  factories: IFactories;
}

export const FactoryTable = ({ factories }: IFactoryTableProps) => (
  <table style={{ width: "100%" }}>
    <thead>
      <tr />
    </thead>
    <tbody>
      <Fragment>
        {Object.values(factories).map((factory) => (
          <Factory data={factory} key={factory.id} />
        ))}
      </Fragment>
    </tbody>
  </table>
);