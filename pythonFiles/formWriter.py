import sys
import gspread
from oauth2client.service_account import ServiceAccountCredentials

json_path = './pythonFiles/teamentryform.json'
gss_key = '1dsEZ4GDaZJ2UTDyPRhlMJs-jW3fiRj6ElZbL3BQlVvI'
api = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']

cred = ServiceAccountCredentials.from_json_keyfile_name(json_path, api)
gs_auth = gspread.authorize(cred)

lang_ws = gs_auth.open_by_key(gss_key).sheet1


data = sys.stdin.readline()

lang_ws.update_cell(3,3,'a')