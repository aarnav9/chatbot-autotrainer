// index.js
const serverless = require('serverless-http');
const express = require('express');
const jwt = require('jsonwebtoken');
const jwk = require('jwk-to-pem');

// instantiate the express server
const app = express();

// used to get post events as JSON objects correctly
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// TODO: Delete this function before you go live
app.get('/hello', function (req, res) {
    console.log(req);

    let payload = null; // ('authorization' in req.headers && req.headers.authorization != null) ? jwtstuff.base64DecodeJwtPayload(req.headers.authorization) : null;
    // console.log(JSON.stringify(payload));

    let name = 'XModule!';
    if (payload != null && 'given_name' in payload) {
        name = payload.given_name
    }

    let xmJson = {
        "metadata": {
            "version": "2.0"
        },
        "content": [
            {
                "elementType": "html",
                "html": `Hello ${name}, friend of Bert! You are awesome!<br>But not the best programmer in the world!`
            }
        ]
    }

    // res.setHeader('Content-Type', 'application/json');
    // res.status = 200;
    res.json(xmJson);
});

app.get('/formexample', function(req, res) {
    console.log(req);

    let xmJson = {
        "metadata": {
            "version": "2.0"
        },
        "content": [
            {
                "elementType": "form",
                "id": "sample_form",
                "heading": {
                    "heading": "Sample form",
                    "headingLevel": 2,
                    "description": "Items marked with an asterisk (*) are required.",
                    "buttons": [
                        {
                            "elementType": "linkButton",
                            "size": "small",
                            "actionStyle": "normal",
                            "borderRadius": "full",
                            "title": "View in sandbox",
                            "link": {
                                "module": {
                                    "id": "sandbox",
                                    "page": "index",
                                    "targetNewWindow": true,
                                    "queryParameters": {
                                        "apiURL": "https://docs-training-api.modolabs.net/elementextractor?example=sample_form&file=form&size=narrow",
                                        "submit": "Load+from+URL",
                                        "_kgoFORM": "api"
                                    }
                                }
                            }
                        }
                    ]
                },
                "items": [
                    {
                        "elementType": "formInputText",
                        "name": "s1_first",
                        "label": "First name",
                        "required": true
                    },
                    {
                        "elementType": "formInputText",
                        "name": "s1_last",
                        "label": "Last name",
                        "required": true
                    },
                    {
                        "elementType": "formInputText",
                        "name": "s1_company",
                        "label": "Company"
                    },
                    {
                        "elementType": "formInputText",
                        "name": "s1_title",
                        "label": "Title"
                    },
                    {
                        "elementType": "formInputSegmented",
                        "name": "s1_age",
                        "label": "Age",
                        "options": {
                            "Under 25": "Under 25",
                            "25-40": "25-40",
                            "41-60": "41-60",
                            "61+": "61 or over"
                        },
                        "fullWidth": true
                    },
                    {
                        "elementType": "formInputAssistedSelect",
                        "name": "s1_animal",
                        "label": "Favorite animal",
                        "options": {
                            "": "",
                            "alpaca": "Alpaca",
                            "ant": "Ant",
                            "bird": "Bird",
                            "cat": "Cat",
                            "dog": "Dog",
                            "ferret": "Ferret",
                            "fish": "Fish",
                            "goat": "Goat",
                            "guinea": "Guinea pig",
                            "hedgehog": "Hedgehog",
                            "horse": "Horse",
                            "lizard": "Lizard",
                            "mouse": "Mouse",
                            "pig": "Pig",
                            "rabbit": "Rabbit",
                            "rat": "Rat",
                            "salamander": "Salamander",
                            "seal": "Seal",
                            "shark": "Shark",
                            "sheep": "Sheep",
                            "snake": "Snake",
                            "spider": "Spider",
                            "turtle": "Turtle",
                            "weasel": "Weasel"
                        }
                    },
                    {
                        "elementType": "formInputRadio",
                        "label": "Preferred contact",
                        "preamble": "What's the best way to reach you?",
                        "name": "s1_contact",
                        "options": {
                            "email": "Email",
                            "phone": "Phone",
                            "text": "Text",
                            "discord": "Discord"
                        },
                        "nested": true,
                        "progressiveDisclosureItems": {
                            "email": [
                                {
                                    "elementType": "formInputEmail",
                                    "name": "s1_email",
                                    "label": "Email address",
                                    "required": true
                                }
                            ],
                            "phone": [
                                {
                                    "elementType": "formInputPhone",
                                    "name": "s1_phone",
                                    "label": "Phone number"
                                }
                            ],
                            "text": [
                                {
                                    "elementType": "formInputPhone",
                                    "name": "s1_text",
                                    "label": "Phone number for text"
                                }
                            ],
                            "discord": [
                                {
                                    "elementType": "formInputText",
                                    "name": "s1_discord",
                                    "label": "Discord username"
                                }
                            ]
                        }
                    }
                ],
                "buttons": [
                    {
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
            }
        ]
    };

    res.json(xmJson);
});

app.post('/formexample', function (req, res) {
    console.log(req.body);

    let xmJson = {
        "metadata": {
            "version": "2.0"
        },
        "content": [
            {
                "elementType": "blockHeading",
                "heading": "Submission received",
                "description": "Thank you for your submission"
            }
        ]
    };

    res.json(xmJson);
});

app.get('/ajaxdatesolo', function(req, res) {
    console.log("AJAX Date function entered");
    console.log(req.query);
    let prevDays = -1, nextDays = 1, currentDate = new Date(), ajax = false;

    if ('days' in req.query) {
        ajax = true;
        prevDays = parseInt(req.query.days) - 1;
        nextDays = parseInt(req.query.days) + 1;
        currentDate.setDate(currentDate.getDate() + parseInt(req.query.days));
    }

    let xmJson = {
        metadata: {
            version: "2.0"
        }
    };
    
    let containerContents = [
        {
            elementType: "html",
            html: currentDate.toString()
        },
        {
            elementType: "buttonGroup",
            buttons: [
                {
                    elementType: "linkButton",
                    title: "Previous",
                    events: [
                        {
                            eventName: "click",
                            action: "ajaxUpdate",
                            targetId: "dateHolder",
                            ajaxRelativePath: `?days=${prevDays.toString()}`
                        }
                    ]
                },
                {
                    elementType: "linkButton",
                    title: "Next",
                    events: [
                        {
                            eventName: "click",
                            action: "ajaxUpdate",
                            targetId: "dateHolder",
                            ajaxRelativePath: `?days=${nextDays.toString()}`
                        }
                    ]
                }
            ]
        }
    ]

    if (ajax) {
        xmJson.elementFields = {
            content: containerContents
        }
    } else {
        xmJson.regionContent = [
            {
                elementType: "blockHeading",
                heading: "Selected Date below"
            },
            {
                elementType: "container",
                id: "dateHolder",
                content: containerContents
            }
        ];
    }

    console.log(JSON.stringify(xmJson));
    res.json(xmJson);

});

app.get('/ajaxdate', function(req, res) {
    console.log("AJAX Date function entered");
    console.log(req.query);
    let prevDays = -1, nextDays = 1, currentDate = new Date(), ajax = false;

    if ('days' in req.query) {
        ajax = true;
        prevDays = parseInt(req.query.days) - 1;
        nextDays = parseInt(req.query.days) + 1;
        currentDate.setDate(currentDate.getDate() + parseInt(req.query.days));
    }

    let xmJson = {
        metadata: {
            version: "2.0"
        }
    };
    
    let containerContents = [
        {
            elementType: "html",
            html: currentDate.toString()
        },
        {
            elementType: "buttonGroup",
            buttons: [
                {
                    elementType: "linkButton",
                    title: "Previous",
                    events: [
                        {
                            eventName: "click",
                            action: "ajaxUpdate",
                            targetId: "dateHolder",
                            ajaxRelativePath: `./ajaxdate?days=${prevDays.toString()}`
                        }
                    ]
                },
                {
                    elementType: "linkButton",
                    title: "Next",
                    events: [
                        {
                            eventName: "click",
                            action: "ajaxUpdate",
                            targetId: "dateHolder",
                            ajaxRelativePath: `./ajaxdate?days=${nextDays.toString()}`
                        }
                    ]
                }
            ]
        }
    ]

    if (ajax) {
        xmJson.elementFields = {
            content: containerContents
        }
    } else {
        xmJson.regionContent = [
            {
                elementType: "blockHeading",
                heading: "Selected Date below"
            },
            {
                elementType: "container",
                id: "dateHolder",
                content: containerContents
            }
        ];
    }

    res.json(xmJson);

});

app.get('/ajaxcontent', function (req, res) {
    console.log("AJAX Content function entered");
    console.log(JSON.stringify(req.query));

    let xmJson = {
        metadata: {
            version: "2.0"
        },
        content: [
            {
                elementType: "blockHeading",
                heading: "Outer Content"
            },
            {
                elementType: "container",
                content: {
                    ajaxRelativePath: './ajaxdate'
                }
            }
        ]
    };

    res.json(xmJson);
});

app.get('/quest/:id', function(req, res) {
    console.log(req.params);

    let xmJson = {
        metadata: {
            version: "2.0"
        },
        content: [
            {
                "elementType": "blockHeading",
                "heading": req.params.id
            }
        ]
    }

    res.json(xmJson);

});
module.exports.handler = serverless(app);
