import sys
import gspread
from oauth2client.service_account import ServiceAccountCredentials

json_path = './pythonFiles/teamentryform.json'
gss_key = '1dsEZ4GDaZJ2UTDyPRhlMJs-jW3fiRj6ElZbL3BQlVvI'
api = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']

cred = ServiceAccountCredentials.from_json_keyfile_name(json_path, api)
gs_auth = gspread.authorize(cred)

ws = gs_auth.open_by_key(gss_key).sheet1


data = sys.stdin.readline()


if(data.startswith('discordId')):
    i = 3
    while ((ws.cell(i, 9).value != data[data.find('=') + 1:]) or (ws.cell(i, 9).value != None)):
        ws.update_cell(1,1,i)
        ws.update_cell(i, 9, data)
        i += 1


# print(data.startswith('iscordId'))