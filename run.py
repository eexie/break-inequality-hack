from flask import Flask, request, redirect, session
from twilio import twiml
import os
import requests
import csv
import json
import time
from requests.auth import HTTPBasicAuth
from flask.ext.cors import CORS

ACCOUNT_SID = "ACc3c41835c42c5e747122b034730cae33" 
AUTH_TOKEN = "1ec2cabd9b1b996ac5bab114fa9197a9" 
SECRET_KEY = 'a secret key'
LOG_URL = 'https://api.twilio.com/2010-04-01/Accounts/'+ACCOUNT_SID+'/SMS/Messages.csv?PageSize=1000&'

fieldnames = ("Sid","DateCreated","DateUpdated","DateSent","AccountSid","To","From","Body","Status","Direction","Price","PriceUnit","ApiVersion","Uri","NumSegments")


with open('questions.json') as q_file:
	questions = json.load(q_file)

answers = []

question_id = -2

app = Flask(__name__)
CORS(app)
app.config.from_object(__name__)

# Create the directory to cache responses
cacheDirectory = 'cache/'
if not os.path.exists(cacheDirectory):
    os.makedirs(cacheDirectory)
@app.route("/")
def hello():
    return "Hello World!"

# Respond with SMS message when a message is sent to this url
# @app.route("/response", methods=['GET', 'POST'])
# def start():
# 	# Get response info
# 	number = request.form['From']
# 	message_body = request.form['Body']

# 	# resp = twiml.Response()
	
# 	# resp.message('Hello {}, you said: {}'.format(number, message_body))
# 	# return str(resp)
# 	return redirect(url_for("question", question_id = id), method = 'GET')

# send question to user

@app.route('/question', methods=['GET', 'POST'])
def question():
	global question_id
	question = questions[question_id]
	response = twiml.Response()
	if(question_id!=1):
		answers.insert(question_id, request.values['Body'])
	if(question_id<len(questions)):
		response.message(question['body'] + SMS_INSTRUCTIONS[question['type']])
		question_id+=1;
	else:
		response.message("Congratulations on the success of your pregnacy. Please contact xxx-xxx-xxxx if you require more assistance")
		a_file = open('answers.json', 'w')
		json.dump(answers, a_file, indent=4)

	return str(response)

SMS_INSTRUCTIONS = {
        'text': 'Please type your answer',
        'boolean': 'Please type 1 for yes and 0 for no',
        'numeric': 'Please type a number between 1 and 10'
}
@app.route("/answer")
def getAnswers():
	with open('answers.json') as a_file:
		a = json.load(a_file)
		return json.dumps(a)
@app.route("/log/<phoneNumber>", methods = ['GET'])
def getLog(phoneNumber):
	url =LOG_URL+'From='+phoneNumber
	log = requests.get(url, auth = HTTPBasicAuth(ACCOUNT_SID, AUTH_TOKEN))
	with open(cacheDirectory+number+'.csv', 'wb') as f:
		f.write(log.content)
	log = open('cache/+14168188610.csv', 'rU')
	jsonLog = open(cacheDirectory+phoneNumber+'.json', 'w')
	reader = csv.DictReader(log ,fieldnames)
	for row in reader:
		json.dump(row, jsonLog, indent=4)
		jsonLog.write('\n')
if __name__ == "__main__":
    app.run(debug=True)