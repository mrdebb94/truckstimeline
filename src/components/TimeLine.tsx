import * as React from 'react';
import { useEffect, useState } from 'react';
import { Truck } from '../services/ITruckTimeLineService';

interface ITrucksTimeLineProps {
  trucks: Truck[];
  timeStep?: Date;
  timeStepWidth?: number;
  truckCount?: number;
  truckHeight?: number;
  truckWidth?: number;
}

export function TimeLine(props: ITrucksTimeLineProps) {
  const [minDate, setMinDate] = useState(new Date());
  //const [paddingLeft, setPaddingLeft] = useState(0);
  useEffect(() => {
    console.log(props.trucks);
    if (props.trucks.length > 0) {
      let minDate = new Date(Math.min(...props.trucks.map(
        truck => Math.min.apply(null, truck.assignedOrder.map(order => order.from))))
      );
      console.log(minDate);
      setMinDate(new Date(minDate.getTime()));
      //let clientRect = document.getElementById("trucks").getBoundingClientRect();
      //setPaddingLeft(clientRect.width);
    }
  }, [props.trucks]);

  useEffect(()=>{

  }, []);

  function formatDate(date: Date) {
    return `${(addLeadingZeros(date.getMonth() + 1))}.${addLeadingZeros(date.getDate())} 
    ${addLeadingZeros(date.getHours())} ${addLeadingZeros(date.getMinutes())}`;
  }

  function addLeadingZeros(value: number) {
    return ('0' + value).slice(-2);
  }

  function diff_minutes(dt2:Date, dt1:Date) {
    var diff = (dt2.getTime() - dt1.getTime()) 
    diff /= 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  return (<div id="timeLineContainer" style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%" }}>
    <div style={{ paddingLeft: `${props.truckWidth}%`, display: 'flex', overflowX: 'hidden' }}>{[...Array(20).keys()].map(index => {
      console.log(minDate);
      let increasedDate = new Date(minDate.getTime());
      console.log(increasedDate);
      //4 is hours
      increasedDate.setHours(minDate.getHours() + index * 4);
      return <div style={{
        display: 'flex', minWidth: `${props.timeStepWidth}%`,
        whiteSpace: 'nowrap', justifyContent: 'center', alignItems: 'center'
      }} key={index}>
        {formatDate(increasedDate)}</div>
    })}</div>
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column'}}>
      {props.trucks.map(truck =>
        (<div style={{ minHeight: `${props.truckHeight}%`, display: 'flex' }}>
          <div className={"truck-name"} key={truck.name} style={{ width: `${props.truckWidth}%` }}>
            {truck.name}
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            {truck.assignedOrder.map(order => {
              console.log(order);
              let initialOffset = Math.floor(props.timeStepWidth / 2);
              let unit = props.timeStepWidth / (4 * 60);
              let diff = diff_minutes(minDate,order.from);
              let orderTimeLength = diff_minutes(order.to, order.from)
              console.log(diff);
              return <div style={{ position: 'absolute', left:`${initialOffset + unit*diff}%`, 
              width:`${unit*orderTimeLength}%`, backgroundColor:'blue' }}
              key={order.id}>{order.id}</div>
            })}
          </div>
        </div>))
      }
    </div>
  </div>)
}