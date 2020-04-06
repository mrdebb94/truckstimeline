import { TrucksTimeLineService, TrucksTimeLineResponse, Truck, TruckResponse } from "./ITruckTimeLineService";

export class TruckTimeLineService implements TrucksTimeLineService {
    async getTrucksTimeLine(url: string): Promise<Truck[]> {
        const trucksTimeLineResponse = await fetch(url);
        const trucksTimeLine = await trucksTimeLineResponse.json() as TrucksTimeLineResponse;
        const trucks: Truck[] = trucksTimeLine.trucks.map((truckTimeLine: TruckResponse) => ({
            name: truckTimeLine.name,
            assignedOrder: trucksTimeLine
                .orders
                .filter(order => truckTimeLine.assignedOrderId.indexOf(order.id) != -1)
                .map(order => ({
                    id: order.id,
                    from: new Date(order.from),
                    to: new Date(order.to)
                }))
        }) as Truck);

        return trucks;
    }
}