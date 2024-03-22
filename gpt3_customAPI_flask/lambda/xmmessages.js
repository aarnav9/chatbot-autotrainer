let xmForum = {
	"elementType": "forum",
	"noItemsMessage": "No replies",
	"topic": {
		"elementType": "forumItem",
		"actions": {
			"contents": [{
					"elementType": "sideBySide",
					"right": {
						"content": [{
							"actionType": "link",
							"disabled": false,
							"elementType": "linkButton",
							"events": [{
								"action": "toggle",
								"animation": "slide",
								"eventName": "click",
								"targetId": "topic"
							}],
							"link": {
								"accessoryIcon": "comment",
								"relativePath": ""
							},
							"title": "Reply to topic",
							"icon": "reply",
							"size": "small"
						}]
					}
				},
				{
					"content": [{
						"elementType": "form",
						"items": [{
								"elementType": "formInputText",
								"name": "s1_first",
								"label": "URL:",
								"required": true
							},
							{
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
								"elementType": "buttonContainer",
								"horizontalAlignment": "right"
							}
						],
						"relativePath": "./reply",
						"id": "topicform"
					}],
					"elementType": "container",
					"hidden": true,
					"margin": "none",
					"id": "topic"
				}
			]
		},
		"body": "<p>Ask any questions you may have about school or the outside world (Powered by gpt3)</p>",
		"title": "Welcome to testudoChat",
		"quoteBody": "",
		"quoteAuthor": ""
	}
}