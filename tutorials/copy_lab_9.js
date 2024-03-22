import axios from 'axios';
import jwt from 'jsonwebtoken';
import data from './quests.mjs';
import jwkPem from 'jwk-to-pem';

const characters = {}; // HashMap to store characters
const Party = Object.create(null); // HashMap to store party members

const key = {
	"kid": "18297e90-2497-48b2-8119-c268f37d48cb",
	"kty": "RSA",
	"n": "tWhZA9Kj4QMSw6KputrR9-rrOl-Uz2jaUMdI7oZEpKJuiC8ckOJ_WxxnhW31HvrhTnv9ui11x8pyIqbJfWnuBt0JScy9wdILp_Y829vaoDnxMXusJ7AeELdgjPQeHT9GMW0uf7N6pHUz75J26qshmRvI1BNQfDJPfSJ1VO9fakSXD02_rfI4CLBETixqgAPm_iWtnj43-LWoO-isFRZltoej-VdJ2pKW82d3LDyWNc0lV7-Bi5oiRbUD_0mJEOuCUs-yOfxhVT3T2w_VTnwllkISgAVN60AqFj24fgJh8QuuFzWkFr4Wmq1SnboDPmqoyQWa381pfeZSNSG2740TnQ",
	"e": "AQAB"
};

export const handler = async (event) => {
	console.log("HTTP Request", event);

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

	let results = await axios(config);
	console.log("HTTP Response", JSON.stringify(results.data));

	let axiosRes = results.data.recipients;

	let xmJson = null,
		xmPartyInfo = null,
		xmQuests = null,
		payload = null,
		xmParty = null,
		xmQuestTabs = null,
		xmCharactersTab = null,
		filter = null,
		xmSearch = null,
		characterGold = null,
		characterPower = null,
		xmPartyPower = null,
		xmPartyGold = null;

	//#region Authorization
	let xmNametag = {
		"elementType": "nameTag",
		"id": "standard",
		"name": "Please Sign In",
		"description": "Unsigned User",
		"image": {

		}
	}

	if ('headers' in event) {
		if ('authorization' in event.headers) {
			payload = jwt.verify(event.headers.authorization.split(" ")[1], jwkPem(key));
		} else if ('Authorization' in event.headers) {
			payload = jwt.verify(event.headers.Authorization.split(" ")[1], jwkPem(key));
		}
		console.log("Payload", payload);
	}

	if (payload != null) {
		if ('name' in payload) {
			xmNametag.name = payload.name;
			xmNametag.description = `<b>Class:</b> ${payload.class}<br><b>Race:</b> ${payload.race}<br><b>Gold:</b> ${payload.gold}<br><b>Power:</b> ${payload.power}<br><b>Skills:</b> ${payload.skills.join("&nbsp;&#9752;&nbsp;")}`;
			xmNametag.image = {
				"url": payload.photo,
				"alt": `Photo of ${payload.name}`
			};
			characterGold = payload.gold;
		}
	}
	//#endregion

	//#region Quests
	// Change in JSON observed, need to see new JSON, i think same issue as above where its not refreshing the new Json
	let xmFilter = {
		"elementType": "form",
		"id": "select",
		"items": [{
			"elementType": "formInputSelect",
			"name": "filter",
			"label": "Filter results",
			"options": [{
					"label": "Show all",
					"value": "none"
				},
				{
					"label": "Difficulty",
					"value": [{
							"value": "easy",
							"label": "easy"
						},
						{
							"value": "medium",
							"label": "medium"
						},
						{
							"value": "hard",
							"label": "hard"
						}
					]
				},
				{
					"label": "Status",
					"value": [{
							"value": "available",
							"label": "available"
						},
						{
							"value": "busy",
							"label": "busy"
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

	function getCards(filter) {
		let xmCards = [];

		for (let quest of data.quests) {
			if (filter == null || filter == 'none' || filter.includes(quest.status) || filter.includes(quest.difficulty)) {
				xmCards.push({
					"elementType": "contentCard",
					"size": "small",
					"imageStyle": "fullbleedGradient",
					"image": {
						"url": quest.photo,
						"alt": quest.name
					},
					"title": quest.name,
					"label": quest.status,
					"labelTextColor": quest.status == 'available' ? "theme:available_focal_text_color" : "theme:alarm_focal_text_color",
					"description": `Difficulty: ${quest.difficulty}<br>Gold earned: ${quest.gold.toString()}`
				});
			}
		}

		return xmCards;
	}

	let xmCardSet = {
		"elementType": "cardSet",
		"heading": "Quests",
		"id": "quest_cards",
		"marginTop": "medium",
		"items": getCards(),
	};

	if ('queryStringParameters' in event && event.queryStringParameters != null && 'filter' in event.queryStringParameters) {
		xmCardSet = {
			"elementType": "cardSet",
			"heading": "Quests",
			"id": "quest_cards",
			"marginTop": "medium",
			"items": getCards(event.queryStringParameters.filter),
		};
		console.log("filter", event.queryStringParameters.filter);
	}

	console.log("xmCardSet", xmCardSet);

	xmQuests = {
		"elementType": "container",
		"content": [
			xmFilter,
			xmCardSet
		]
	};

	console.log("xmQuests", xmQuests);
	//#endregion

	//#region Party Information
	let characterArray = [];
	let nameArray = [];
	let goldTot = 0;
	let powerTot = 0;
	let partyArray = [];
	let maxGold = [];
	let maxPower = [];

	for (let i = 0; i < axiosRes.length; i++) {
		const character = axiosRes[i];
		let charInfo = "Gold: " + character.attributes.gold + ", Power: " + character.attributes.power + ", Skills: " + character.attributes.skills.join(", ");
		characterArray.push({
			"title": character.attributes.name,
			"description": charInfo,
			"image": {
				"url": character.attributes.photoURL,
				"alt": character.attributes.name
			}
		})
		nameArray.push({
			"value": character.id,
			"label": character.attributes.name
		});
		goldTot += parseInt(character.attributes.gold);
		powerTot += parseInt(character.attributes.power);
		maxGold.push(parseInt(character.attributes.gold));
		maxPower.push(parseInt(character.attributes.power));
		characters[character.id] = character;
	}

	// find current character and delete from array
	for (let i = 0; i < characterArray.length; i++) {
		if (characterArray[i].title == xmNametag.name) {
			characterArray.splice(i, 1);
		}
	}

	for (let i = 0; i < nameArray.length; i++) {
		if (nameArray[i].label == xmNametag.name) {
			nameArray.splice(i, 1);
		}
	}

	console.log("Characters", characters);
	console.log("maxGold", maxGold);
	console.log("maxPower", maxPower);

	let partyGold = 0;
	let partyPower = 0;

	function maxGoldFunc() {
		let max = 0;
		let arr = maxGold.reverse(maxGold.sort());
		for (let i = 0; i < 4; i++) {
			max += arr[i];
		}
		return max;
	}

	console.log("maxGoldFunc", maxGoldFunc());

	function maxPowerFunc() {
		let max = 0;
		let arr = maxPower.reverse(maxPower.sort());
		for (let i = 0; i < 4; i++) {
			max += arr[i];
		}
		return max;
	}

	console.log("maxPowerFunc", maxPowerFunc());

	function addToParty(characterId) {
		const character = characters[characterId];
		let charInfo = "Gold: " + character.attributes.gold + ", Power: " + character.attributes.power + ", Skills: " + character.attributes.skills.join(", ");
		if (Party[characterId]) {
			removeFromParty(characterId);
			partyGold -= character.attributes.gold;
		} else {
			Party[characterId] = character;
			partyArray.push({
				"title": character.attributes.name,
				"description": charInfo,
				"image": {
					"url": character.attributes.photoURL,
					"alt": character.attributes.name
				}
			});
			partyGold += parseInt(character.attributes.gold);
			partyPower += parseInt(character.attributes.power);
		}
	}

	function removeFromParty(characterId) {
		delete Party[characterId];
		const index = partyArray.findIndex((character) => character.title === characters[characterId].attributes.name);
		if (index !== -1) {
			partyArray.splice(index, 1);
		}
	}

	// Test
	for (let i = 0; i < 4; i++) {
		const character = axiosRes[i];
		addToParty(character.id);
	}

	xmParty = {
		"elementType": "statusList",
		"id": "status_and_details",
		"marginTop": "none",
		"listStyle": "padded",
		"showAccessoryIcons": false,
		"items": characterArray,
	};

	xmSearch = {
		"elementType": "form",
		"id": "assisted_select",
		"items": [{
			"elementType": "formInputAssistedSelect",
			"name": "assisted_select",
			"label": "Add/Remove Party Member",
			"value": "",
			"options": nameArray,
		}]
	};

	xmPartyGold = {
		"elementType": "availability",
		"id": "available_offline",
		"availableNumber": partyGold,
		"availableLabel": "Party Gold",
		"availableColor": "theme:primary_text_color",
		"otherNumber": maxGoldFunc() - partyGold,
		"otherLabel": "Possible Gold",
		"marginTop": "none",
		"marginBottom": "medium"
	}

	xmPartyPower = {
		"elementType": "availability",
		"id": "available_offline",
		"availableNumber": partyPower,
		"availableLabel": "Party Power",
		"availableColor": "theme:primary_text_color",
		"otherNumber": maxPowerFunc() - partyPower,
		"otherLabel": "Possible Power",
		"marginTop": "none",
		"marginBottom": "medium"
	}

	console.log("xmSearch", xmSearch);
	console.log("nameArray", nameArray);

	xmPartyInfo = {
		"elementType": "list",
		"itemSize": "large",
		"imageStyle": "thumbnailSmall",
		"titleLineClamp": 2,
		"descriptionLineClamp": 3,
		"items": partyArray
	};

	// if character name is clicked call add to party, if clicked again remove
	if ('queryStringParameters' in event && event.queryStringParameters != null && 's1_submit' in event.queryStringParameters) {
		addToParty(event.queryStringParameters.s1_submit);
	}
	//#endregion

	xmJson = {
		"metadata": {
			"version": "2.0"
		},
		"contentContainerWidth": "narrow",
		"content": [{
				"elementType": "blockHeading",
				"headingLevel": 4,
				"marginBottom": "none",
				"heading": "Navigation",
				"headingTextColor": "gray"
			},
			{
				"elementType": "tabs",
				"forceAjaxOnLoad": false,
				"tabStyle": "folder",
				"tabs": [{
						"title": "Quests",
						"content": [xmQuests]
					},
					{
						"title": "Character",
						"content": [xmNametag]
					},
					{
						"title": "Party Information",
						"content": [xmParty, xmSearch, xmPartyInfo, xmPartyGold, xmPartyPower]
					}
				]
			}
		]
	};

	console.log("XM JSON", JSON.stringify(xmJson));

	console.log("Party", partyGold);
	console.log("Party", partyPower);

	const response = {
		statusCode: 200,
		body: JSON.stringify(xmJson),
	};

	return response;

};