// Get your Access Key and Access Secret at dashboard.sinch.com/settings/access-keys
import fetch from 'cross-fetch';
import express from 'express';
const app = express();
const port = 3000;
const host = "45.76.36.169";
app.use(express.json());

const ACCESS_KEY = 'c4f813de-89d9-4945-9106-f24275a84a35';
const ACCESS_SECRET = 'by5YU51-B__xDe~b6vMINCpGSy';

import OpenAI from "openai";

const openai = new OpenAI({
  organization: 'org-lcqlt3GI79pyECNO4jXNOuyJ',
  apiKey: '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'
});

const messagesToSend = {
  "items": {
    "choice_message": {
      "text_message": {
        "text": "How nice to have you here. Let me generete a knitted item for you. What would you like to have?"
      },
      "choices": [
        {
          "text_message": {
            "text": "A sweater"
          },
          "postback_data": "sweater"
        },
        
          {
            "text_message": {
                "text": "A west"
            },
            "postback_data": "west"
          },
        {
          "text_message": {
            "text": "A bolero"
          },
          "postback_data": "bolero"
        }
      ]
    }
  },
  "models": {
    "choice_message": {
      "text_message": {
        "text": "What kind of model are you interested in?"
      },
      "choices": [
        {
          "text_message": {
            "text": "Woman",
          },
          "postback_data": "woman"
        },
        
          {
            "text_message": {
                "text": "Man"
            },
	         "postback_data": "man"
          },
        
      ]
    }
  },
  "colors": {
    "choice_message": {
      "text_message": {
        "text": "Choose your color here"
      },
      "choices": [
        {
          "text_message": {
            "text": "Red"
          },
          "postback_data": "red"
        },
        
          {
            "text_message": {
                "text": "Yellow"
            },
            "postback_data": "yellow"
          },
        {
          "text_message": {
            "text": "Blue"
          },
          "postback_data": "blue"
        },
        {
          "text_message": {
            "text": "Green"
          },
          "postback_data": "green"
        }
      ]
    }
  },
 "ready": {
    "choice_message": {
      "text_message": {
        "text": "Ready to see the results?"
      },
      "choices": [
        {
          "text_message": {
            "text": "Yes",
          },
          "postback_data": "ready"
        },
        
          {
            "text_message": {
                "text": "No"
            },
	         "postback_data": "notReady"
          },
        
      ]
    }
  }, 
  "unsupported": {
    "text_message": {
      "text": "No"
    },
  }    

}

let metadata = 'sweater'; 
let MOmessage = '';
let MTmessage = {"message": messagesToSend.items}
let conversation_metadata = {}; 

app.post("/", async (req, res) => {
    var requestBody = req.body;
    //no importance in DR
    if (requestBody.message_delivery_report !== undefined) {
	    console.log("this is message delivery report")
	    return 0;
    }
    //let's add the postback to conversation metadata
    if (requestBody.message !== undefined && requestBody.message.contact_message !== undefined 
	    && requestBody.message.contact_message.choice_response_message !== undefined 
            && requestBody.message.contact_message.choice_response_message.postback_data !== undefined) 
    {
		  MOmessage = requestBody.message.contact_message.choice_response_message.postback_data;
      metadata = MOmessage; 
    }
    if (requestBody.message !== undefined && requestBody.message.contact_message !== undefined 
	    && requestBody.message.contact_message.text_message !== undefined 
      && requestBody.message.contact_message.text_message.text !== undefined )
    {
        MOmessage = requestBody.message.contact_message.text_message.text;
    }
    console.log("metadata:" , JSON.parse(requestBody.message_metadata)); 
    conversation_metadata = requestBody.message_metadata ? JSON.parse(requestBody.message_metadata) : {};
   

    console.log("requestBody: ", requestBody, "message1: ", requestBody.message);	
    console.log("MOmessage: ", MOmessage);
    console.log("MTmessage: ", MTmessage);	

    //generating image if ready but sending questions until that
    if (!["ready"].includes(MOmessage)) {
 	    console.log("it is a message"); 
    	if (["sweater", "west", "bolero"].includes(MOmessage)) {
	           console.log("the text is keyword", messagesToSend.model);  
       		   MTmessage = {"message": messagesToSend.models};
		         conversation_metadata["item"] = metadata;
      }
      if (["woman", "man"].includes(MOmessage)) {
             console.log("the text is keyword", messagesToSend.colors);  
             MTmessage = {"message": messagesToSend.colors};
             conversation_metadata["model"] = metadata;
      }
      if (["blue", "red", "yellow", "green"].includes(MOmessage)) {
        console.log("the text is keyword", messagesToSend.ready);  
        MTmessage = {"message": messagesToSend.ready};
        conversation_metadata["color"] = metadata ;
      }

		  const sendMessage = {
            		app_id: requestBody.app_id,
            		recipient: {
          			contact_id: requestBody.message.contact_id
            		},
           	  	
                message: MTmessage.message,
            		channel_priority_order: [requestBody.message.channel_identity.channel],
			          conversation_metadata
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
    		console.log("message sent");
   		  console.log(await result.json());
    		res.send("Ok");
    } //ready message gotten
    else  {
        const sendMessage = {
            app_id: requestBody.app_id,
            recipient: {
                contact_id: requestBody.message.contact_id
            },
            message: {
                text_message: {
                    text: "Generating an image for you. Please wait ..."
                }
            },
            channel_priority_order: [requestBody.message.channel_identity.channel],
            conversation_metadata: {}
        };
        console.log("Message in else, generating...", sendMessage);
    
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
     	console.log("message sent, about generating"); 
	    console.log(await result.json());
    	res.send("Ok");
 	
      let model =  conversation_metadata.model ?  conversation_metadata.model : "woman";
      let item =  conversation_metadata.item ?  conversation_metadata.item : "west";
      let color =  conversation_metadata.color ?  conversation_metadata.color : "red";
      let wear =  conversation_metadata.item == "bolero" ?  "cloth" : "jeans";
      
      let prompt = "Create an image of a european adult 80kg " + model + " in a knitted " + item + ".";
      prompt += " The sweater is in modern style with cozy, " + color + " yarn suitable for eastern, probably with an easter motiv.";
      prompt += " The model's body should be fully visible wearing " + wear + ".  I want to have the models foot as part of the image too.";
      prompt += " The background of the image should be kept simple.";
      prompt += " The models should not be too lightweighted. Ever. Best if they are normal weigthed.";
                  
      //generating image
	    console.log("generating image of ", conversation_metadata); 
	    let image = await openai.images.generate({

                    prompt: prompt, 
                    model: "dall-e-3"


                  });
	    console.log("Images:")
  	  console.log(image);
  	  console.log("--------------------") 
      console.log("generated image: ", image.data[0].url); 
    

	    let result1 = await fetch(
            "https://eu.conversation.api.sinch.com/v1/projects/" + requestBody.project_id + "/messages:send",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Basic ' + Buffer.from(ACCESS_KEY + ":" + ACCESS_SECRET).toString('base64')
                },
                body: JSON.stringify({
                app_id: requestBody.app_id,
                recipient: {
                	contact_id: requestBody.message.contact_id
            	  },
                message: {
                    "media_message": {
                        "url": image.data[0].url
                    }
                }
              })
        })

	      console.log("result: ");
        console.log("--------------------")
        console.log("result", result1);
    
   }
    
  
});

app.listen(port, host, () => {
    console.log("Listening at http://", host, ":" , port);
});   
