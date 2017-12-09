# widget-4orum
An embeddable React single-page application that puts a [comments-4orum](https://github.com/gigibyte927/comments-4orum) thread on any website.

# How to embed a 4orum comment thread on your website
## Step 1
include this stylesheet in the <head> of your webpage (it should not interfere with your other styles):
```
<link rel="stylesheet" href="https://4orum.netlify.com/static/css/main.css">
```
## Step 2
In the html for a given page for production purposes, put the following <div> where you want your comment section to exist.
```
<div id="4orum"></div>
```
## Step 3
Add this script near the bottom of your html file:
```
<script src="https://4orum.netlify.com/static/js/main.js"></script>
```
## Step 4
There is no step 4. You're done!
  
# Development
This project was created using the [create-react-app](https://github.com/facebookincubator/create-react-app) framework. The README for that repo contains all the necessary information for working with this project.

## Quick Start
After cloning this repo, use the following commands to run the app locally.

Install dependencies from package.json:
```
npm install
```
Run in development mode on localhost:
```
npm start
```
