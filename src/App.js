import { useState } from 'react';

function App() {
  const [IP, setIP] = useState("");
  const [mask, setMask] = useState("");
  const [networkID, setNetworkID] = useState("");
  const [hostID, setHostID] = useState("");
  const [broadcastID, setBroadcastID] = useState("");
  const [error, setError] = useState("");

  const validateInput = e => {
    e.preventDefault();

    const IPRegex = /^(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(?!$)|$)){4}$/g;
    if (IP.match(IPRegex) === null) {
      setError("Неправильный IP");
      return;
    }
    if (mask.match(IPRegex) === null) {
      setError("Неправильная маска");
      return;
    }

    let IPBinary = "";
    IP.split(".").forEach((byte, index) => {
      IPBinary += parseInt(byte).toString(2).padStart(8, '0');
    });
    let maskBinary = "";
    mask.split(".").forEach((byte, index) => {
      maskBinary += parseInt(byte).toString(2).padStart(8, '0');
    });
    
    if (maskBinary.split("1").filter( element => element !== "" ).length !== 1) {
      setError("Неправильная маска");
      return;
    }
    if (maskBinary[0] === "0") {
      setError("Неправильная маска");
      return;
    }

    let networkIdBinary = [...IPBinary].map((bit, index) => {
      if (maskBinary[index] === "1") {
        return bit;
      }
      
      return "0";
    }).join("");
    const networkIdBinaryArray = networkIdBinary.match(/.{1,8}/g);
    setNetworkID(networkIdBinaryArray.map(byte => parseInt(byte, 2)).join("."));
    let broadcastIDBinary = [...IPBinary].map((bit, index) => {
      if (maskBinary[index] === "1") {
        return bit;
      }
      
      return "1";
    }).join("");
    const broadcastIDBinaryArray = broadcastIDBinary.match(/.{1,8}/g);
    setBroadcastID(broadcastIDBinaryArray.map(byte => parseInt(byte, 2)).join("."));
    let hostIDBinary = [...IPBinary].map((bit, index) => {
      if (maskBinary[index] === "0") {
        return bit;
      }
      
      return "0";
    }).join("");
    const hostIDBinaryArray = hostIDBinary.match(/.{1,8}/g);
    setHostID(hostIDBinaryArray.map(byte => parseInt(byte, 2)).join("."));

    setError("");
  };

  return (
      <div className="w-screen h-screen flex flex-col justify-center items-center text-2xl font-bold">
        <div className="m-2">
          IP-калькулятор
        </div>
        {error !== "" ? <div className="text-red-500 m-2">
          {error}
        </div> : null}
        <form onSubmit={validateInput}>
          <div className="flex items-center w-80 h-12 m-2 shadow-2xl outline-none border-4 border-black rounded-md font-normal">
            <input 
              type="text"
              className="ml-4 outline-none"
              placeholder="IP-адрес"
              value={IP}
              onChange={ e => setIP(e.target.value) }
            />
          </div>
          <div className="flex items-center w-80 h-12 m-2 shadow-2xl outline-none border-4 border-black rounded-md font-normal">
            <input
              type="text"
              className="ml-4 outline-none"
              placeholder="Маска подсети"
              value={mask}
              onChange={ e => setMask(e.target.value) }
            />
          </div>
          <input 
            type="submit"
            className="flex items-center justify-center w-80 h-12 m-2 shadow-2xl outline-none border-4 border-black rounded-md cursor-pointer text-white bg-black"
            placeholder="Маска подсети"
            value="Расчитать"
          />
        </form>
        {(hostID !== "" && hostID !== networkID && hostID !== broadcastID)? <div className="m-2">
          Host ID: {hostID}
        </div> : null}
        {networkID !== "" ? <div className="m-2">
          Network ID: {networkID}
        </div> : null}
        {broadcastID !== "" ? <div className="m-2">
          Broadcast ID: {broadcastID}
        </div> : null}
      </div> 
  );
}

export default App;
