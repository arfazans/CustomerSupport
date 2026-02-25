import { io } from 'socket.io-client';


const URL = 'http://localhost:9860'

export function connectWS()  {
 return io(URL, {
    withCredentials: true,  // ensure credentials if you use cookies
  });}