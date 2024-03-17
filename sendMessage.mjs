// Find your App ID at dashboard.sinch.com/convapi/apps
// Find your Project ID at dashboard.sinch.com/settings/project-management
// Get your Access Key and Access Secret at dashboard.sinch.com/settings/access-keys
const PROJECT_ID = '496270ff-312a-4c66-9531-7bfa9902b088';
const APP_ID = '01HRQDZSP671S2Q62DMSC4DM30';
const ACCESS_KEY = 'c4f813de-89d9-4945-9106-f24275a84a35';
const ACCESS_SECRET = 'by5YU51-B__xDe~b6vMINCpGSy';
const CHANNEL = 'MESSENGER';
const IDENTITY = '';

import fetch from 'node-fetch';

async function run() {
  const resp = await fetch(
    'https://eu.conversation.api.sinch.com/v1/projects/' + PROJECT_ID + '/messages:send',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(ACCESS_KEY + ':' + ACCESS_SECRET).toString('base64')
      },
      body: JSON.stringify({
        app_id: APP_ID,
        recipient: {
          identified_by: {
            channel_identities: [
              {
                "channel": "MESSENGER",
                "identity": "7676841675660548",
                "app_id": "01HRQDZSP671S2Q62DMSC4DM30"
              }
            ]
          }
        },
        message: {
            "choice_message": {
                "text_message": {
                  "text": "How nice to have you here. Let me generete a knitted item for you. What would you like to have?"
                },
                "choices": [
                  {
                    "text_message": {
                      "text": "A sweater"
                    }
                  },
                  
                    {
                      "text_message": {
                          "text": "A west"
                        
                      }
                    },
                  {
                    "text_message": {
                      "text": "A bolero"
                    }
                  }
                ]
              }
          
        }
      })
    }
  );

  const data = await resp.json();
  console.log(data);

  const image = ''; 
  const resp2 = await fetch ("http://localhost:3001/api/images/");
  const res2 = await resp2.json();

  console.log(res2); 

  /*  const resp1 = await fetch(
            'https://eu.conversation.api.sinch.com/v1/projects/' + PROJECT_ID + '/messages:send',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Buffer.from(ACCESS_KEY + ':' + ACCESS_SECRET).toString('base64')
              },
              body: JSON.stringify({
                app_id: APP_ID,
                recipient: {
                  identified_by: {
                    channel_identities: [
                      {
                        "channel": "MESSENGER",
                        "identity": "7676841675660548",
                        "app_id": "01HRQDZSP671S2Q62DMSC4DM30"
                      }
                    ]
                  }
                },
                message: {
                    "media_message": {
                        "url": res2.images
                    }
                }
              })
            }
          );
   
    
   console.log("aiRes:", await image); 
  

  
  //fetch("http://localhost:3001/run"); 
  
  const data1 = await resp1.json();
  console.log(data1);*/

}

run();