import axios from 'axios';
import jwt from 'jsonwebtoken';
import jwkPem from 'jwk-to-pem';
import data from './quests.mjs'

const key = {
	"kid": "18297e90-2497-48b2-8119-c268f37d48cb",
	"kty": "RSA",
	"n": "tWhZA9Kj4QMSw6KputrR9-rrOl-Uz2jaUMdI7oZEpKJuiC8ckOJ_WxxnhW31HvrhTnv9ui11x8pyIqbJfWnuBt0JScy9wdILp_Y829vaoDnxMXusJ7AeELdgjPQeHT9GMW0uf7N6pHUz75J26qshmRvI1BNQfDJPfSJ1VO9fakSXD02_rfI4CLBETixqgAPm_iWtnj43-LWoO-isFRZltoej-VdJ2pKW82d3LDyWNc0lV7-Bi5oiRbUD_0mJEOuCUs-yOfxhVT3T2w_VTnwllkISgAVN60AqFj24fgJh8QuuFzWkFr4Wmq1SnboDPmqoyQWa381pfeZSNSG2740TnQ",
	"e": "AQAB"
};

export const handler = async (event) => {
    console.log("HTTP REQUEST", JSON.stringify(event));

    // ALL THE VARIAVBLES
    let xmJson = null;
    let xmPortalHeader = null;
    let xmContent = null;
    let secCol = null;
    let thirdCol = null;
    let payload = null;
    let partyGold = null;
    let partyPower = null;
    let partySkills = [];
    let partyPeople = [];

    // decode headers
    if ('headers' in event && 'Authorization' in event.headers) {
        payload = jwt.verify(event.headers.Authorization.split(" ")[1], jwkPem(key));
        console.log("PAYLOAD: ", payload);
    }

    // Get player
    async function getPlayerInfo(characterID) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://communicate.modolabs.net/api/applications/aarnav-sb/test/recipients/${characterID}`,
            headers: {
                'Accept': 'application/vnd.modo.communicate.v2',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6ImIzZGZkNWVjLWFiMDYtNGI4ZS1hMmE5LWNhYWRhNzA1NGI2MiJ9.eyJpc3MiOiJjb21tdW5pY2F0ZSIsImF1ZCI6ImNvbW11bmljYXRlIiwianRpIjoiYjNkZmQ1ZWMtYWIwNi00YjhlLWEyYTktY2FhZGE3MDU0YjYyIiwiaWF0IjoxNjg4Mzk1OTkxLCJuYmYiOjE2ODgzNTY4MDAsInN1YiI6ImFhcm5hdi1zYiIsInNjb3BlcyI6WyJyZWNpcGllbnRfc2NoZW1hc19tYW5hZ2UiLCJyZWNpcGllbnRfc2NoZW1hc192aWV3IiwicmVjaXBpZW50c19jcmVhdGUiLCJyZWNpcGllbnRzX2RlbGV0ZSIsInJlY2lwaWVudHNfdmlldyJdLCJ0YXJnZXRzIjpbInRlc3QiXSwiY2hhbm5lbHMiOltdLCJhbGxfY2hhbm5lbHMiOnRydWUsImFsbF9wcml2aWxlZ2VkX3JlY2lwaWVudF9hdHRyaWJ1dGVzIjp0cnVlLCJhbGxvd2VkX3ByaXZpbGVnZWRfcmVjaXBpZW50X2F0dHJpYnV0ZXMiOlsiIl0sImV4cCI6MTcxOTkzMTk5MX0.TYn2u9LaNJjKS5Gr46JYrOCTtSTiYyqAMglcTl6adFw'
            }
        };

        let player = await axios(config);
        console.log("PLAYER INFO", JSON.stringify(player.data));
        return player;
    }

    async function getAllUsers() {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://communicate.modolabs.net/api/applications/aarnav-sb/test/recipients',
            headers: {
                'Accept': 'application/vnd.modo.communicate.v2',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6ImIzZGZkNWVjLWFiMDYtNGI4ZS1hMmE5LWNhYWRhNzA1NGI2MiJ9.eyJpc3MiOiJjb21tdW5pY2F0ZSIsImF1ZCI6ImNvbW11bmljYXRlIiwianRpIjoiYjNkZmQ1ZWMtYWIwNi00YjhlLWEyYTktY2FhZGE3MDU0YjYyIiwiaWF0IjoxNjg4Mzk1OTkxLCJuYmYiOjE2ODgzNTY4MDAsInN1YiI6ImFhcm5hdi1zYiIsInNjb3BlcyI6WyJyZWNpcGllbnRfc2NoZW1hc19tYW5hZ2UiLCJyZWNpcGllbnRfc2NoZW1hc192aWV3IiwicmVjaXBpZW50c19jcmVhdGUiLCJyZWNpcGllbnRzX2RlbGV0ZSIsInJlY2lwaWVudHNfdmlldyJdLCJ0YXJnZXRzIjpbInRlc3QiXSwiY2hhbm5lbHMiOltdLCJhbGxfY2hhbm5lbHMiOnRydWUsImFsbF9wcml2aWxlZ2VkX3JlY2lwaWVudF9hdHRyaWJ1dGVzIjp0cnVlLCJhbGxvd2VkX3ByaXZpbGVnZWRfcmVjaXBpZW50X2F0dHJpYnV0ZXMiOlsiIl0sImV4cCI6MTcxOTkzMTk5MX0.TYn2u9LaNJjKS5Gr46JYrOCTtSTiYyqAMglcTl6adFw'
            }
        };

        let allUsers = await axios(config);
        console.log("USER LIST", JSON.stringify(allUsers.data));
        return allUsers.data;
    }

    async function getCurrentCharacterInfo(characterId, characterArray) {
        const character = characterArray.find(({ id }) => id === characterId);

        console.log("Character found:", JSON.stringify(character));

        return character;
    }

    // Get party info
    let everyone = await getAllUsers();
    let me = await getCurrentCharacterInfo(payload.sub, everyone.recipients);
    console.log("ME", JSON.stringify(me));

    if (me != null && 'attributes' in me) {
        const { name, gold, power, skills, partyMembers } = me.attributes;
        partyGold = gold;
        partyPower = power;

        for (let i = 0; i < skills.length; i++) {
            let skill = {
                "title": payload.skills[i],
            };
            partySkills.push(skill);
        }

        if (partyMembers != null) {
            for (let i = 0; i < partyMembers.length; i++) {

                let tempChar = await getCurrentCharacterInfo(partyMembers[i], everyone.recipients);

                partyPeople.push({
                    "title": tempChar.attributes.name,
                    "description": `${tempChar.attributes.class} &#8251; ${tempChar.attributes.gold} Gold &#8251; ${tempChar.attributes.power} Power &#8251; ${tempChar.attributes.skills.length} Skills`,
                    "image": {
                        "url": tempChar.attributes.photoURL,
                        "alt": "PartyMember Image"
                    }
                });

                partyGold = JSON.stringify(Number(partyGold) + Number(tempChar.attributes.gold));
                partyPower = JSON.stringify(Number(partyPower) + Number(tempChar.attributes.power));

                for (let i = 0; i < tempChar.attributes.skills.length; i++) {
                    let skill = {
                        "title": tempChar.attributes.skills[i],
                    };
                    partySkills.push(skill);
                }
            }
        }
    }

    // build a quest list ***LAB 6 TASK 2***
    // Define filters for quests
    let xmFilter = {
        "elementType": "form",
        "id": "select",
        "items": [{
            "elementType": "formInputSelect",
            "name": "filter",
            "label": "Filter Quests",
            "options": [{
                    "label": "Show All Quests",
                    "value": "none"
                },
                {
                    "label": "Quest Difficulty",
                    "value": [{
                            "value": "easy",
                            "label": "Easy"
                        },
                        {
                            "value": "medium",
                            "label": "Medium"
                        },
                        {
                            "value": "hard",
                            "label": "Hard"
                        }
                    ]
                },
                {
                    "label": "Quest Availability",
                    "value": [{
                            "value": "available",
                            "label": "Available"
                        },
                        {
                            "value": "busy",
                            "label": "Busy/Unavailable"
                        }
                    ]
                }
            ],
            "events": [{
                "eventName": "change",
                "action": "ajaxUpdate",
                "targetId": "quest_cards",
                "ajaxRelativePath": "",
                "propagateArgs": true
            }]
        }]
    };

    let xmCardSet = {
        "elementType": "cardSet",
        "id": "quest_cards",
        "marginTop": "medium",
        "items": [

        ]
    };

    function getCards(filter) {
        let xmCards = [];

        for (let q of data.quests) {
            if (filter == null || filter == 'none' || filter.includes(q.status) || filter.includes(q.difficulty)) {
                xmCards.push({
                    "elementType": "contentCard",
                    "size": "small",
                    "imageStyle": "hero",
                    "image": {
                        "url": q.photo,
                        "alt": q.name
                    },
                    "title": q.name,
                    "label": q.status,
                    "labelTextColor": q.status == 'available' ? "theme:available_focal_text_color" : "theme:alarm_focal_text_color",
                    "description": `Difficulty: ${q.difficulty}<br>Gold earned: ${q.gold.toString()}`
                });
            }
        }

        return xmCards;
    }

    // boilerplate json
    xmJson = {
        "metadata": {
            "version": "2.0"
        },
        "contentContainerWidth": "full",
        "header": [],
        "content": [],
        "elementFields": {}
    };

    // Build the header with default text
    xmPortalHeader = {
        "elementType": "hero",
        "height": "fluid",
        "contentContainerWidth": "medium",
        "backgroundImage": {
            "url": "https://cdna.artstation.com/p/assets/images/images/001/206/348/large/david-edwards-kenden-001.jpg?1442195813",
            "overlayType": "gradient",
            "overlayGradientStartColor": "rgba(0,0,0,0.9)",
            "overlayGradientStartPosition": 33,
            "overlayGradientAngle": 0
        },
        "content": [{
                "elementType": "heroHeading",
                "heading": "Welcome",
                "fontSize": "large",
                "textColor": "rgba(220,245,255,0.75)",
                "responsiveScaling": true,
                "marginTop": "15%",
                "marginBottom": "0"
            },
            {
                "elementType": "heroHeading",
                "heading": "Please Sign In!",
                "fontSize": "large",
                "textColor": "#ffffff",
                "responsiveScaling": true,
                "marginTop": "0",
                "marginBottom": "7.5%"
            }
        ]
    };

    // If signed in, update header with personal information
    if (payload != null && 'name' in payload) {
        xmPortalHeader.content = [{
                "elementType": "heroImage",
                "imageSize": "58px",
                "horizontalAlignment": "center",
                "marginTop": "3rem",
                "image": {
                    "url": payload.photo,
                    "alt": "Character photo",
                    "borderWidth": "4px",
                    "borderColor": "#ffffff",
                    "borderRadius": "full"
                }
            },
            {
                "elementType": "heroHeading",
                "textAlignment": "center",
                "textColor": "#fff",
                "fontSize": "2.5rem",
                "marginTop": ".5rem",
                "marginBottom": "none",
                "responsiveScaling": true,
                "heading": `Welcome back ${payload.name}`
            },
            {
                "elementType": "heroButtons",
                "horizontalAlignment": "center",
                "marginBottom": "3rem",
                "buttons": [{
                    "elementType": "linkButton",
                    "backgroundColor": "#00baff",
                    "borderColor": "#00baff",
                    "borderWidth": "2px",
                    "title": "&emsp;&emsp; Update Character &emsp;&emsp;",
                    "textColor": "#000000",
                    "link": {
                        "relativePath": "/update-character"
                    }
                }]
            }
        ]
    }

    // push the header out
    xmJson.header.push(xmPortalHeader);

    xmContent = {
        "elementType": "responsiveThreeColumn",
        "sideMargins": "responsive",
        "primaryColumn": {
            "content": [{
                    "elementType": "blockHeading",
                    "heading": "Quest List",
                    "headingLevel": 1,
                    "headingTextColor": "#4B61B4",
                    "headingFontWeight": "bold"
                },
                {
                    "elementType": "divider",
                    "borderColor": "transparent"
                }
            ]
        },
        "secondaryColumn1": {
            "content": []
        },
        "secondaryColumn2": {
            "content": []
        }
    };

    // Create columns
    if (payload != null && 'name' in payload) {
        // Character information
        secCol = [{
                "elementType": "blockHeading",
                "heading": "Your Character",
                "headingLevel": 1,
                "headingTextColor": "#4B61B4",
                "headingFontWeight": "bold"
            },
            {
                "elementType": "divider",
                "borderColor": "transparent"
            },
            {
                "elementType": "collapsible",
                "disclosureIcon": "chevron",
                "collapsed": false,
                "title": "View Character Stats",
                "content": [{
                    "elementType": "statusList",
                    "id": "charInfo",
                    "listStyle": "separated", // separated
                    "showAccessoryIcons": true,
                    "backgroundColor": "theme:subfocal_background_color",
                    "statusDetailValueFontSize": "xsmall",
                    "statusDetailValueTextColor": "#DAA900",
                    "marginTop": "none",
                    "items": [{
                            "title": "Gold",
                            "statusDetails": [{
                                "value": payload.gold,
                                "description": "Gold"
                            }]
                        },
                        {
                            "title": "Power",
                            "statusDetailValueTextColor": "#002856",
                            "statusDetailValueFontWeight": "normal",
                            "statusDetails": [{
                                "value": payload.power,
                                "description": "Power"
                            }]
                        },
                        {
                            "title": "Available Skills",
                            "statusDetails": [{
                                "value": JSON.stringify(payload.skills.length),
                                "description": "Skills"
                            }]
                        }
                    ]
                }]
            }
        ];

        thirdCol = [{
                "elementType": "blockHeading",
                "heading": "Party Information",
                "headingLevel": 1,
                "headingTextColor": "#4B61B4",
                "headingFontWeight": "bold"
            },
            {
                "elementType": "collapsible",
                "disclosureIcon": "chevron",
                "collapsed": false,
                "title": "View Party Members",
                "content": [{
                    "elementType": "statusList",
                    "id": "charInfo",
                    "listStyle": "separated", // separated
                    "showAccessoryIcons": true,
                    "backgroundColor": "theme:subfocal_background_color",
                    "statusDetailValueFontSize": "xsmall",
                    "statusDetailValueTextColor": "#DAA900",
                    "marginTop": "none",
                    //"items": []
                }]
            },
            {
                "elementType": "collapsible",
                "disclosureIcon": "chevron",
                "collapsed": false,
                "title": "View Party Stats",
                "content": [{
                    "elementType": "statusList",
                    "id": "charInfo",
                    "listStyle": "separated", // separated
                    "showAccessoryIcons": true,
                    "backgroundColor": "theme:subfocal_background_color",
                    "statusDetailValueFontSize": "xsmall",
                    "statusDetailValueTextColor": "#DAA900",
                    "marginTop": "none",
                    "items": [{
                            "title": "Party Gold",
                            "statusDetails": [{
                                "value": partyGold,
                                "description": "Gold"
                            }]
                        },
                        {
                            "title": "Party Power",
                            "statusDetailValueTextColor": "#002856",
                            "statusDetailValueFontWeight": "normal",
                            "statusDetails": [{
                                "value": partyPower,
                                "description": "Power"
                            }]
                        },
                        {
                            "title": "Available Skills",
                            "statusDetails": [{
                                "value": JSON.stringify(partySkills.length),
                                "description": "Skills"
                            }]
                        }
                    ]
                }]
            },
            {
                "elementType": "collapsible",
                "disclosureIcon": "chevron",
                "collapsed": true,
                "title": "View Party Skills",
                "content": [{
                    "elementType": "statusList",
                    "id": "charInfo",
                    "listStyle": "separated", // separated
                    "showAccessoryIcons": true,
                    "backgroundColor": "theme:subfocal_background_color",
                    "statusDetailValueFontSize": "xsmall",
                    "statusDetailValueTextColor": "#DAA900",
                    "marginTop": "none",
                }]
            }
        ];

        // Push party members into col
        thirdCol[1].content[0].items = partyPeople;
        thirdCol[3].content[0].items = partySkills;

        // Put in quests from lab 6 task 2 (Primary Col)
        if ('queryStringParameters' in event && event.queryStringParameters != null && 'filter' in event.queryStringParameters) {
            xmJson.elementFields = {
                "items": getCards(event.queryStringParameters.filter)
            };

        }
        else {
            xmCardSet.items = getCards();
            xmContent.primaryColumn.content.push(xmFilter);
            xmContent.primaryColumn.content.push(xmCardSet);
        }

        let skillCollapse = {
            "elementType": "collapsible",
            "borderTopStyle": "none",
            "title": "View Character Skills",
            "content": []
        };

        let skillList = {
            "elementType": "list",
            "itemSize": "medium",
            "listStyle": "separated",
            "backgroundColor": "theme:subfocal_background_color",
            "borderColor": "transparent",
            "items": []
        };

        for (let i = 0; i < payload.skills.length; i++) {
            let skill = {
                "title": payload.skills[i],
            };
            skillList.items.push(skill);
        }

        skillCollapse.content.push(skillList);
        secCol.push(skillCollapse);

        // push the content out
        xmContent.secondaryColumn1.content = secCol;
        xmContent.secondaryColumn2.content = thirdCol;
        xmJson.content.push(xmContent);
    }

    if ('queryStringParameters' in event && event.queryStringParameters != null && 's1_submit' in event.queryStringParameters) {
        xmJson.metadata.banners = [{
            "message": "You have successfully submitted your character information",
            "type": "confirmation"
        }];
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(xmJson),
    };
    return response;
};
