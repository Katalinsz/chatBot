// Get your Access Key and Access Secret at dashboard.sinch.com/settings/access-keys
const fetch = require('cross-fetch');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

const ACCESS_KEY = 'c4f813de-89d9-4945-9106-f24275a84a35';
const ACCESS_SECRET = 'by5YU51-B__xDe~b6vMINCpGSy';


app.post("/", async (req, res) => {
    var requestBody = req.body;
    console.log(requestBody);
    if (requestBody.message != undefined) {
        const sendMessage = {
            app_id: requestBody.app_id,
            recipient: {
                contact_id: requestBody.message.contact_id
            },
            message: {
                text_message: {
                    text: "You sent: " + requestBody.message.contact_message.text_message.text
                }
            },
            channel_priority_order: [requestBody.message.channel_identity.channel]
        };
        console.log(sendMessage);
    
        let result = await fetch(
            "https://eu.conversation.api.sinch.com/v1/projects/" + requestBody.project_id + "/messages:send",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Basic ' + Buffer.from(ACCESS_KEY + ":" + ACCESS_SECRET).toString('base64')
                },
                body: JSON.stringify(sendMessage)
            }
        );
        console.log(await result.json());
        res.send("Ok");
    }
    else {
        res.send("Ok");
    }
});

app.listen(port, () => {
    console.log("Listening at http://localhost:" + port);
});