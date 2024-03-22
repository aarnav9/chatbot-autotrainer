import jwkPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
const key = {
        "kid": "e17ae40d-d6c0-450f-9aac-2f565b3b1ca6",
        "kty": "RSA",
        "n": "3FOcqs0U3r7r8D_QnxiLgiCJ2 gV30uJFlJOC8OE9GGtlslKckoEHgji7iOrbtOEWGzHhZEOAG7E05iAHKDV -ZohAMruicSS3bd7xLw_8pCswlvd0 JpB4vjgGmwh1DqwanVlIYh6XD1Tllu5hfD6R89xHmz_akB6RBV -vDbErPqOxAs66LV8REDsc6FxdBOYcCHu9QqjsnDgUmoEuZVzeAozxBvGv5 -krHoIHZHgMjvCK - ljS1egpBwS -GjbDcYMSEmsabuFhEdEvBLqP_cZG8Qo609Xy113 YcjFFj0duRYbCBSW_Z_JOKpGXEagIzRd1hR258zsGzuwluaIpsGXXVQ ","e ":"AQAB "};
        export const handler = async (event) => {
            console.log("HTTP Request", JSON.stringify(event));
            let xmJson = {
                "metadata": {
                    "version": "2.0"
                }
            };
            let xmForm = {
                    "elementType": "form",
                    "requestMethod": "GET",
                    "id": "sample_form",
                    "heading": {
                        "heading": "Character Information",
                        "headingLevel": 2,
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
                            "name": "s1_class",
                            "label": "Class","required": true
                        },
                        {
                            "elementType": "formInputText",
                            "name": "s1_race",
                            "label": "race",
                            "required": true
                        },
                        {
                            "elementType": "formInputSegmented",
                            "name": "s1_age",
                            "label": "Age",
                            "options": {
                            "under25": "under25",
                            "25-40": "25-40",
                            "41-60": "41-60",
                            "61+": "61orover"
                        },
                        "fullWidth": true
                    },
                    {
                        "elementType": "formInputAssistedSelect",
                        "name": "s1_animal",
                        "label": "Animalcompanion",
                        "options": {
                        "": "",
                        "ant": "Ant",
                        "bat": "Bat",
                        "bear": "Bear",
                        "bird": "Bird",
                        "cat": "Cat",
                        "dog": "Dog",
                    }
                },
                {
                    "elementType": "formInputRadio",
                    "label": "Prefferredcontact",
                    "preamble": "Whats the best way to reach you?",
                    "name" :
                    "s1_contact",
                    "options": {
                    "email": "Email",
                    "phone": "Phone",
                    "text": "Text",
                    "discord": "Discord",
                    "other": "Other"
                },
            "nested": true,
            "progressiveDisclosureItems": {
            "email": [{
            "elementType": "formInputEmail",
            "name": "s1_email",
            "label": "emailAddress",
            "required": true
        }],
    "phone": [{
"elementType": "formInputPhone",
"name": "s1_phone",
"label": "phoneNumber",
}],
"text": [{
"elementType": "formInputPhone",
"name": "s1_text",
"label": "Phone number"
}], "discord": [{
        "elementType": "formInputText",
        "name": "s1_discord",
        "label": "Discord username"
    }],
    "other": [{
        "elementType": "formInputTextarea",
        "name": "s1_contact_other",
        "label": "Describe the best way to contact you",
        "rows": 4
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
};
//if we have query string parameters we should set a cookie
if ('queryStringParameters' in event &&
    event.queryStringParameters != null
) {
    xmJson.metadata.cookies = [{
        "name": "banner_msg",
        "path": "/",
        "value": "You have successfully updated your character information"
    }];
    xmJson.metadata.redirectLink = {
        "relativePath": ""
    };
} else {
    xmJson.content = [xmForm];
}
let payload =
    null;
if ('headers' in event &&
    'authorization' in event.headers) {
    payload = jwt.verify(event.headers
        .authorization.split(" ")[
            1], jwkPem(key));
    console.log("Payload", payload);
}
if (payload != null && 'cookies' in payload && payload.cookies != null && 'banner_msg' in payload.cookies) {
    xmJson.metadata.banners = [{
        "message": payload.cookies.banner_msg,
        "type": "info"
    }];
    xmJson.metadata.cookies = [{
        "name": "banner_msg",
        "path": "/",
        "value": null
    }];
}
const response = {
    statusCode: 200,
    body: JSON.stringify(xmJson),
};
return response;
};