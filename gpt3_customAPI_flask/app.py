from flask import Flask, request, jsonify
from open import function_gpt

app = Flask(__name__)

# Sample function that takes a query string and returns another string
@app.route('/api', methods=['GET'])
def api():
    # Get the 'query' parameter from the URL
    query_string = request.args.get('query')

    # Check if the 'query' parameter is present in the URL
    if not query_string:
        return jsonify({"error": "No query parameter found."}), 400

    # Call the function_gpt with the provided query_string
    result = function_gpt("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", query_string)
    
    # Return the result as JSON
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(port=3050)