export const handler = async(event) => {
    let xmjson = {
    "metadata": {
        "version": "2.0"
    },
    "contentContainerWidth": "narrow",
    "content": [
        {
            "elementType": "form",
            "heading": "Quest Locations",
            "id": "select",
            "items": [
                {
                    "elementType": "formInputSelect",
                    "name": "select",
                    "nested": true,
                    "label": "Select region",
                    "options": {
                        "caramel": "Caramel",
                        "chocolate": "Chocolate",
                        "jackfruit": "Jackfruit",
                        "rockyroad": "Rocky Road",
                        "strawberry": "Strawberry",
                        "vanilla": "Vanilla"
                    },
                    "progressiveDisclosureItems": {
                        "chocolate": [
                            {
                                "elementType": "formInputSelect",
                                "name": "city",
                                "label": "City",
                                "nested": true,
                                "required": true,
                                "options": {
                                    "Boise": "Boise"
                                },
                                "progressiveDisclosureItems": {
                                    "Boise": [
                                        {
                                            "elementType": "formInputSelect",
                                            "name": "building",
                                            "label": "Building",
                                            "nested": true,
                                            "required": true,
                                            "options": {
                                                "main_street": "Main Street"
                                            },
                                            "progressiveDisclosureItems": {
                                                "main_street": [
                                                    {
                                                        "elementType": "formInputRadio",
                                                        "name": "floor",
                                                        "label": "Floor",
                                                        "options": {
                                                            "1": "1",
                                                            "2": "2",
                                                            "3": "3",
                                                            "4": "4"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    ]
}
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
