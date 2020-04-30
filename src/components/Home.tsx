import * as React from "react";
import { useState, useEffect } from 'react';

import { TruckFilter } from "./TruckFilter";
import { TimeLine } from "./TimeLine/TimeLine";
import { TruckTimeLineService } from "../services/TruckTimeLineService";

export default function Home(): React.ReactElement {
  const [trucks, setTrucks] = useState([]);
  useEffect(() => {
    const truckTimeLineService = new TruckTimeLineService();
    const getTrucksTimeLine = async (): Promise<void> => {
      setTrucks(await truckTimeLineService.getTrucksTimeLine("trucktimeline.json"));
    };
    getTrucksTimeLine();
  }, []);
  return (
    <div>
      <TruckFilter></TruckFilter>
      <div style={{ width: 700, height: 500 }}>
        <TimeLine trucks={trucks} truckHeight={20} truckWidth={20} timeStepWidth={30}></TimeLine>
      </div>
    </div>
  );
}
