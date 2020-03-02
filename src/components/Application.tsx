import * as React from 'react';
import {useEffect, useState} from 'react';
import { TruckTimeLineService } from '../services/TruckTimeLineService';


function Application(props:any) {
    /*const [trucksTimeLine, setTrucksTimeLine] = useState({});
    useEffect(()=>{
      let truckTimeLineService = new TruckTimeLineService();
      let getTrucksTimeLine = async () => {
        setTrucksTimeLine(await truckTimeLineService.getTrucksTimeLine("trucktimeline.json"));
      };
      getTrucksTimeLine();
    }, []);
    console.log(trucksTimeLine);*/
    return <div>{props.children}</div>;
  };
export default Application;
