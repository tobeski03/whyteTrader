"use strict"; // numpy_and_numjs_compare.js
let http = require("http");
let fs = require("fs");
const python = require("python-bridge"); // https://www.npmjs.com/package/python-bridge
const nj = require("numjs"); // www.npmjs.com/package/numjs

const py = python(); // return value
let {
  ex, // no return value
  end,
} = py;

// <Python Modules>
ex`import MetaTrader5 as mt`;
ex`import pandas as pd`;
ex`import plotly.express as px`;
ex`from datetime import datetime, timedelta`;
ex`import numpy as np`;
ex`import pandas`;

// </>
let login = 5197033;
let password = "Adejugbe1.";
let server = "Deriv-Demo";
function fromPython(pycode = {}) {
  return JSON.stringify(pycode);
}

function toJavaScript(pystr = "") {
  return JSON.parse(pystr);
}

function fromPy(pycode = {}) {
  return toJavaScript(fromPython(pycode));
}

async function pyscript() {
  try {
    fromPy(await py`mt.initialize()`);

    fromPy(await py`mt.login(${login}, ${password}, ${server})`);

    //  #get account info
    let account_info = fromPy(await py`mt.account_info()._asdict()`);
    let num_orders = fromPy(await py`mt.orders_total()`);
    let num_positions = fromPy(await py`mt.positions_total()`);
    // let num_order_history = fromPy(
    //   await py`mt.history_orders_total(datetime.now(), datetime.now()`
    // );
    console.log("name:", account_info.name);
    console.log("Balance:", account_info.balance);
    console.log("Profit:", account_info.profit);
    console.log("Pending orders :", num_orders);
    console.log("Total Number of Live Trades:", num_positions);
    // console.log("Total Number of trades today:", num_order_history);
    // If you want, use POSIX command line with $time after you read manual for that $man time
    // and tweak the example here

    // Test here is to compare time taken to assign return values to variables

    // console.log(new Date());
    // let testnumpy = fromPy(await py`np.arange(1000).reshape(50, 20).tolist()`);
    // console.log(testnumpy);
    // console.log(new Date()); // 1.8 ~ 2 seconds

    // console.log(new Date());
    // let testnumjs = nj.arange(1000).reshape(50, 20).tolist();
    // console.log(new Date()); // About 0.05 seconds

    let onlineserver = http.createServer(function (req, res) {
      console.log("request was made:" + req.url);
      res.writeHead(200, { "Content-Type": "application/json" });
      let myobj = {
        name: account_info.name,
        balance: account_info.balance,
        profit: account_info.profit,
        liveTrades: num_positions,
        pendingTrades: num_orders,
      };
      res.end(JSON.stringify(myobj));
    });

    onlineserver.listen(3000, "127.0.0.1");
    console.log("yo dawgs, now listening to port 3000");
  } catch (e) {
    console.log(e);
  }
  end();
}

(async () => {
  await pyscript();
})().catch((error) => {
  console.log("error");
  console.error(error);
});
