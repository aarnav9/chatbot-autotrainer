import jwkPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import questData from "./quests.mjs";
const key = {
    "kid": "452dee6d-50d6-4bb0-ad78-4cd7588d44e1",
    "kty": "RSA",
    "n": "nQEFkbkj95voHRxLdUOnBg6NZH0Sh6x7rxmPr_dg2VY3zEJjm1uWQ48vXuv7TGzr3RGDM5Ra9aGagXKfsJw4kR1dvYhUlMP0yWITM2IMjLfwj4s3hBejKgzofb853moW14Lnz7Pxkap_r9YUN9mvbG2wFRO7HX8Gz61NUJBuPpafhD_fe3-fbiK7M36E0L2CcQedHIz3ADajGj83LPbyxot2ATW-vJ3Av9m1Jj52ezZYx_IMI87KUrd8pGT3Vs5YweSr0yjj30wjbVXCT0PN45OVc80xq4iHLpmvlfI5UaL2mb0wUF5CXVykWsXYXHm110aHqFZGoAZUSqp8jWNSxQ",
    "e": "AQAB"
};
export const handler = async (event) => {
    // TODO implement
    console.log("HTTP Request", event)
    let payload = null;
    let player = null;
    let pTest = null;
    let pQuests = [];
    let pAvailQuests = [];
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://communicate.modolabs.net/api/applications/kiran-sb/test/recipients',
        headers: {
            'Accept': 'application/vnd.modo.communicate.v2',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjVhYzYxZTI4LWFmNTMtNDJjZC05YjcxLWY0YzYyNDMzNzAwZSJ9.eyJpc3MiOiJjb21tdW5pY2F0ZSIsImF1ZCI6ImNvbW11bmljYXRlIiwianRpIjoiNWFjNjFlMjgtYWY1My00MmNkLTliNzEtZjRjNjI0MzM3MDBlIiwiaWF0IjoxNjg4Mzk1OTIxLCJuYmYiOjE2ODgzNjc2MDAsInN1YiI6ImtpcmFuLXNiIiwic2NvcGVzIjpbInJlY2lwaWVudF9zY2hlbWFzX21hbmFnZSIsInJlY2lwaWVudF9zY2hlbWFzX3ZpZXciLCJyZWNpcGllbnRzX2NyZWF0ZSIsInJlY2lwaWVudHNfZGVsZXRlIiwicmVjaXBpZW50c192aWV3Il0sInRhcmdldHMiOlsidGVzdCJdLCJjaGFubmVscyI6W10sImFsbF9jaGFubmVscyI6dHJ1ZSwiYWxsX3ByaXZpbGVnZWRfcmVjaXBpZW50X2F0dHJpYnV0ZXMiOnRydWUsImFsbG93ZWRfcHJpdmlsZWdlZF9yZWNpcGllbnRfYXR0cmlidXRlcyI6WyIiXSwiZXhwIjoxNzE5OTMxOTIxfQ.yp8Y3yX-e6kIi9CzJKsSXQslUjG34zQBTaj8Wr_-IP0'
        },
    };
    let results = await axios(config)
    console.log("Results", JSON.stringify(results.data))
    let xmFilter = [{
            "elementType": "form",
            "id": "select",
            "items": [{
                "elementType": "formInputText",
                "name": "filter",
                "label": "Quest Name",
                "required": false
            }],
            "events": [{
                    "eventName": "change",
                    "action": "ajaxUpdate",
                    "targetId": "quest_list",
                    "ajaxRelativePath": "",
                    "propagateArgs": true
                },
                {
                    "eventName": "submit",
                    "action": "ajaxUpdate",
                    "targetId": "quest_list",
                    "ajaxRelativePath": "",
                    "propagateArgs": true
                },
            ]
        },
        {
            "elementType": "list",
            "heading": "Type to show quests",
            "id": "quest_list"
        }
    ]
    let xmPartyList = {
        "elementType": "collapsible",
        "borderTopStyle": "none",
        "title": "Current Party Members",
        "badge": {
            "label": "2",
            "screenReaderLabel": "2 New items",
            "backgroundColor": "red",
            "size": "large"
        },
        "content": [
            // getPartyMembers();
        ]
    }
    let xmNotPartyList = {
        "elementType": "collapsible",
        "borderTopStyle": "none",
        "title": "Current Party Members",
        "badge": {
            "label": "2",
            "screenReaderLabel": "2 New items",
            "backgroundColor": "red",
            "size": "large"
        },
        "content": [
            // getPartyMembers();
        ]
    }
    let xmNametag = {
        "elementType": "nameTag",
        "marginTop": "3rem",
        "id": "standard",
        "name": "Please Sign In",
        "description": "Unsigned User",
        "image": {

        }
    }
    let xmHeader = {
        "elementType": "hero",
        "height": "fluid",
        "contentContainerWidth": "narrow",
        "backgroundImage": {
            "url": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b3ef4d5f-3bac-4ee3-9de2-0689c965a7b7/dg1l8zv-1a2170a4-e2f4-4a3c-b5cb-3ac1d24ed3e3.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2IzZWY0ZDVmLTNiYWMtNGVlMy05ZGUyLTA2ODljOTY1YTdiN1wvZGcxbDh6di0xYTIxNzBhNC1lMmY0LTRhM2MtYjVjYi0zYWMxZDI0ZWQzZTMuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.pbTDZBE9wHmVScZ7JoTGILNoO2_SxyJLa-z4YjfqWew",
            "cropVerticalPosition": "top",
            "overlayType": "gradient",
            "overlayGradientStartColor": "#c9c8c6",
            "overlayGradientAngle": 90
        },
        "content": [{
            "elementType": "heroHeading",
            "heading": "Fantasy Portal ",
            "fontSize": "2rem",
            "textAlignment": "center",
            "marginBottom": "7rem",
            "marginTop": "2em"
        }]
    }
    let xmColumn = {
        "elementType": "responsiveThreeColumn",
        "primaryColumn": {
            "content": [{
                    "elementType": "tabs",
                    "tabStyle": "folder",
                    "marginTop": "3em",
                    "tabs": [{
                            "title": "Available Quests",
                            "content": []
                        },
                        {
                            "title": "Unavailable Quests",
                            "content": []
                        },
                        {
                            "title": "Current Quests",
                            "content": []
                        }
                    ]
                }

            ]
        },
        "secondaryColumn1": {
            "content": [xmNametag]
        },
        "secondaryColumn2": {
            "content": xmFilter
        }
    }
    let xmJson = {
        "metadata": {
            "version": "2",
            "cookies": []
        },
        "contentContainerWidth": "full",
        "content": [xmHeader, xmColumn],
        "elementFields": {}
    }
    if ('queryStringParameters' in event && event.queryStringParameters != null && 'filter' in event.queryStringParameters && event.queryStringParameters.filter != '') {
        let filter = event.queryStringParameters.filter.toLowerCase(); //lowercase everything so we can compare and find
        let searchedQuests = [];
        for (let q of questData.quests) {
            if (q.name.toLowerCase().includes(filter)) {
                searchedQuests.push({
                    "title": `${q.name} <br>Power Required: ${q.recommended_power} Gold: ${q.gold}`,
                    "description": `${q.description}`,
                    "image": {
                        "url": `${q.photo}`,
                        "alt": "Quest Picture"
                    }

                })
            }
        }
        xmJson.elementFields = {
            "items": searchedQuests
        }

    }

    //Get Player Info
    if ('headers' in event && 'authorization' in event.headers) {
        payload = jwt.verify(event.headers.authorization.split(" ")[1], jwkPem(key));
        console.log("Payload", payload);
    }
    if (payload != null) {
        if ('name' in payload) {
            console.log("RECIPIENTS", results.data.recipients)
            getPlayerNameTag()
            xmColumn.secondaryColumn1.content = [{
                "elementType": "container",
                "wrapperStyle": "focal",
                "marginTop": "xloose",
                "marginBottom": "xloose",
                "marginLeft": "none",
                "marginRight": "none",
                "padding": "medium",
                "content": [{
                        "elementType": "blockHeading",
                        "marginTop": "none",
                        "heading": "Your Character",
                        "headingFontSize": "1.5rem"
                    },
                    xmNametag,
                    xmPartyList,
                    xmNotPartyList
                ]
            }]
        }
    }

    function getPlayerNameTag() {
        for (let key of results.data.recipients) {
            if (key.id === payload.sub) {
                player = key.attributes
                pTest = key
                pQuests = player.partyQuests;
                xmNametag.name = player.name;
                xmNametag.description = `<b>Class:</b> ${player.class}<br><b>Race:</b> ${player.race}<br><b>Gold:</b> ${player.gold}<br><b>Power:</b> ${player.power}<br><b>Skills:</b> ${player.skills.join("&nbsp;&#9752;&nbsp;")}`;
                xmNametag.image = { "url": player.photoURL, "alt": "Photo of player" };
                xmNametag.accessoryButton = {
                    "elementType": "linkButton",
                    "title": ">",
                    "actionStyle": "constructive",
                    "link": {
                        "relativePath": "charedit/"
                    },
                    "marginBottom": "xtight"
                };
                getPartyMembers(player)
                break;
            }
        }
    }

    function getPartyMembers(player) {
        console.log("GOLD", player.gold)
        let partyPower = parseInt(player.power);
        let partyGold = parseInt(player.gold);
        xmPartyList.content = []
        xmNotPartyList.content = []
        for (let key of results.data.recipients) {
            if ('partyMembers' in player && player.partyMembers.includes(key.id)) {
                let pm = key.attributes
                console.log("GOLD BEING ADDED", pm.gold)
                partyPower += parseInt(pm.power, 10);
                partyGold += parseInt(pm.gold, 10);
                let partyNameTag = {
                    "elementType": "nameTag",
                    "id": `${pm.nameTag}`,
                    "name": `${pm.name}`,
                    "description": `<b>Class:</b> ${pm.class}<br><b>Race:</b> ${pm.race}<br><b>Gold:</b> ${pm.gold}<br><b>Power:</b> ${pm.power}<br><b>Skills:</b> ${pm.skills.join("&nbsp;&#9752;&nbsp;")}`,
                    "image": {
                        "url": pm.photoURL,
                        "alt": `Photo of ${pm.nameTag}`
                    }
                }
                xmPartyList.title = "Current Party Members";
                xmPartyList.content.push(partyNameTag)
                xmPartyList.badge.label = `${player.partyMembers.length}`

            }
            else {
                if (player.id !== key.id) {
                    let pm = key.attributes
                    let pTest = key
                    let partyNameTag = {
                        "elementType": "nameTag",
                        "id": `${pm.nameTag}`,
                        "name": `${pm.name}`,
                        "description": `<b>Class:</b> ${pm.class}<br><b>Race:</b> ${pm.race}<br><b>Gold:</b> ${pm.gold}<br><b>Power:</b> ${pm.power}<br><b>Skills:</b> ${pm.skills.join("&nbsp;&#9752;&nbsp;")}`,
                        "image": {
                            "url": pm.photoURL,
                            "alt": `Photo of ${pm.nameTag}`
                        }
                    }
                    xmNotPartyList.content.push(partyNameTag)
                    xmNotPartyList.title = "Available Party Members";
                    xmNotPartyList.badge.label = `${xmNotPartyList.content.length}`
                }
            }
        }
        let partyInfo = {
            "elementType": "html",
            "html": `Party Gold: ${partyGold} Party Power: ${partyPower}`
        }
        let addToPartyForm = {
            "elementType": "form",
            "relativePath": "",
            "postType": "foreground",
            "requestMethod": "GET",
            "items": [{
                    "elementType": "formInputText",
                    "name": "s1_first",
                    "label": "Full name",
                    "required": true
                }, {
                    "elementType": "formButton",
                    "name": "s1_submit",
                    "title": "Add To Party",
                    "buttonType": "submit",
                    "actionStyle": "constructive",
                    "minWidth": "8rem"
                }

            ]
        }
        let rmvToPartyForm = {
            "elementType": "form",
            "relativePath": "",
            "postType": "foreground",
            "requestMethod": "GET",
            "items": [{
                    "elementType": "formInputText",
                    "name": "rmvFromParty",
                    "label": "Full name",
                    "required": true
                }, {
                    "elementType": "formButton",
                    "name": "rmvParty_submit",
                    "title": "Remove From Party",
                    "buttonType": "submit",
                    "actionStyle": "constructive",
                    "minWidth": "8rem"
                }

            ]
        }
        xmPartyList.content.unshift(partyInfo)
        xmNotPartyList.content.unshift(addToPartyForm)
        xmPartyList.content.unshift(rmvToPartyForm)
        getCards(partyPower);

    }
    if ('queryStringParameters' in event && event.queryStringParameters != null && 's1_submit' in event.queryStringParameters) {
        if (player.partyMembers.length < 4) {
            let charName = event.queryStringParameters.s1_first.toLowerCase();
            for (let key of results.data.recipients) {
                if (key.attributes.name.toLowerCase() === charName && player.partyMembers.includes(key.id) !== true) {
                    player.partyMembers.push(key.id)
                    updatePartyList()
                    xmJson.metadata.redirectLink = {
                        "relativePath": ""
                    };
                }
            }
        }
        let xmJson
    }
    if ('queryStringParameters' in event && event.queryStringParameters != null && 'rmvParty_submit' in event.queryStringParameters) {
        let charName = event.queryStringParameters.rmvFromParty.toLowerCase();
        for (let key of results.data.recipients) {
            if (key.attributes.name.toLowerCase() === charName && player.partyMembers.includes(key.id) === true) {
                let index = player.partyMembers.indexOf(key.id)
                player.partyMembers.splice(index, 1)
                console.log(player.partyMembers)
                updatePartyList()
                xmJson.metadata.redirectLink = {
                    "relativePath": ""
                };
            }
        }
    }
    async function updatePartyList() {
        let data = JSON.stringify({
            "recipients": [{
                "id": `${pTest.id}`,
                "attributes": {
                    "partyMembers": player.partyMembers
                }
            }]
        });
        config.method = `patch`;
        config.data = data;
        await axios(config)
        console.log("Added new party members")
    }
    // Quest INFO
    function getCards(partyPow) {
        for (let q of questData.quests) {
            if (q.status !== 'busy' && partyPow >= q.recommended_power && pQuests.includes(q.id) === false) {
                xmColumn.primaryColumn.content[0].tabs[0].content.push({
                    "elementType": "list",
                    "itemSize": "large",
                    "imageStyle": "heroLarge",
                    "titleLineClamp": 2,
                    "descriptionLineClamp": 3,
                    "items": [{
                        "title": `${q.name} <br>Power Required: ${q.recommended_power} Gold: ${q.gold}`,
                        "description": `${q.description}`,
                        "image": {
                            "url": `${q.photo}`,
                            "alt": "Quest Picture"
                        }
                    }]
                });
                pAvailQuests.push(q.id)
            }
            else {
                if (pQuests.includes(q.id) === false) {
                    xmColumn.primaryColumn.content[0].tabs[1].content.push({
                        "elementType": "list",
                        "itemSize": "large",
                        "imageStyle": "heroLarge",
                        "titleLineClamp": 2,
                        "descriptionLineClamp": 3,
                        "items": [{
                            "title": `${q.name} <br>Power Required: ${q.recommended_power} Gold: ${q.gold}`,
                            "description": `${q.description}`,
                            "image": {
                                "url": `${q.photo}`,
                                "alt": "Quest Picture"
                            }
                        }]
                    });
                }
                else if (pQuests.includes(q.id)) {
                    xmColumn.primaryColumn.content[0].tabs[2].content.push({
                        "elementType": "list",
                        "itemSize": "large",
                        "imageStyle": "heroLarge",
                        "titleLineClamp": 2,
                        "descriptionLineClamp": 3,
                        "items": [{
                            "title": `${q.name} <br>Power Required: ${q.recommended_power} Gold: ${q.gold}`,
                            "description": `${q.description}`,
                            "image": {
                                "url": `${q.photo}`,
                                "alt": "Quest Picture"
                            }
                        }]
                    })
                }
            }

        }
        xmColumn.secondaryColumn2.content.unshift({
            "elementType": "linkButton",
            "title": "PLAY NOW -->",
            "actionStyle": "emphasized",
            "marginTop": "3rem",
            "marginLeft": "xloose",
            "link": {
                "relativePath": "play-now/"
            },
            "marginBottom": "xtight"
        }, {
            "elementType": "linkButton",
            "title": "Get more quests!",
            "marginTop": "1rem",
            "actionStyle": "emphasized",
            "marginLeft": "xloose",
            "marginBottom": "xloose",
            "link": {
                "relativePath": "add_quests"
            }
        }, )
    }
    //Char editor
    if ('rawPath' in event && event.rawPath === "/charedit/") {
        xmJson = {
            "metadata": {
                "version": "2.0"
            },
            "contentContainerWidth": "narrow",
            "content": [{
                    "elementType": "detail",
                    "title": `${player.name}`,
                    "id": "playerDetail",
                    "thumbnailMarginTop": "xtight",
                    "description": `<b>Class:</b> ${player.class}<br><b>Race:</b> ${player.race}<br><b>Gold:</b> ${player.gold}<br><b>Power:</b> ${player.power}<br><b>Skills:</b> ${player.skills.join("&nbsp;&#9752;&nbsp;")}`,
                    "thumbnail": {
                        "url": player.photoURL,
                    },
                    "thumbnailSize": "large",
                    "thumbnailBorderRadius": "1rem",

                },
                {
                    "elementType": "form",
                    "relativePath": "./",
                    "postType": "foreground",
                    "requestMethod": "POST",
                    "items": [{
                            "elementType": "formInputText",
                            "name": "charNameEdit",
                            "label": "Change Your Name",
                        }, {
                            "elementType": "formInputText",
                            "name": "charRaceEdit",
                            "label": "Change Your Race",
                        }, {
                            "elementType": "formButton",
                            "name": "charEditSubmit",
                            "title": "Change Player Information",
                            "buttonType": "submit",
                            "actionStyle": "constructive",
                            "minWidth": "8rem"
                        },
                        {
                            "elementType": "linkButton",
                            "title": "Go Back",
                            "actionStyle": "constructive",
                            "link": {
                                "relativePath": ""
                            },
                            "marginBottom": "xxtight",
                            "marginTop": "xxtight"
                        },

                    ]
                }
            ]

        }
    }
    //Add Quests
    if ('rawPath' in event && event.rawPath === "/add_quests") {
        xmJson = {
            "metadata": {
                "version": "2.0"
            },
            "contentContainerWidth": "narrow",
            "content": [{
                "elementType": "form",
                "id": "assisted_multi_select",
                "relativePath": "add_quests/",
                "postType": "foreground",
                "requestMethod": "POST",
                "items": [{
                    "elementType": "formInputAssistedSelect",
                    "name": "questAdd",
                    "label": "Add your quests here!",
                    "options": populateQuestSelect()
                }, {
                    "elementType": "formButton",
                    "name": "questAddSubmit",
                    "title": "Take on your quests!",
                    "buttonType": "submit",
                    "actionStyle": "constructive",
                    "minWidth": "8rem"
                }, {
                    "elementType": "linkButton",
                    "title": "Go Back",
                    "actionStyle": "constructive",
                    "link": {
                        "relativePath": ""
                    },
                    "marginBottom": "xxtight",
                    "marginTop": "xxtight"
                }, ]
            }]
        }
        if (event.requestContext.http.method.toLowerCase() == 'post') {
            console.log("POSTED QUESTS")
        }

    }
    if (event.requestContext.http.method.toLowerCase() == 'post') {
        let body = new Buffer(event.body, 'base64').toString()
        let params = new URLSearchParams(body)
        let charNameEdit = params.get('charNameEdit')
        let charRaceEdit = params.get('charRaceEdit')
        let questAdd = params.get('questAdd')
        let questStart = params.get('questToDo')
        console.log("BODY", body)
        if (charNameEdit != '' && charNameEdit != null) {
            let data = JSON.stringify({
                "recipients": [{
                    "id": `${pTest.id}`,
                    "attributes": {
                        "name": charNameEdit
                    }
                }]
            });
            config.method = `patch`;
            config.data = data;
            await axios(config)
            console.log("NAME CHANGED")
        }
        if (charRaceEdit != '' && charRaceEdit != null) {
            let data = JSON.stringify({
                "recipients": [{
                    "id": `${pTest.id}`,
                    "attributes": {
                        "race": charRaceEdit
                    }
                }]
            });
            config.method = `patch`;
            config.data = data;
            await axios(config)
            console.log("Race CHANGED")
        }
        if (questAdd != '' && questAdd != null) {
            player.partyQuests.push(questAdd);
            let data = JSON.stringify({
                "recipients": [{
                    "id": `${pTest.id}`,
                    "attributes": {
                        "partyQuests": player.partyQuests
                    }
                }]
            });
            config.method = `patch`;
            config.data = data;
            await axios(config)
        }
        if (questStart != '' && questStart != null) {
            let gSplit = 0;
            let pSplit = 0;
            for (let q of questData.quests) {
                if (q.id === questStart) {
                    gSplit = parseInt(q.gold) / (player.partyMembers.length + 1)
                    pSplit = parseInt(q.recommended_power) / (player.partyMembers.length + 1)
                }
            }
            for (let i = 0; i < player.partyMembers.length; i++) {
                console.log(player.partyMembers[i])
                console.log(Math.ceil(pSplit))
                console.log(Math.ceil(gSplit))
                let data1 = JSON.stringify({
                    "recipients": [{
                        "id": `${player.partyMembers[i]}`,
                        "attributes": {
                            "gold": `${Math.ceil(gSplit)}`,
                            "power": `${Math.ceil(pSplit)}`
                        }
                    }]
                });
                config.method = `patch`;
                config.data = data1;
                await axios(config)
                console.log("Send to Axios")
            }
            let data = JSON.stringify({
                    "recipients": [{
                        "id": `${pTest.id}`,
                        "attributes": {
                            "gold": `${Math.ceil(gSplit)}`,
                            "power": `${Math.ceil(pSplit)}`
                        }
                    }]
                });
                config.method = `patch`;
                config.data = data;
                await axios(config)
        }
        xmJson.metadata.redirectLink = {
            "relativePath": ""
        };

    }

    function populateQuestSelect() {
        console.log(pAvailQuests);
        let questArr = []
        for (let q of questData.quests) {
            if (pAvailQuests.includes(q.id)) {
                let questGroup = {
                    "value": q.id,
                    "label": `${q.name}`
                }
                console.log(questGroup)
                questArr.push(questGroup)
            }
        }
        return questArr;
    }
    //Play now
    if ('rawPath' in event && event.rawPath === "/play-now/") {
        xmJson = {
            "metadata": {
                "version": "2"
            },
            "contentContainerWidth": "narrow",
            "content": [{
                "elementType": "form",
                "id": "assisted_multi_select",
                "relativePath": "/play-now/",
                "postType": "foreground",
                "requestMethod": "GET",
                "items": [{
                    "elementType": "formInputAssistedSelect",
                    "name": "questToLoad",
                    "label": "Start your quests here!",
                    "options": populatePlay()
                }, {
                    "elementType": "formButton",
                    "name": "questLoad",
                    "title": "Load Quest",
                    "buttonType": "submit",
                    "actionStyle": "constructive",
                    "minWidth": "8rem"
                }, {
                    "elementType": "linkButton",
                    "title": "Go Back",
                    "actionStyle": "constructive",
                    "link": {
                        "relativePath": ""
                    },
                    "marginBottom": "xxtight",
                    "marginTop": "xxtight"
                }, ]
            }]
        }
        if ('queryStringParameters' in event && 'questLoad' in event.queryStringParameters) {
            let curQuest = null
            for (let q of questData.quests) {
                if (q.id === event.queryStringParameters.questToLoad) {
                    curQuest = q;
                }
            }
            xmJson.content = [{
                    "elementType": "form",
                    "id": "assisted_multi_select",
                    "relativePath": "/play-now/",
                    "postType": "foreground",
                    "requestMethod": "GET",
                    "items": [{
                        "elementType": "formInputAssistedSelect",
                        "name": "questAdd",
                        "label": "Start your quests here!",
                        "options": populatePlay()
                    }, {
                        "elementType": "formButton",
                        "name": "questLoad",
                        "title": "Load Quest",
                        "buttonType": "submit",
                        "actionStyle": "constructive",
                        "minWidth": "8rem"
                    }, {
                        "elementType": "linkButton",
                        "title": "Go Back",
                        "actionStyle": "constructive",
                        "link": {
                            "relativePath": ""
                        },
                        "marginBottom": "xxtight",
                        "marginTop": "xxtight"
                    }, ]
                },
                {
                    "elementType": "divider",
                    "borderStyle": "solid"
                }, {
                    "elementType": "detail",
                    "title": `${curQuest.name}`,
                    "id": "playerDetail",
                    "thumbnailMarginTop": "xtight",
                    "description": `${curQuest.description}<br><br>Recommended Power: ${curQuest.recommended_power} Gold: ${curQuest.gold}`,
                    "thumbnail": {
                        "url": curQuest.photo,
                    },
                    "thumbnailSize": "large",
                    "thumbnailBorderRadius": "1rem",

                },
                {
                    "elementType": "form",
                    "id": "quest",
                    "relativePath": "",
                    "postType": "foreground",
                    "requestMethod": "POST",
                    "hidden": true,
                    "items": [{
                        "elementType": "formInputText",
                        "name": "questToDo",
                        "label": "questToDo",
                        "value": curQuest.id,
                        "required": true
                    }]
                },

                {
                    "elementType": "linkButton",
                    "title": "Start Quest",
                    "actionStyle": "constructive",
                    "events": [{
                        "eventName": "click",
                        "action": "submitForm",
                        "targetId": "quest"
                    }],
                    "marginBottom": "xtight"
                }
            ]
        }
    }

    function populatePlay() {
        let questArr = [];
        for (let q of questData.quests) {
            if (pQuests.includes(q.id)) {
                let questGroup = {
                    "value": q.id,
                    "label": `${q.name}`
                }
                console.log(questGroup)
                questArr.push(questGroup)
            }
        }
        return questArr;
    }


    const response = {
        statusCode: 200,
        body: JSON.stringify(xmJson),
    };
    return response;
};
