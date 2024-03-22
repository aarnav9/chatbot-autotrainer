export const handler = async (event) => {
    console.log("HTTP Request", JSON.stringify(event));
    let xmJson = {
        "metadata": {
            "version": "2.0"
        },
        "contentContainerWidth": "narrow",
        "content": [{
                "elementType": "divider",
                "borderColor": "transparent"
            },
            {
                "elementType": "form",
                "id": "sample_form",
                "heading": {
                    "heading": "Sample form",
                    "headingLevel": 3,
                    "description": "Items marked with an asterisk (*) are required."
                },
                "items": [{
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
                        "label": "Class"
                    },
                    {
                        "elementType": "formInputText",
                        "name": "s1_title",
                        "label": "Race"
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
                        "label": "Animal companion",
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
                            "weasel": "Weasel",
                            "emu": "emu",
                            "unicorn": "unicorn",
                            "kangaroo": "kangaroo",
                            "dragon": "dragon"
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
                            "email": [{
                                "elementType": "formInputEmail",
                                "name": "s1_email",
                                "label": "Email address",
                                "required": true
                            }],
                            "phone": [{
                                "elementType": "formInputPhone",
                                "name": "s1_phone",
                                "label": "Phone number"
                            }],
                            "text": [{
                                "elementType": "formInputPhone",
                                "name": "s1_text",
                                "label": "Phone number for text"
                            }],
                            "discord": [{
                                "elementType": "formInputText",
                                "name": "s1_discord",
                                "label": "Discord username"
                            }]
                        }
                    }
                ],
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
            }
        ]
    };

    if (event.httpMethod === "POST" || event.httpMethod === "GET") {
        xmJson.metadata = {
            "version": "1",
            "banners": [
                {
                    "message": "You have successfully submitted your character information",
                    "type": "info",
                }
            ]
        };
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(xmJson),
    };
    return response;
};