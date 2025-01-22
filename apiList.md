# DevTinder APIs

## authaRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## ConnectionRequestRouter

- POST /request/send/status/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:userId

## userRouter

- GET /user/connections
- GET /user/requests
- GET /feed - gets you profile of others users

- GET /feed?page=1&limit=10 =>first 10 users 1-10
- GET /feed?page=2&limit=20 =>first 10 users 11-20

  Status: ignore, interested, accepted, rejected

## AWS

- create aws acc
- add card
- create ec2 instance
- use t.micro free machine
- choose os (ubuntu)
- create secret key .pem file
- give permission chmod 400 filename.pem
- use shell cmd from terminal to access machine
- install node on machine
- clone project from git devTinder FE and BE-> git clone github repo

## DEPLOY FRONTEND

- install all packages -> npm install
- build the FE -> npm run build
- dist folder
- sudo apt update
- Install Nginx -> sudo apt install nginx
- enable nginx ->sudo systemctl enable enginx
- copy code from dist folder to var/www/html/
- sudo scp -r dist/\* /var/www/html
- enable port :80 on your intance (security groups->inbound rules)

## DEPLOY BACKEND

- log to machine
- cd to /devTinder-be
- npm i
- allow ec2 public ip in mobgodb atlas
- enable port 3000
- npm install pm2@latest -g
- pm2 start npm --start -> start pm2 process
- pm2 logs -> check logs
- pm2 flush npm -> clear logs of npm
- pm2 list -> list the process started by pm2
- pm2 stop npm or delete npm -> stops the pm2 process for npm
- pm2 start npm --name "devTinder-BE" -- start

- conifg nginx - /etc/nginx/sites-availbale/default

frontend = http://ip
backend = http://ip

domain name = devTinder.com => ip
fe = devTinder
be = devTinder.com:300 => devTinder.com/api

## map domain:3000 to domain/api in nginx

- sudo nano /etc/nginx/sites-available/default'
- server name ip
- add rule

location /api/ {
proxy_pass http://127.0.0.1:3000/;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;
}

- exit save nginx
- sudo systemctl restart nginx

## Add custom domain name

- purchase domain name from domain name provider
- use cloudflare for dns mapping
- change the name serve on godaddy point it to cloudflare
- DNS records
- Enable SSL for website
-

## Sending Emails via SES

- Create a IAM user
- Give access to AmazoneSESFillAccess
- Amazoen SES: Create an Indentity
- Verify your domain name
- Verify an Email address
- Install AWS SDK
- Code Example : https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_ses_code_examples.html
- setup sesClient
- Access credentials should be created in IAM under SecurityCredentials tab
- Ad the credentials to the env file
- write code for SESClient
- Write code for sending email address
- Make the email dynamic by passing more params to the run function

## Scheduling cron jobs in NodeJs

- Installing node-cron
- Learn about cron expressions syntax
- schedule a job
- install date-fns
- Find all the unique email ids
- send emails
- explore queue mechannism
- Amazone SES bulk emails
- Make sendEmails functions dynamic

## Razorpay Payment Gateway Integration

- Sign up on Razorpay & complete kyc
- Create a UI for premium page
- Creating an API for create order in BE
- Initialized Razorpay in utuils
- Creating order on Razorpay
- Create Schema and model
- Saved the API in payments collection
- make the API dynamic
- Setup Razorpay on your live API

## WebSockets & Socket.io live chat

- npm install socket.io
- initialized websocket server
- initalized chat
- createSocketConnection
- Listen to events

## Chat Schema & Modal

- create chat / message schema & modal
