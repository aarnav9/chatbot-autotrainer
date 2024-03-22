from flask import Flask, request, jsonify
from writer import function_write

app = Flask(__name__)

# Post request to get the query string and return the response
@app.route('/api', methods=['GET'])
def api():
    # Get the 'query' parameter from the URL
    query_string = request.args.get('query')

    # Check if the 'query' parameter is present in the URL
    if not query_string:
        return jsonify({"error": "No query parameter found."}), 400

    # Call the function_gpt with the provided query_string
    if (query_string != "null"):
        function_write(query_string)
        result = "url written to pages.txt"
    else:
        result = "check url provided"
    
    # Return the result as JSON
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(port=3051)