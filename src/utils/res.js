import {Space} from "antd";
import React from "react";

function handlePurchaseWithParam(records){
    console.log(records);
}

const destColumns = [
    {
        title: 'City',
        dataIndex: 'airport_city',
        key: 'airport_city',
    },
    {
        title: 'Airport',
        dataIndex: 'airport_name',
        key: 'airport_name',
    },
    {
        title: 'Purchases',
        dataIndex: 'purchases',
        key: 'purchases',
    }
]

const agentColumnsPur = [
    {
        title: 'Agent ID',
        dataIndex: 'booking_agent_id',
        key: 'booking_agent_id',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Purchases',
        dataIndex: 'purchases',
        key: 'purchases',
    }
]

const agentColumnsCom = [
    {
        title: 'Agent ID',
        dataIndex: 'booking_agent_id',
        key: 'booking_agent_id',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Commission',
        dataIndex: 'commission',
        key: 'commission',
    }
]

const airplaneColumns = [
    {
        title: 'Airline Name',
        dataIndex: 'airlineName',
        key: 'airlineName',
    },
    {
        title: 'Airplane ID',
        dataIndex: 'airplaneID',
        key: 'airplaneID',
    },
    {
        title: 'Seats',
        dataIndex: 'seats',
        key: 'seats',
    }
];

const airportColumns = [
    {
    title: 'Airport Name',
    dataIndex: 'airportName',
    key: 'airportName',
    },
    {
        title: 'Airport City',
        dataIndex: 'airportCity',
        key: 'airportCity',
    }
];

const staffFlightColumns = [
    {
        title: 'Airline',
        dataIndex: 'airline_name',
        key: 'airline_name',
    },
    {
        title: 'Flight',
        dataIndex: 'flight_num',
        key: 'flight_num',
    },
    {
        title: 'Origin',
        dataIndex: 'departure_airport',
        key: 'departure_airport',
    },
    {
        title: 'Destination',
        key: 'arrival_airport',
        dataIndex: 'arrival_airport',
    },
    {
        title: 'Departure Time',
        key: 'departure_time',
        dataIndex: 'departure_time',
    },
    {
        title: "Arrival Time",
        key: "arrival_time",
        dataIndex: "arrival_time",
    },
    {
        title: "Airplane ID",
        key: "airplane_id",
        dataIndex: "airplane_id",
    },
    {
        title: "Price",
        key: "price",
        dataIndex: "price",
    },
    {
        title: "Status",
        key: "status",
        dataIndex: "status",
    },
]

const agentFlightColumns = [
    {
        title: 'Airline',
        dataIndex: 'airline_name',
        key: 'airline_name',
    },
    {
        title: 'Flight',
        dataIndex: 'flight_num',
        key: 'flight_num',
    },
    {
        title: 'Origin',
        dataIndex: 'departure_airport',
        key: 'departure_airport',
    },
    {
        title: 'Destination',
        key: 'arrival_airport',
        dataIndex: 'arrival_airport',
    },
    {
        title: 'Departure Time',
        key: 'departure_time',
        dataIndex: 'departure_time',
    },
    {
        title: "Arrival Time",
        key: "arrival_time",
        dataIndex: "arrival_time",
    }
];

const topCustomerColumnsPur = [
    {
        title: 'Email',
        dataIndex: 'customer_email',
        key: 'customer_email',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: "Phone Number",
        key: "phone_number",
        dataIndex: "phone_number",
    },
    {
        title: "Total Purchases",
        key: "books",
        dataIndex: "books",
    }
];

const topCustomerColumnsCom = [
    {
        title: 'Email',
        dataIndex: 'customer_email',
        key: 'customer_email',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: "Phone Number",
        key: "phone_number",
        dataIndex: "phone_number",
    },
    {
        title: "Commission",
        key: "commission",
        dataIndex: "commission",
    }
];
export {destColumns, agentColumnsCom, agentColumnsPur,
        airplaneColumns, airportColumns, staffFlightColumns, agentFlightColumns,
        topCustomerColumnsPur, topCustomerColumnsCom}
// export default agentflightColumns