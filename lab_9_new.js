import axios from 'axios';
import jwt from 'jsonwebtoken';
import data from './quests.mjs';
import jwkToPem from 'jwk-to-pem';

export const handler = async (event) => {

	const characters = {}; // HashMap to store characters
	const Party = Object.create(null); // HashMap to store party members

	const key = {
		"kid": "18297e90-2497-48b2-8119-c268f37d48cb",
		"kty": "RSA",
		"n": "tWhZA9Kj4QMSw6KputrR9-rrOl-Uz2jaUMdI7oZEpKJuiC8ckOJ_WxxnhW31HvrhTnv9ui11x8pyIqbJfWnuBt0JScy9wdILp_Y829vaoDnxMXusJ7AeELdgjPQeHT9GMW0uf7N6pHUz75J26qshmRvI1BNQfDJPfSJ1VO9fakSXD02_rfI4CLBETixqgAPm_iWtnj43-LWoO-isFRZltoej-VdJ2pKW82d3LDyWNc0lV7-Bi5oiRbUD_0mJEOuCUs-yOfxhVT3T2w_VTnwllkISgAVN60AqFj24fgJh8QuuFzWkFr4Wmq1SnboDPmqoyQWa381pfeZSNSG2740TnQ",
		"e": "AQAB"
	};

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

	let axiosRes = results.data;
	console.log("Load", axiosRes)

	let xmJson = {
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
				"tabStyle": "folder",
				"tabs": [{
						"title": "Quests",
						"content": []
					},
					{
						"title": "Characters",
						"content": []
					},
					{
						"title": "Party Information",
						"content": []
					}
				]
			}
		]
	};

	xmStatusList();


	// QUEST INFORMATION
	// Code to push xmstatuslist to xmJson
	function xmStatusList() {
		if ('pathParameters' in event && event.pathParameters == null) {
			let xmStatusList = {
				"elementType": "statusList",
				"id": "status_no_details",
				"heading": "Quest Statuses",
				"marginTop": "none",
				"listStyle": "padded",
				"items": []
			};

			if (data != null) {
				for (let i = 0; i < data.quests.length; i++) {
					xmStatusList.items.push({
						"title": data.quests[i].name,
						"statusText": data.quests[i].status.charAt(0).toUpperCase() + data.quests[i].status.slice(1),
						"status": data.quests[i].status == "available" ? data.quests[i].status : "unavailable",
						"statusDescriptor": `and pays ${data.quests[i].gold}`,
						"link": {
							"relativePath": `/details/${data.quests[i].id}`
						}
					});
				}
			}

			xmJson.content[0].tabs[0].content.push(xmStatusList);
		} else if ('pathParameters' in event && 'id' in event.pathParameters) {

			const quest = data.quests.find(({
				id
			}) => id === event.pathParameters.id);

			xmJson.content[0].tabs[0].content.push({
				"elementType": "detail",
				"id": "image_thumbnail",
				"title": quest.name,
				"description": `Difficulty: ${quest.difficulty}<br>Power Required: ${quest.recommended_power}<br>Duration: ${quest.duration}`,
				"byline": `Gold Rewarded: ${quest.gold} `,
				"body": quest.description,
				"thumbnail": {
					"url": quest.photo,
					"alt": quest.name
				},
				"thumbnailSize": "large",
				"thumbnailBorderRadius": "1rem"
			});
		}
	}

	// CHARACTER INFORMATION
	for (let i = 0; i < axiosRes.length; i++) {
		const character = axiosRes[i];
		characters[character.id] = character;
	}

	console.log("Characters", characters);

	function swapCharacterAttribute(characterId, attribute, attributeType) {
		const character = characters[characterId];
		if (character) {
			if (attributeType in character) {
				const currentValue = character[attributeType];
				character[attributeType] = attribute;
			}
		}
	}

	function addToParty(characterId) {
		const character = characters[characterId];
		if (character) {
			Party[characterId] = character;
		}
	}

	function removeFromParty(characterId) {
		delete Party[characterId];
	}
	// Code to display all characters

	// Code to click on character to add to party with check
	// Code to click on character to remove from party with check
	// Code to click on character and change attribute


	// PARTY INFORMATION
	function partyGold() {
		let totalGold = 0;
		for (const characterId in Party) {
			const character = Party[characterId];
			totalGold += parseInt(character.gold);
		}
		return totalGold;
	}

	function partyPower() {
		let totalPower = 0;
		const partyMembers = Object.values(Party);
		for (let i = 0; i < partyMembers.length; i++) {
			const character = partyMembers[i];
			totalPower += parseInt(character.power);
		}
		return totalPower;
	}

	function partyInformation() {
		const partyMembers = Object.values(Party);
		const partyInfo = [];

		partyInfo.push({
			elementType: "blockHeading",
			headingLevel: 4,
			marginBottom: "none",
			heading: "Party Information",
			headingTextColor: "gray"
		});

		if (partyMembers.length > 0) {
			for (let i = 0; i < partyMembers.length; i++) {
				const character = partyMembers[i];
				partyInfo.push({
					elementType: "text",
					text: `Character ID: ${character.id}`,
					textStyle: "strong"
				});
				partyInfo.push({
					elementType: "text",
					text: `Name: ${character.name}`
				});
				partyInfo.push({
					elementType: "text",
					text: `Gold: ${character.gold}`
				});
				// Add more attributes as needed
				partyInfo.push({
					elementType: "divider"
				});
			}

			// Calculate total gold
			const totalGold = partyGold();

			// Calculate total power
			const totalPower = partyPower();

			partyInfo.push({
				elementType: "divider"
			});
			partyInfo.push({
				elementType: "text",
				text: `Total Gold: ${totalGold}`
			});
			partyInfo.push({
				elementType: "text",
				text: `Total Power: ${totalPower}`
			});
		} else {
			partyInfo.push({
				elementType: "text",
				text: "No party members."
			});
		}

		xmJson.content[0].tabs[2].content = partyInfo;
	}

	return {
		statusCode: 200,
		body: JSON.stringify(xmJson)
	};
};