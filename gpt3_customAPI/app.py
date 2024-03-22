from flask import Flask, request
from open import function_gpt

app = Flask(__name__)

@app.route('/')
def hello_world():
    # api_key = request.json['api_key']
    # query = request.json['query']
    api_key = "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"
    query = "How many letters in the english alphabet and best way to remember them?"
    return "" + function_gpt(api_key, query)

if __name__ == "__main__":
	app.run()
        
# takes input as a query to send to function_gpt

# returns output as a json with response
    