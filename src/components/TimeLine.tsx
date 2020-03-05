import * as React from 'react';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Truck } from '../services/ITruckTimeLineService';
import { number } from 'prop-types';
import { ProvidePlugin } from 'webpack';

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
    offsetX: -props.timeStepWidth,
    offsetStep: 0,
  });
  const timeLineRect: React.MutableRefObject<{ width: number; height: number }> = useRef({
    width: null,
    height: null,
  });
  const truckRect: React.MutableRefObject<{ width: number; height: number }> = useRef({
    width: null,
    height: null,
  });
  const timeWidth = useRef(null);
  //const [paddingLeft, setPaddingLeft] = useState(0);
  useEffect(() => {
    let timeLineClientRect = document.getElementById('timeLineContainer').getBoundingClientRect();
    //timeLineRect.width = clientRect.width;
    timeLineRect.current.width = timeLineClientRect.width;
    timeLineRect.current.height = timeLineClientRect.height;
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

      /*let offsetY = Math.round((translation.y / timeLineRect.current.height) * 100);
      var timeLineWidth = timeLineRect.current.width * (100 - props.truckWidth) / 100;
      let offsetX = Math.round((translation.x / timeLineWidth) * 100);
      console.log(offsetX + " " + offsetY);*/

      var timeLineWidth = (timeLineRect.current.width * (100 - props.truckWidth)) / 100;
      //let offsetX = Math.round((state.translation.x / timeLineWidth) * 100);
      //let offsetX = state.offsetX + (translation.x / timeLineWidth) * 100;
      let offsetX = (translation.x / timeLineWidth) * 100;

      //-1 the initial step
      //TODO: state.offsetStep replace some useRef value, or it's needed here?
      let offsetStep =
        state.offsetStep + Math.sign(offsetX) * Math.floor(Math.abs(offsetX) / props.timeStepWidth);
      offsetStep = offsetStep * -1;
      console.log(offsetStep);

      //offsetX = state.offsetX + offsetX;

      console.log(offsetX);
      console.log(Math.sign(offsetX) * Math.floor(Math.abs(offsetX) / (2 * props.timeStepWidth)));
      console.log(
        offsetX -
          Math.sign(offsetX) *
            props.timeStepWidth *
            Math.floor(Math.abs(offsetX) / props.timeStepWidth),
      );

      //TODO:state.offsetX should be replaced some useRef value, because it's snapshotted
      offsetX =
        state.offsetX +
        offsetX -
        Math.sign(offsetX) *
          props.timeStepWidth *
          Math.floor(Math.abs(offsetX) / props.timeStepWidth);

      /*offsetX =
        state.offsetX +
        offsetX -
        Math.sign(offsetX) *
          (2 * props.timeStepWidth) *
          Math.floor(Math.abs(offsetX) / (2 * props.timeStepWidth));*/

      //TODO: 4*60
      console.log(new Date(minDate.getTime() + offsetStep * 4 * 60 * 60000));

      setState(state => ({
        ...state,
        translation,
        offsetX,
        offsetStep,
      }));
    },
    [state.origin],
  );

  function getOffsetX() {
    //if (state.isDragging) {
    var timeLineWidth = (timeLineRect.current.width * (100 - props.truckWidth)) / 100;
    //let offsetX = Math.round((state.translation.x / timeLineWidth) * 100);
    let offsetX = (state.translation.x / timeLineWidth) * 100;

    //-1 the initial step
    let offsetStep =
      -1 + -1 * Math.sign(offsetX) * Math.floor(Math.abs(offsetX) / props.timeStepWidth);
    //console.log(offsetStep);

    //TODO: 4*60
    //console.log(new Date(minDate.getTime() + offsetStep * 4 * 60 * 60000));

    return offsetX;
  }

  const handleMouseUp = useCallback(() => {
    setState(state => ({
      ...state,
      isDragging: false,
    }));
  }, []);

  useEffect(() => {
    if (state.isDragging) {
      console.log('Subscribe');
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      console.log('Unsubscribe');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      //setState(state => ({ ...state, translation: { x: 0, y: 0 } }));
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
        /*,flexShrink: 0,*/
      }}
    >
      {/* { paddingLeft: `${props.truckWidth}%`, display: 'flex', overflowX: 'hidden' } */}
      <div
        id={'timesContainer'}
        style={{
          marginLeft: `${props.truckWidth}%`,
          display: 'flex',
          overflowX: 'hidden',
          flexShrink: 0,
        }}
      >
        {/*  overflowX: 'hidden' */}
        <div
          style={{
            marginLeft: `${state.offsetX}%`,
            marginRight: `-${state.offsetX}%`,
            width: '100%',
            display: 'flex',
          }}
        >
          {/* timeStepNumber + 1*/}
          {[...Array(timeStepNumber + 1).keys()].map(index => {
            //console.log(minDate);
            //let increasedDate = new Date(minDate.getTime());
            //console.log(new Date(minDate.getTime() + state.offsetStep * 4 * 60 * 60000));
            let fixDate = new Date(minDate.getTime() + state.offsetStep * 4 * 60 * 60000);
            let increasedDate = new Date(fixDate.getTime());
            let unit = props.timeStepWidth / (4 * 60);
            let offsetMinute = getOffsetX() / unit;

            //console.log(Math.floor(offsetMinute / (4 * 60)));
            //4 is hours
            //increasedDate.setHours(minDate.getHours() + (index - 1) * 4);
            //after 4 hours
            increasedDate.setHours(fixDate.getHours() + (index - 1) * 4);
            return (
              <div
                style={{
                  display: 'flex',
                  minWidth: `${props.timeStepWidth}%`,
                  maxWidth: `${props.timeStepWidth}%`,
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
      </div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', position: 'relative', overflowX:'hidden', overflowY:'hidden' }}>
        {/* TODO: this absolute div maybe not needed*/}
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}></div>
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
                      /*left: `${initialOffset + unit * diff}%`,*/
                      left: `${state.offsetX + unit * diff}%`,
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
