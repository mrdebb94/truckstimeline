export interface Order {
    id: string;
    from: Date;
    to: Date;
}

export interface TruckResponse {
    name: string;
    assignedOrderId: string[];
}

export interface Truck {
    name: string;
    assignedOrder: Order[];
}

export interface TrucksTimeLineResponse {
    trucks: TruckResponse[];
    orders: Order[];
}

export interface TrucksTimeLineService {
    getTrucksTimeLine(url: string): Promise<Truck[]>;
}