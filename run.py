from flask import Flask, request, redirect, session
from twilio import twiml
import os
import requests
import csv
import json
from requests.auth import HTTPBasicAuth

ACCOUNT_SID = "ACc3c41835c42c5e747122b034730cae33" 
AUTH_TOKEN = "1ec2cabd9b1b996ac5bab114fa9197a9" 
SECRET_KEY = 'a secret key'

LOG_URL = 'https://api.twilio.com/2010-04-01/Accounts/'+ACCOUNT_SID+'/SMS/Messages.csv?PageSize=1000&'

fieldnames = ("Sid","DateCreated","DateUpdated","DateSent","AccountSid","To","From","Body","Status","Direction","Price","PriceUnit","ApiVersion","Uri","NumSegments")
app = Flask(__name__)
app.config.from_object(__name__)

# Create the directory to cache responses
cacheDirectory = 'cache/'
if not os.path.exists(cacheDirectory):
    os.makedirs(cacheDirectory)
@app.route("/")
def hello():
    return "Hello World!"

# Respond with SMS message when a message is sent to this url
@app.route("/surveyInit", methods=['GET', 'POST'])
def start():
	# Get response info
	number = request.form['From']
	message_body = request.form['Body']

	resp = twiml.Response()
	
	url =LOG_URL+'From='+number
	log = requests.get(url, auth = HTTPBasicAuth(ACCOUNT_SID, AUTH_TOKEN))
	with open(cacheDirectory+number+'.csv', 'wb') as f:
		f.write(log.content)
		reader = csv.DictReader(f)
		title = reader.fieldnames


	resp.message('Hello {}, you said: {}'.format(number, message_body))
	return str(resp)

@app.route("/log/<phoneNumber>", methods = ['GET'])
def getLog(phoneNumber):
	log = open('cache/+14168188610.csv', 'rU')
	jsonLog = open(cacheDirectory+phoneNumber+'.json', 'w')
	reader = csv.DictReader(log ,fieldnames)
	for row in reader:
		json.dump(row, jsonLog, indent=4)
		jsonLog.write('\n')
if __name__ == "__main__":
    app.run(debug=True)