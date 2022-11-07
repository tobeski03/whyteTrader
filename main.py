from flask import *
import json, time
import MetaTrader5 as mt
# import pandas as pd
# import plotly.express as px
from datetime import datetime, timedelta

mt.initialize()

login = 5197033
password = 'Adejugbe1.'
server = 'Deriv-Demo'

mt.login(login, password, server)
 
 #get account info
account_info = mt.account_info()
num_orders =mt.orders_total()
num_positions = mt.positions_total()
num_order_history = mt.history_orders_total(datetime.now()-timedelta(days=1), datetime.now())

app = Flask(__name__)
@app.route('/', methods = ['Get'])
def home_page():
    data_set = {'page': 'Home', 'Message': 'Successfully loaded the Home Page', 'TimeStamp': time.time()}
    json_dump = json.dumps(data_set)
    return json_dump

@app.route('/user/', methods = ['Get'])
def request_page():
    user_query = str(request.args.get('user')) #/user/?user=USER_NAME
    
    
    data_set = {'page': 'Request', 'Message': f'Successfully got the request for {user_query}', 'balance': f'{account_info.balance}', 'equity': f'{account_info.equity}','name': f'{account_info.name}', 'TimeStamp': time.time()}
    json_dump = json.dumps(data_set)
    return json_dump

if __name__ == '__main__': app.run(port=7777)