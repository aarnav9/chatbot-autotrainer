import data from "./directory.mjs";

export const handler = async (event) => {
  let search_info = event.queryStringParameters.search_info;
  let xmJson = {
    "metadata": {
      "version": "2"
    },
    "content": [{
        "elementType": "blockHeading",
        "heading": "Directory"
      },
      {
        "elementType": "form",
        "relativePath": "",
        "items": [{
          "elementType": "formInputText",
          "label": "Search Employees",
          "name": "search_info",
          "placeholder": "Search for name, occupation, or phone"
        }],
        "events": [{
          "eventName": "change",
          "action": "ajaxUpdate",
          "targetId": "employee_list",
          "ajaxRelativePath": "",
          "propagateArgs": true
        }]
      },
      {
        "elementType": "list",
        "heading": "Type to show list",
        "id": "employee_list"
      }
    ]
  };

    if (`queryStringParameters` in event && `queryStringParameters` != null && `search_info` in event.queryStringParameters) {
        let searchString = event.queryStringParameters.search_info.toLowerCase();
        let arr = [];
        for (let entry of data) {
            let fullname = `${entry.firstname.toLowerCase()} ${entry.lastname.toLowerCase()}`;
            if (fullname.includes(searchString) || entry.occupation.toLowerCase().includes(searchString) || entry.phone.includes(searchString)) {
                arr.push({
                    "title": `${entry.firstname} ${entry.lastname}`,
                    "description": `${entry.occupation} | ${entry.email} | ${entry.phone}`,
                });
    }

    xmJson.elementFields = {
        "items": arr
        "heading": `${arr.length} Search results"`
    };
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(xmJson),
  };
  return response;
};
