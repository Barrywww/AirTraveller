import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = "http://localhost:3000/api"

export const searchFlights = payload => {
  return axios.post("/api/customer/flights", payload)
}

export const purchaseTicket = payload => {
  return axios.post("api/customer/purchase", payload)
}
