import * as React from "react";
import { useState, useEffect } from 'react';

import { Example } from "./Example";
import { TruckFilter } from "./TruckFilter";
import { TimeLine } from "./TimeLine";
import { TruckTimeLineService } from "../services/TruckTimeLineService";

//import { RouteComponentProps } from 'react-router-dom';
export default function Home() {
  const [trucks, setTrucks] = useState([]);
  useEffect(() => {
    let truckTimeLineService = new TruckTimeLineService();
    let getTrucksTimeLine = async () => {
      setTrucks(await truckTimeLineService.getTrucksTimeLine("trucktimeline.json"));
    };
    getTrucksTimeLine();
  }, []);
  return (
    <div>
      <TruckFilter></TruckFilter>
      <div style={{ width: 700, height: 500 }}>
        <TimeLine trucks={trucks} truckHeight={40} truckWidth={20} timeStepWidth={30}></TimeLine>
      </div>
    </div>
  );
}
//export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
/*export default class Home extends React.Component {
  public render() {
    return (
      <div>
        <TruckFilter></TruckFilter>
        <TimeLine></TimeLine>
      </div>
    );
  }
}*/
