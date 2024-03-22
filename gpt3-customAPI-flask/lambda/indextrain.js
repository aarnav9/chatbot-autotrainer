import axios from 'axios';

export const handler = async (event) => {

	async function callApiWithQuery(query) {
        console.log("API Call", "Called");
        
        let nlink = "https://c656-2607-fb91-1449-4fae-114e-2ddb-5833-adad.ngrok-free.app";

		let config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: nlink + "/api?query=" + query,
			headers: {}
		};

		console.log("HTTP Request", JSON.stringify(config));

		let results = await axios(config);

		console.log("HTTP Response", JSON.stringify(results.data));

		return results.data;
	}

	let xmJson = null;
	let xmapp = null;

	xmJson = {
		"metadata": {
			"version": "2.0"
		},
		"contentContainerWidth": "wide",
		"content": [],
		"elementFields": {}
	};

	let xmForm = {
		"elementType": "form",
		"requestMethod": "GET",
		"id": "sample_form",
		"heading": {
			"heading": "Chatbot Training",
			"headingLevel": 2,
			"description": "Enter your URL."
		},
		"items": [{
			"elementType": "formInputText",
			"name": "s1_first",
			"label": "URL:",
			"required": true
		}],
		"buttons": [{
				"elementType": "formButton",
				"name": "s1_reset",
				"title": "Reset",
				"buttonType": "reset",
				"actionStyle": "destructiveQuiet",
				"minWidth": "8rem"
			},
			{
				"elementType": "formButton",
				"name": "s1_submit",
				"title": "Submit",
				"buttonType": "submit",
				"actionStyle": "constructive",
				"minWidth": "8rem"
			}
		],
		"trackDirtyStateButtonNames": [
			"s1_submit"
		],
		"buttonsHorizontalAlignment": "center"
	};

    xmJson.content.push(xmForm);

	let xmMessages = {
		"elementType": "statusList",
		"id": "status_no_details",
		"marginTop": "none",
		"listStyle": "padded",
		"items": []
	};

	xmJson.content.push(xmMessages);

    if (event.queryStringParameters?.s1_first != null && event.queryStringParameters.s1_first != "") {
        let query = event.queryStringParameters.s1_first;
        let results = await callApiWithQuery(query);
		let resultMessage = results.result;

		console.log("results", JSON.stringify(resultMessage));

		let pushres = {
			"title": resultMessage,
			"statusText": "Response",
			"status": "available",
			"statusDescriptor": "",
			"link": {
				"relativePath": ""
			}
		}

		console.log("results", results);
		console.log("pushres", JSON.stringify(pushres));

		let pushque = {
			"title": query,
			"statusText": "Link",
			"status": "available",
			"statusDescriptor": "",
			"link": {
				"relativePath": ""
			}
		}

		console.log("pushque", JSON.stringify(pushque));

		xmMessages.items.push(pushque)
		xmMessages.items.push(pushres)

		console.log("xmMessages", JSON.stringify(xmMessages));

		xmJson.elementFields = {
            "items" : xmMessages
        };
    }    

    console.log("event", JSON.stringify(event));

    console.log("xmForm", JSON.stringify(xmForm));

	console.log("xmJson", JSON.stringify(xmJson));

	// TODO implement
	const response = {
		statusCode: 200,
		body: JSON.stringify(xmJson),
	};
	return response;
};