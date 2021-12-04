import moment from 'moment'
import React from 'react'
import _ from 'lodash'
import { IData } from '../../types/types'

import './styles.css'

interface ISheduleProps {
    data: IData
}

interface ScheduleTable {
    id: string
    event: string
    port: string
    orderId: string
    startDate: string
    endDate: string
    duration: number
}

const Schedule: React.FC<ISheduleProps> = props => {
    const scheduleTable: ScheduleTable[] = []

    const sortedPorts = props.data.portCalls.map(el => {
        return {
           ...el,
           arrivingAt: moment(el.arrivingAt),
           leavingAt: moment(el.leavingAt)
        }
    }).sort((a, b) => a.arrivingAt.diff(b.arrivingAt))


    sortedPorts.forEach((port, i) => {
        let newRow: ScheduleTable | undefined = undefined
        const lastDate = port.arrivingAt.clone()

        props.data.orders.forEach(order => {
            //Loading
            if (order.loading.portCallId === port.portCallId) {
                newRow = {
                    id: _.uniqueId(),
                    event: 'Loading',
                    port: port.portName,
                    orderId: order.orderId,
                    startDate: lastDate.format(),
                    endDate: lastDate.add(order.loading.duration, 'ms').format(),
                    duration: lastDate.diff(lastDate.clone().subtract(order.loading.duration, 'ms'), 'h'),
                }
                scheduleTable.push(newRow)
            }

            //Discharging
            if (order.discharging.portCallId === port.portCallId) {
                newRow = {
                    id: _.uniqueId(),
                    event: 'Discharging',
                    port: port.portName,
                    orderId: order.orderId,
                    startDate: lastDate.format(),
                    endDate: lastDate.add(order.discharging.duration, 'ms').format(),
                    duration: lastDate.diff(lastDate.clone().subtract(order.discharging.duration, 'ms'), 'h'),
                }
                scheduleTable.push(newRow)
            }
        })

        //Idle
        const nextPort = sortedPorts[i+1]
        if (nextPort && lastDate.isBefore(port.leavingAt)) {
            newRow = {
                id: _.uniqueId(),
                event: 'Idle',
                port: port.portName,
                orderId: '',
                startDate: lastDate.format(),
                endDate: port.leavingAt.format(),
                duration: port.leavingAt.diff(lastDate, 'h'),
            }
            scheduleTable.push(newRow)
        }

        //Lahden
        if (nextPort && port.leavingAt.isBefore(sortedPorts[i+1].arrivingAt)) {
            newRow = {
                id: _.uniqueId(),
                event: 'Lahden',
                port: '',
                orderId: '',
                startDate: port.leavingAt.format(),
                endDate: nextPort.arrivingAt.format(),
                duration: nextPort.arrivingAt.diff(port.leavingAt, 'h'),
            }
            scheduleTable.push(newRow)
        }

        newRow = undefined
    })

    return (
        <div className="schedule">
            <table className="schedule__table">
                <thead className="schedule__table-head">
                    <tr>
                        <th>Event</th>
                        <th>Port name</th>
                        <th>Order Id</th>
                        <th>Started at</th>
                        <th>Ended at</th>
                        <th>Duration (h)</th>
                    </tr>
                </thead>
                <tbody className="schedule__table-body">
                    {
                        scheduleTable.map((el, i) => {
                            return (
                                <tr key={el.id}>
                                    <td>{el.event}</td>
                                    <td>{el.port}</td>
                                    <td>{el.orderId}</td>
                                    <td>{el.startDate}</td>
                                    <td>{el.endDate}</td>
                                    <td>{el.duration}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Schedule