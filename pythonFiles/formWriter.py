import sys
import urllib.parse
import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials

json_path = './pythonFiles/teamentryform.json'
gss_key = '1dsEZ4GDaZJ2UTDyPRhlMJs-jW3fiRj6ElZbL3BQlVvI'
api = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']

cred = ServiceAccountCredentials.from_json_keyfile_name(json_path, api)
gs_auth = gspread.authorize(cred)

ws = gs_auth.open_by_key(gss_key).sheet1


data = sys.stdin.readline()

data_json = json.loads(data)
data_json['form1'] = urllib.parse.unquote(data_json['form1'])
data_json['form2'] = urllib.parse.unquote(data_json['form2'])
data_json['form3'] = urllib.parse.unquote(data_json['form3'])
data_json['form4'] = urllib.parse.unquote(data_json['form4'])


row = 2
id = data_json['discordId']

while (1):
    if((ws.cell(row, 9).value == id) or (ws.cell(row, 9).value == None)):
        if(data_json['sheet'] == 'first'):
            ws.update_cell(row, 1, row - 2)
            ws.update_cell(row, 2, data_json['form1'])
            ws.update_cell(row, 3, data_json['form2'])
            ws.update_cell(row, 4, data_json['form3'])
            ws.update_cell(row, 5, data_json['form4'])
        if(data_json['sheet'] == 'second'):
            ws.update_cell(row, 6, data_json['form1'])
            ws.update_cell(row, 7, data_json['form2'])
            ws.update_cell(row, 8, data_json['form3'])
        ws.update_cell(row, 9, id)
        break
    row += 1

