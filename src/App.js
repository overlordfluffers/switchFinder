import React, {useEffect, useMemo} from 'react';
import ReactCountdownClock from 'react-countdown-clock'
import './App.css';
import axios from 'axios'

function App() {
  const [seconds, setSeconds] = React.useState(10*60)
  const [distance, setDistance] = React.useState('50')
  const [zipcode, setZipcode] = React.useState('01864')
  const [stores, setStores] = React.useState([])


  //RedBlue: 77464001
  //Grey: 77464002
  const fetchData = () => {
    setSeconds(seconds+0.0000001)
    axios.get(`https://thingproxy.freeboard.io/fetch/https://api.target.com/fulfillment_aggregator/v1/fiats/77464002?key=eb2551e4accc14f38cc42d32fbc2b2ea&nearby=${zipcode}&limit=20&requested_quantity=1&radius=${distance}&include_only_available_stores=true&fulfillment_test_mode=grocery_opu_team_member_test`, {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      responseType: 'json',
    }).then((e)=>{
      setStores(e.data.products[0].locations);
    }).then(
    axios.get(`https://thingproxy.freeboard.io/fetch/https://api.target.com/fulfillment_aggregator/v1/fiats/77464001?key=eb2551e4accc14f38cc42d32fbc2b2ea&nearby=${zipcode}&limit=20&requested_quantity=1&radius=${distance}&include_only_available_stores=true&fulfillment_test_mode=grocery_opu_team_member_test`, {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      responseType: 'json',
    }).then((e)=>{
      setStores(stores.concat(e.data.products[0].locations));
    }))
  }

  useMemo(()=>{
    fetchData()
  },[])

  return (
    <div className="App">
      <div className={'clock'}>
        <ReactCountdownClock seconds={seconds} color="#90EE90" alpha={0.9} size={250} onComplete={()=>{fetchData()}} />
      </div>
      <div className={'settings'}>
        <div className={'input'}>
          <div>{"Distance: "}</div>
          <input type={'text'} value={distance} onChange={(event)=>{setDistance(event.target.value)}}/>
        </div>
        <div className={'input'}>
          <div>{"Zip Code: "}</div>
          <input type={'text'} value={zipcode} onChange={(event)=>{setZipcode(event.target.value)}}/>
        </div>
        <div className={'input'}>
          <div>{"Time: "}</div>
          <input type={'text'} value={Math.floor(seconds/60)} onChange={(event)=>{setSeconds(event.target.value*60)}}/>
        </div>
        <button onClick={()=>{fetchData()}}> Refresh Nerd </button>
      </div>
      <div className={'results'}>
        {stores.map((store)=>{
          return (
            <div>
              <div>{"City: "+store.store_name}</div>
              <div>{"Address: "+store.store_address}</div>
              <div>{"Distance: "+store.distance+"mi"}</div>
              <div>{"Available*: "+store.location_available_to_promise_quantity}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
