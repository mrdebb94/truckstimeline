import * as React from 'react';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Truck } from '../services/ITruckTimeLineService';

interface ITrucksTimeLineProps {
  trucks: Truck[];
  timeStep?: Date;
  timeStepWidth?: number;
  truckCount?: number;
  truckHeight?: number;
  truckWidth?: number;
}

const POSITION = { x: 0, y: 0 };

export function TimeLine(props: ITrucksTimeLineProps) {
  const [minDate, setMinDate] = useState(new Date());
  const [state, setState] = useState({
    isDragging: false,
    origin: POSITION,
    translation: POSITION,
  });
  const timeLineRect =  useRef({width:null});
  //const [paddingLeft, setPaddingLeft] = useState(0);
  useEffect(() => {
    let clientRect = document.getElementById("timeLineContainer").getBoundingClientRect();
    //timeLineRect.width = clientRect.width;
  }, []);
  useEffect(() => {
    console.log(props.trucks);
    if (props.trucks.length > 0) {
      let minDate = new Date(
        Math.min(
          ...props.trucks.map(truck =>
            Math.min.apply(
              null,
              truck.assignedOrder.map(order => order.from),
            ),
          ),
        ),
      );
      console.log(minDate);
      setMinDate(new Date(minDate.getTime()));
      //let clientRect = document.getElementById("trucks").getBoundingClientRect();
      //setPaddingLeft(clientRect.width);
    }
  }, [props.trucks]);

  const handleMouseDown = useCallback(({ clientX, clientY }) => {
    console.log(state.isDragging);
    if (!state.isDragging) {
      setState(state => ({
        ...state,
        isDragging: true,
        origin: { x: clientX, y: clientY },
      }));
    }
  }, []);

  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      const translation = { x: clientX - state.origin.x, y: clientY - state.origin.y };
      console.log(translation);
      setState(state => ({
        ...state,
        translation,
      }));
    },
    [state.origin],
  );

  const handleMouseUp = useCallback(() => {
    setState(state => ({
      ...state,
      isDragging: false,
    }));
  }, []);

  useEffect(() => {
    if (state.isDragging) {
      console.log("Subscribe");
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      console.log("Unsubscribe");
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      setState(state => ({ ...state, translation: { x: 0, y: 0 } }));
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp]);

  const timeStepNumber = useMemo(() => Math.ceil(100 / props.timeStepWidth), [props.timeStepWidth]);

  function formatDate(date: Date) {
    return `${addLeadingZeros(date.getMonth() + 1)}.${addLeadingZeros(date.getDate())} 
    ${addLeadingZeros(date.getHours())} ${addLeadingZeros(date.getMinutes())}`;
  }

  function addLeadingZeros(value: number) {
    return ('0' + value).slice(-2);
  }

  function diff_minutes(dt2: Date, dt1: Date) {
    var diff = dt2.getTime() - dt1.getTime();
    diff /= 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  return (
    <div
      id="timeLineContainer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        flexShrink: 0,
      }}
    >
      <div style={{ paddingLeft: `${props.truckWidth}%`, display: 'flex', overflowX: 'hidden' }}>
        {[...Array(timeStepNumber).keys()].map(index => {
          //console.log(minDate);
          let increasedDate = new Date(minDate.getTime());
          //console.log(increasedDate);
          //4 is hours
          increasedDate.setHours(minDate.getHours() + index * 4);
          return (
            <div
              style={{
                display: 'flex',
                minWidth: `${props.timeStepWidth}%`,
                whiteSpace: 'nowrap',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              key={index}
            >
              {formatDate(increasedDate)}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', position:'relative' }}>
        {/* TODO: this absolute div maybe not needed*/}
        <div style={{position:'absolute', width: "100%", height: "100%"}}></div>
        {props.trucks.map(truck => (
          <div key={truck.name} style={{ minHeight: `${props.truckHeight}%`, display: 'flex' }}>
            <div
              className={'truck-name'}
              key={truck.name}
              style={{ width: `${props.truckWidth}%` }}
            >
              {truck.name}
            </div>
            <div style={{ flex: 1, position: 'relative' }} onMouseDown={handleMouseDown}>
              {truck.assignedOrder.map(order => {
                //console.log(order);
                let initialOffset = Math.floor(props.timeStepWidth / 2);
                let unit = props.timeStepWidth / (4 * 60);
                let diff = diff_minutes(minDate, order.from);
                let orderTimeLength = diff_minutes(order.to, order.from);
                //console.log(diff);
                return (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${initialOffset + unit * diff}%`,
                      width: `${unit * orderTimeLength}%`,
                      backgroundColor: 'blue',
                    }}
                    key={order.id}
                  >
                    {order.id}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
