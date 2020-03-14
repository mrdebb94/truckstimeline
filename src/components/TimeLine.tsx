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
    offsetX: 0,
    offsetStepX: 0,
    offsetY: 0,
    offsetStepY: 0,
    previousOffsetX: null,
  });

  const timeLineRect: React.MutableRefObject<{ width: number; height: number }> = useRef({
    width: null,
    height: null,
  });

  const dataContainerRect: React.MutableRefObject<{ width: number; height: number }> = useRef({
    width: null,
    height: null,
  });

  const timeWidth = useRef(null);
  const previousOffsetX = useRef(0);
  const previousOffsetStepX = useRef(0);

  const previousOffsetY = useRef(0);
  const previousOffsetStepY = useRef(0);

  useEffect(() => {
    let timeLineClientRect = document.getElementById('timeLineContainer').getBoundingClientRect();
    timeLineRect.current.width = timeLineClientRect.width;
    timeLineRect.current.height = timeLineClientRect.height;

    let dataContainerClientRect = document.getElementById('dataContainer').getBoundingClientRect();
    dataContainerRect.current.width = dataContainerClientRect.width;
    dataContainerRect.current.height = dataContainerClientRect.height;
  }, []);

  useEffect(() => {
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
      setMinDate(new Date(minDate.getTime()));
    }
  }, [props.trucks]);

  const handleMouseDown = useCallback(({ clientX, clientY }) => {
    if (!state.isDragging) {
      setState(state => ({
        ...state,
        isDragging: true,
        origin: {
          x: clientX,
          y: clientY,
        },
      }));
    }
  }, []);

  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      const translation = {
        x: clientX - state.origin.x,
        y: clientY - state.origin.y,
      };

      var timeLineWidth = (timeLineRect.current.width * (100 - props.truckWidth)) / 100;

      let offsetX = (translation.x / timeLineWidth) * 100;
      let offsetY = (translation.y / dataContainerRect.current.height) * 100;

      let offsetStepX =
        previousOffsetStepX.current +
        Math.sign(previousOffsetX.current + offsetX) *
          Math.floor(Math.abs(previousOffsetX.current + offsetX) / props.timeStepWidth);

      offsetX =
        previousOffsetX.current +
        offsetX -
        Math.sign(previousOffsetX.current + offsetX) *
          props.timeStepWidth *
          Math.floor(Math.abs(previousOffsetX.current + offsetX) / props.timeStepWidth);

      setState(state => ({
        ...state,
        translation,
        offsetX,
        offsetStepX,
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
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      previousOffsetX.current = state.offsetX;
      previousOffsetStepX.current = state.offsetStepX;
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

  let fixOrderDate = new Date(minDate.getTime() + state.offsetStepX * 4 * 60 * 60000);
  let fixTimeDate = new Date(minDate.getTime() + -state.offsetStepX * 4 * 60 * 60000);

  return (
    <div
      id="timeLineContainer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        id={'timesContainer'}
        style={{
          marginLeft: `${props.truckWidth}%`,
          display: 'flex',
          overflowX: 'hidden',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            marginLeft: `${-props.timeStepWidth + state.offsetX}%`,
            marginRight: `-${-props.timeStepWidth + state.offsetX}%`,
            width: '100%',
            display: 'flex',
          }}
        >
          {[...Array(timeStepNumber + 1).keys()].map(index => {
            let fixDate = new Date(minDate.getTime() + -state.offsetStepX * 4 * 60 * 60000);
            let increasedDate = new Date(fixDate.getTime());
            let unit = props.timeStepWidth / (4 * 60);

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
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          position: 'relative',
          overflowX: 'hidden',
          overflowY: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}></div>
        <div
          id={'dataContainer'}
          style={{ height: '100%', position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}
        >
          {props.trucks.map(truck => (
            <div key={truck.name} style={{ minHeight: `${props.truckHeight}%`, display: 'flex' }}>
              <div
                className={'truck-name'}
                key={truck.name}
                style={{ width: `${props.truckWidth}%` }}
              >
                {truck.name}
              </div>
              <div
                style={{ flex: 1, position: 'relative', overflowX: 'hidden' }}
                onMouseDown={handleMouseDown}
              >
                {truck.assignedOrder.map(order => {
                  let unit = props.timeStepWidth / (4 * 60);
                  let diff = diff_minutes(order.from, fixTimeDate);
                  if (fixTimeDate.getTime() > order.from.getTime()) {
                    diff *= -1;
                  }
                  let orderTimeLength = diff_minutes(order.to, order.from);

                  return (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${props.timeStepWidth / 2 + state.offsetX + unit * diff}%`,
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
    </div>
  );
}
