import axios from 'axios';

export const handler = async (event) => {

    async function callApiWithQuery(query) {
        console.log("API Call", "Called");

        let nlink = "https://3b7c-2607-fb91-1449-4fae-114e-2ddb-5833-adad.ngrok-free.app";

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

    let xmhero = {
        "elementType": "detail",
        "id": "buttons",
        "title": "",
        "description": "Testudo-Chat is a GPT-3 powered chatbot specifically trained on school data to quickly answer any questions you may have about the university or its policies.",
        "byline": "",
        "body": "",
        "label": "Testudo-Chat",
        "thumbnail": {
            "url": "https://dbknews.s3.amazonaws.com/uploads/2020/06/IMG_7810.jpg",
            "alt": ""
        },
        "thumbnailSize": "small",
        "thumbnailBorderRadius": "1rem"
    }

	let xmspacer = {
		"elementType": "blockHeading",
		"heading": "",
		"headingLevel": 2
	}

    xmJson = {
        "metadata": {
            "version": "2.0"
        },
        "contentContainerWidth": "wide",
        "content": [],
        "elementFields": {}
    };

	xmJson.content.push(xmspacer);

    xmJson.content.push(xmhero);

    let xmForm = {
        "elementType": "form",
        "requestMethod": "GET",
        "id": "sample_form",
        "heading": {
            "heading": "Conversation",
            "headingLevel": 2,
            "description": "Type your question here."
        },
        "items": [{
            "elementType": "formInputText",
            "name": "s1_first",
            "label": "Question:",
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
            "statusText": "Answer",
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
            "statusText": "Question",
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
            "items": xmMessages
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