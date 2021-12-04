export interface IData {
    portCalls: IDataPortCall[]
    orders: IDataOrders[]
}

export interface IDataPortCall {
    portCallId: number
    arrivingAt: string
    leavingAt: string
    portName: string
}

export interface IDataOrders {
    loading: {
        portCallId: number
        duration: number
    }
    discharging: {
        portCallId: number
        duration: number
    }
    orderId: string
}