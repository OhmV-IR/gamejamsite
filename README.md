### Game Jam site
If you want to use this website to power your game jam, here's the tutorial on how to set it up for your own use.
You'll likely need some coding experience to be able to change text and other elements of the site, but if you don't have any, AI will probably work too. Here's a slight description of what you can expect as for costs
- Domain(optional), usually about 20$ Canadian
- Site hosting on vercel, free
- Azure cosmos db, free
- Azure storage container account, if you get 50GB worth of submissions, then it'll be about 90 cents/mo. To help with this you can restrict the max upload size in the lib/submission.js file
## Setting up your environment
1. Download node 22 from https://nodejs.org/en/download
2. Open a terminal in the project directory and run ```npm i```
3. Create a file called .env in the project directory and fill it with the following variables:
Note that wherever http://localhost:3000 is used, you should replace it with https://yourdomain.com/ in your production(vercel) environment
- DOTENV_CONFIG_QUIET=true
Just prevents some log spam
- DISCORD_OAUTH_CLIENT_ID
- DISCORD_OAUTH_CLIENT_SECRET
Create a new application on https://discord.com/developers/applications, go to the OAuth2 section, and copy the client secret and client id into these env vars
- DISCORD_OAUTH_REDIRECT_URL
Either http://localhost:3000/api/oauth/cb/discord in your local environment or https://yourdomain.com/api/oauth/cb/discord in your production env, make sure to add these urls to the Redirects section.
- GITHUB_OAUTH_CLIENT_ID
- GITHUB_OAUTH_CLIENT_SECRET
Go to https://github.com, Click on your profile picture in the top-right, click settings, then click on developer settings at the bottom, then hit OAuth apps, and finally create a new OAuth app. Add the name, description .etc and the redirect url from the next variable.
- GITHUB_OAUTH_REDIRECT_URL
https://yourdomain.com/api/oauth/cb/github, github does not support multiple redirect urls or localhost redirect urls.
- GOOGLE_OAUTH_CLIENT_ID
- GOOGLE_OAUTH_CLIENT_SECRET
Create a new project on the google cloud console, then click menu in top right -> APIs and Services -> OAuth Consent Screen. Then fill out the Branding section(except for picture unless you want to go through google verification), add yourdomain.ca in the Authorized domains section. Then in the Data Access section, add the auth/userinfo/email, auth/userinfo/profile and openid scopes. Then go to clients, create client(web application), add http://localhost:3000/ and https://yourdomain.ca/ into Authorized JavaScript origins. Then add http://localhost:3000/api/oauth/cb/google and https://yourdomain.ca/api/oauth/cb/google in Authorized redirect URLs. Copy client id and client secret into these variables. Finally go back to Audience tab and hit go to production button.
- GOOGLE_OAUTH_REDIRECT_URL
http://localhost:3000/api/oauth/cb/google or https://yourdomain.com/api/oauth/cb/discord
- COOKIE_SECRET
A random string of characters to protect cookies, please do not use any words, open Git Bash and use the command ```openssl rand -base64 64```
# Setting up the database
1. Go to https://portal.azure.com and sign in with your microsoft account.
2. Click create a resource, and search for "Cosmos db" in the search bar, then create a Azure Cosmos DB. Choose NoSQL. Choose anything for Workload Type, doesn't matter. Choose an existing subscription or create a new one, same with resource group, and enter an account name(can be anything). For location, choose whichever is closest to the majority of your users. Choose provisioned throughput, and apply free tier discount, and check limit total account throughput. In the Global distribution tab, turn off geo-redundancy and multi-region writes. Leave all other settings at their defaults.
3. Hit Review+create and then create and wait for the process to finish. Then go to resource once the process has finished.
4. Expand the settings menu on the left side and go to the keys section and copy the URl and Primary Key into the following env vars:
- DB_ENDPOINT
Cosmos db account endpoint
- DB_KEY
Cosmos DB account access key
4. Go to the Data Explorer tab, and hit down arrow next to create container, and then choose create new database. choose a name, eg jambytes. Check share throughput across containers, click manual and enter 1000. Then hit OK and fill out the following in your .env file:
- DB_ID
Name of the database in the cosmos db account
5. Hit create container, use existing database and choose the database you just created. choose a name for your user data container, eg users, and set Partition key to /id, then enter the name for your user data container in the following environment variable:
- USERCONTAINER_ID
User data container name in cosmosdb
6. Follow the same process for the teams container:
- TEAMSCONTAINER_ID
Team data container name in cosmosdb
- DOMAIN
Either http://localhost:3000/ or https://yourdomain.ca/
# Setting up the submission storage container
1. Go to https://portal.azure.com/ and click Create a resource, then search for Storage account and choose the one with a green table icon from Microsoft. Choose a name, subscription, resource group and select the region closest to you. For preferred storage type, choose Azure Blob Storage, and choose Standard performance. Set redundancy to LRS. Hit review + create and then create.
2. Go to security + networking -> Access keys. Copy the connection string under key1 and paste it into the following environment variable:
- BLOB_CONNSTR
Azure blob storage connection string for submissions
3. Go to data storage -> containers. Click new container and create a container called evtcache or something similar.
4. Go to the events tab and add an event subscription. Leave everything as the default and give it a name(whatever you want). Under filter to event types leave only blob created checked. Under endpoint type choose Web Hook. Select the configure an endpoint button and enter the url https://yourdomain.ca/api/finishsubmission. Note that if you have not gone through the Vercel set up yet this will not work, so you may need to do that first and come back to this step later. Under additional features, enable dead-lettering and choose the evtcache container for the storage blob container. Finally under Delivery Properties, add the value of the following environment variable under the header name "hookkey" and check the Is secret box. 
- WEBHOOK_KEY
Another random string of characters to protect the /api/finishsubmission endpoint, use the ```openssl rand -base64 64``` in Git-Bash to generate one
# Setting up your site on vercel
1. Fork this repository and you can make it private or public, but note that making it public will allow everyone to view your code.
2. Go to https://vercel.com/ and choose Add new... -> Project. Under the Import git repository tab, add your github account and then choose import button next to the name of your fork. There should be an N icon next to it. Paste your .env file into the environment variables section and change all instances of http://localhost:3000 to https://yourdomain.ca/. Then hit deploy.
3. Underneath the Storage tab in the created project, hit the Create Database button and create a new Edge Config. Copy the ID into the following environment variable:
- EDGE_CONFIG_ID
The id of your site's vercel edge config
4. Go to the Tokens tab and click Generate token, name it whatever you like. Click the 3 dots next to the new token and click copy connection string and paste the value into the following environment variable:
- EDGE_CONFIG
Vercel edge config connection string
5. Go to the top-right and click on your profile picture -> Account settings -> Tokens. Create a new token with the scope of YOURUSERNAME's projects, name it whatever you want and give it an expiration of a year or no expiration if you want. Then hit create and copy that token into the following environment variable:
- EDGE_CONFIG_TOKEN
A vercel account token to write to vercel edge configs
6. If you have a domain, go to the Settings -> Domains in your vercel project and follow the instructions to connect your domain to your production environment
# Adding your environment variables to Github for CI
1. Go to the repository page of your fork on github
2. Go to settings tab -> Secrets and variables -> Actions
3. For each variable in your .env, add a new repository secret with the same name and value.
## How to run the website locally
1. Run ```npm i``` in the project directory
2. Run ```npm run dev``` in the project directory
3. Go to http://localhost:3000/ in your browser