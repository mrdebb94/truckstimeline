import { ITrucksTimeLineService, TrucksTimeLineResponse, Truck, TruckResponse } from "./ITruckTimeLineService";

export class TruckTimeLineService implements ITrucksTimeLineService {
    async getTrucksTimeLine(url: string): Promise<Truck[]> {
        try {
            let trucksTimeLineResponse = await fetch(url);
            let trucksTimeLine = await trucksTimeLineResponse.json() as TrucksTimeLineResponse;
            let trucks: Truck[] = trucksTimeLine.trucks.map((truckTimeLine: TruckResponse) => ({
                name: truckTimeLine.name,
                assignedOrder: trucksTimeLine
                    .orders
                    .filter(order => truckTimeLine.assignedOrderId.indexOf(order.id)!=-1)
                    .map(order=>({
                        id: order.id,
                        from: new Date(order.from),
                        to: new Date(order.to)
                    }))
            }) as Truck);

            return trucks;
        } catch (e) {
            throw e;
        }
    }
}