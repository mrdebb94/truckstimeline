import * as React from 'react';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Truck, Order } from '../../services/ITruckTimeLineService';
import TimeLineHeader from './TimeLineHeader';
import { useEventCallback } from '../../hooks/useEventCallback';

export interface TrucksTimeLineProps {
  trucks: Truck[];
  timeStep?: Date;
  timeStepWidth?: number;
  truckCount?: number;
  truckHeight?: number;
  truckWidth?: number;
}

const POSITION = { x: 0, y: 0 };

function calculateOffsetStepValue(previousOffsetStepValue: number, previousOffsetDimensionValue: number,
  currentOffsetDimensionValue: number, offsetUnit: number): number {
  const offsetStepValue =
    previousOffsetStepValue -
    Math.sign(previousOffsetDimensionValue + currentOffsetDimensionValue) *
    Math.floor(Math.abs(previousOffsetDimensionValue + currentOffsetDimensionValue) / offsetUnit);
  return offsetStepValue;
};

function calculateOffsetDimensionValue(previousOffsetDimensionValue: number,
  currentOffsetDimensionValue: number, offsetUnit: number): number {
  const offsetDimensionValue = previousOffsetDimensionValue +
    currentOffsetDimensionValue -
    Math.sign(previousOffsetDimensionValue + currentOffsetDimensionValue) *
    offsetUnit *
    Math.floor(Math.abs(previousOffsetDimensionValue + currentOffsetDimensionValue) / offsetUnit);
  return offsetDimensionValue;
}


export function TimeLine(props: TrucksTimeLineProps): React.ReactElement {
  const [minDate, setMinDate] = useState(new Date());
  const [state, setState] = useState({
    isDragging: false,
    origin: POSITION,
    translation: POSITION,
    offsetX: 0,
    offsetStepX: 0,
    offsetY: 0,
    offsetStepY: 0
  });

  const timeLineRect: React.MutableRefObject<{ width: number; height: number }> = useRef({
    width: null,
    height: null,
  });

  const dataContainerRect: React.MutableRefObject<{ width: number; height: number }> = useRef({
    width: null,
    height: null,
  });

  const previousOffsetX = useRef(0);
  const previousOffsetStepX = useRef(0);

  const previousOffsetY = useRef(0);
  const previousOffsetStepY = useRef(0);

  useEffect(() => {
    const timeLineClientRect = document.getElementById('timeLineContainer').getBoundingClientRect();
    timeLineRect.current.width = timeLineClientRect.width;
    timeLineRect.current.height = timeLineClientRect.height;

    const dataContainerClientRect = document.getElementById('dataContainer').getBoundingClientRect();
    dataContainerRect.current.width = dataContainerClientRect.width;
    dataContainerRect.current.height = dataContainerClientRect.height;
  }, []);

  useEffect(() => {
    if (props.trucks.length > 0) {
      const minDate = new Date(
        Math.min(
          ...props.trucks.map((truck: Truck) =>
            Math.min.apply(
              null,
              truck.assignedOrder.map((order: Order) => order.from),
            ),
          ),
        ),
      );
      setMinDate(new Date(minDate.getTime()));
    }
  }, [props.trucks]);

  const handleMouseDown = useEventCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const { clientX, clientY } = event;

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

  const handleMouseMove = useEventCallback(
    ({ clientX, clientY }: { clientX: number; clientY: number }) => {
      const translation = {
        x: clientX - state.origin.x,
        y: state.origin.y - clientY,
      };

      const timeLineWidth = (timeLineRect.current.width * (100 - props.truckWidth)) / 100;

      let offsetX = (translation.x / timeLineWidth) * 100;
      let offsetY = (translation.y / dataContainerRect.current.height) * 100;

      const offsetStepX = calculateOffsetStepValue(previousOffsetStepX.current,
        previousOffsetX.current, offsetX, props.timeStepWidth);

      offsetX = calculateOffsetDimensionValue(previousOffsetX.current, offsetX, props.timeStepWidth);

      const offsetStepY = calculateOffsetStepValue(previousOffsetStepY.current, previousOffsetY.current,
        offsetY, props.truckHeight);

      offsetY = calculateOffsetDimensionValue(previousOffsetY.current, offsetY, props.truckHeight);

      setState(state => ({
        ...state,
        translation,
        offsetX,
        offsetStepX,
        offsetY,
        offsetStepY,
      }));
    },
    [state.origin, props.truckWidth, props.truckHeight, props.timeStepWidth],
  );

  const handleMouseUp = useEventCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    previousOffsetX.current = state.offsetX;
    previousOffsetStepX.current = state.offsetStepX;

    previousOffsetY.current = state.offsetY;
    previousOffsetStepY.current = state.offsetStepY;

    setState(state => ({
      ...state,
      isDragging: false,
    }));
  }, [state.offsetX, state.offsetY, state.offsetStepX, state.offsetStepY]);

  useEffect(() => {
    if (state.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp]);

  const objectsNumber = useMemo(() => Math.ceil(100 / props.truckHeight), [props.truckHeight]);

  function diffMinutes(dt2: Date, dt1: Date): number {
    let diff = dt2.getTime() - dt1.getTime();
    diff /= 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  const fixTimeDate = new Date(minDate.getTime() + state.offsetStepX * 4 * 60 * 60000);
  const offsetStepY = Math.max(0, state.offsetStepY);

  return (
    <div
      id="timeLineContainer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    > <TimeLineHeader timeStepWidth={props.timeStepWidth} truckWidth={props.truckWidth} offsetX={state.offsetX}
      offsetStepX={state.offsetStepX} minDate={minDate} />
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
          style={{
            height: '100%',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: `${state.offsetY}%`,
          }}
        >
          {props.trucks.slice(offsetStepY, offsetStepY + objectsNumber + 1).map(truck => (
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
                {truck.assignedOrder.map((order: any) => {
                  const unit = props.timeStepWidth / (4 * 60);
                  let diff = diffMinutes(order.from, fixTimeDate);
                  if (fixTimeDate.getTime() > order.from.getTime()) {
                    diff *= -1;
                  }
                  const orderTimeLength = diffMinutes(order.to, order.from);

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
