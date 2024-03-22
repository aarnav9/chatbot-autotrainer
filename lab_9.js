/*
    TODO: - import axios so I can make calls to the communicate database to get my character's information about who is in my party and all people in the communicate database (comm db) - done
          - get payload information to find out who is logged - Done
            - we need their ID so we can compare against results from comm db and get their current party information
          - write a form that shows all the people in the party with those selected who are currently in my party that allows me to remove and add new people
          - save selected party information to the comm db while making sure I only select up to 4 people
          - save total party power and total party gold to temp storage so I can display it on the portal screen
*/

import axios from 'axios';
import jwkPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
const key = { "kid": "b1cc20c8-9118-4fdd-b8da-8de12d393211", "kty": "RSA", "n": "s6fvHnLTRpqL9i7ZzQCiV8uMP-FJL5mO94PGRobQCnFwFpFFravTkOChxQA4LZ94fWHtE85qibiMGCyRq9aaRfmbU1sYZ1NmGwBXGg3jMDJX3Z7IFDubQdvH4KrCz54yXOvMDbEsxwFBryYqRdllxIrxHD1FT82BVJ9GBTkJddhwxUenCk7X8oziOglfpic1W9MxGO2F22f11Q8Hm6ZtSPMsl0HXzbct9WRqC5IbzuAAoj6oZ8qMz3bP7kkfHnI7Te6pDnkEjk8uho-9KwAllipWoT9FrnZMpXx3yIo4afrnR6r5tb5-zPJ7iJphQjuk0lcT_xRYYV1quBAsBqbBdQ", "e": "AQAB" };
let config = {
    maxBodyLength: Infinity,
    url: 'https://communicate.modolabs.net/api/applications/kayla-sb/test/recipients',
    headers: {
        'Accept': 'application/vnd.modo.communicate.v2',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6ImViNGJiNmUwLTIwYjUtNDEwMy04MTdiLWRjOWVjZDJlMTUyMyJ9.eyJpc3MiOiJjb21tdW5pY2F0ZSIsImF1ZCI6ImNvbW11bmljYXRlIiwianRpIjoiZWI0YmI2ZTAtMjBiNS00MTAzLTgxN2ItZGM5ZWNkMmUxNTIzIiwiaWF0IjoxNjg4Mzk1OTE4LCJuYmYiOjE2ODgzNjc2MDAsInN1YiI6ImtheWxhLXNiIiwic2NvcGVzIjpbInJlY2lwaWVudF9zY2hlbWFzX21hbmFnZSIsInJlY2lwaWVudF9zY2hlbWFzX3ZpZXciLCJyZWNpcGllbnRzX2NyZWF0ZSIsInJlY2lwaWVudHNfZGVsZXRlIiwicmVjaXBpZW50c192aWV3Il0sInRhcmdldHMiOlsidGVzdCJdLCJjaGFubmVscyI6W10sImFsbF9jaGFubmVscyI6dHJ1ZSwiYWxsX3ByaXZpbGVnZWRfcmVjaXBpZW50X2F0dHJpYnV0ZXMiOnRydWUsImFsbG93ZWRfcHJpdmlsZWdlZF9yZWNpcGllbnRfYXR0cmlidXRlcyI6WyIiXSwiZXhwIjoxNzE5OTMxOTE4fQ.gT6z72jY5hcBuy7JniPgRev9-GMsPJj0KY0cNcwI-Gg'
    }
};

export const handler = async (event) => {
    console.log("HTTP Request", JSON.stringify(event));

    //#region Functions
    async function getPartyList() {
        config.method = 'get';

        let rstls = await axios(config);

        console.log("Party List Data", JSON.stringify(rstls.data));
        return rstls.data;
    }

    async function updatePartyList(characterId, arrayOfPartyMembers) {
        let data = JSON.stringify({
            "recipients": [{
                "id": characterId,
                "attributes": {
                    "partyMembers": arrayOfPartyMembers
                }
            }]
        });

        config.method = 'patch';
        config.data = data;
        console.log("Config", JSON.stringify(config));
        await axios(config);
        //nothing to return, we just added new people to the party
        console.log("Added new party members");
    }


    async function getCurrentCharacterInfo(characterId, characterArray) {
        const character = characterArray.find( ({ id }) => id === characterId);
        
        console.log("Character found:", JSON.stringify(character));
        
        return character;
    }
    
    function bodyToJson(text) {
        
        let temp1 = text.split("&");
        let jsonReturned = {};
        for (let i = 0; i < temp1.length; i++) {
            let temp2 = temp1[i].split("=");
            let tempVal = decodeURIComponent(temp2[1]).replace(/\+/g, " ");
            jsonReturned[decodeURIComponent(temp2[0])] = tempVal; 
        }
    
        return jsonReturned;        
    }
    
    //#endregion

    let payload = null;

    if ('headers' in event) { // && 'authorization' in event.headers) {
        if ('authorization' in event.headers) {
            payload = jwt.verify(event.headers.authorization.replace("Bearer ", ""), jwkPem(key));
        }
        else if ('Authorization' in event.headers) {
            payload = jwt.verify(event.headers.Authorization.replace("Bearer ", ""), jwkPem(key));
        }
        console.log("Payload", payload);
    }

    //#region for post requests
    if ('httpMethod' in event && event.httpMethod.toLowerCase()== 'post') {
        let body = bodyToJson(event.body);
        console.log(JSON.stringify(body));
        
        //write the values to communicate
        let newParty = [];
        for (const [key, value] of Object.entries(body)) {
            console.log('Key', key, "value", value);
            if (key.includes("party")) {
                newParty.push(value);
            }
        }
        
        
        updatePartyList(payload.sub, newParty);
        
    }
    //#endregion
    

    let everyone = await getPartyList();
    let me = await getCurrentCharacterInfo(payload.sub, everyone.recipients);
    
    //build our options list
    let options = {}, values = [];
    
    for (let member of everyone.recipients) {
        // console.log("Member", JSON.stringify(member));
        if (member.id != payload.sub) 
            options[member.id] = member.attributes.name + " - Class: " + member.attributes.class;
            
        // console.log("Me", JSON.stringify(me), "Member Id", member.id);
        // console.log(me.partyMembers.includes(member.id));
        if (me.attributes.partyMembers != null && me.attributes.partyMembers.includes(member.id)) {
            values.push(member.id);
        }
    }
    
    console.log(JSON.stringify(options));
    console.log(JSON.stringify(values));
    // await updatePartyList();
    
    let xmJson = {
        "metadata": {
            "version": "2.0"
        },
        "content": [{
                "elementType": "form",
                "id": "checkbox",
                "items": [{
                    "elementType": "formInputCheckboxGroup",
                    "name": "party",
                    "label": "Characters",
                    "description": "You can have up to 4 party members, select 4 then click Submit.",
                    "options": options,
                    "value":  values
                }],
                "buttons": [
                    {
                        "elementType": "formButton",
                        "name": "s1_submit",
                        "title": "Submit",
                        "buttonType": "submit",
                        "actionStyle": "constructive",
                        "minWidth": "8rem"
                    }
                ]
            }

        ]
    };

    const response = {
        statusCode: 200,
        body: JSON.stringify(xmJson),
    };
    return response;
};
