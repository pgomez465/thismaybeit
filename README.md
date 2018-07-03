## VChat

A live-stream video chat app that leverages the RTC protocol, built with React, Redux, Webrtc, NodeJS, and Express.

[Demo] -> https://vchat-demo-1118.herokuapp.com/

## Project Status

This project is currently in development. Users can create or join a chat room with username and roomId. In the chat room, uses can have voice, video and text message conversation with others.

## Project Screen Shots
Set up chat room           |  Chat room
:-------------------------:|:-------------------------:
![](https://preview.ibb.co/b1xPcJ/Vchat_fifth_Capture.png)  |  ![](https://preview.ibb.co/n65o4y/VCHAT_fourth_Capture.png)

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

`$ npm install`  

To Fire Up Webpack in Watch Mode:

`$ npm run react-dev`  

To Start Server:

`$ npm run server-dev`  

To Visit App:

`http://localhost:8080/`  

## Deploying to Heroku
This app is set up for deployment to Heroku!

_This assumes you have already have a Heroku account and have the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed_
```
$ heroku login
$ heroku create -a name-of-your-app
$ git push heroku master
$ heroku open
```
