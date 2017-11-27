# widget-4orum
A React and JQuery script that embeds an div of the [comments-4orum](https://github.com/gigibyte927/comments-4orum) Django app into a given page.

# Usage: How to Embed a 4orum Comment on your Website
In the html for a given page for production purposes, put the following two lines where you want your comment section to exist.
First, add a *div* with id root.
```
<div id="root"></div>
```

Then add this script to the bottom of your html file:

```
<script src="https://cdn.rawgit.com/mark-craig/f06b4fbd5246888bf0b493ae38378f02/raw/572714ef1281d1b0bed2b1b5b2188ff25e807f8a/main.190b807f.js"></script>
```

Finally, include this stylesheet:

```
<link href="https://cdn.rawgit.com/mark-craig/ac87f8f778caf2bc4257e445714ff266/raw/636482f0ed0e5e2286db6b8081159f7c5c4a0296/main.f8f7393c.css" rel="stylesheet">
```
Replace "https://cdn.rawgit.com/mark-craig/frame-4orum/ea5d1df9/bundle.js" with "https://rawgit.com/mark-craig/frame-4orum/master/bundle.js" for development purposes.

# About
*plugin.js* is the editable code. Build *bundle.js* via browserify with the command:
``
browserify plugin.js -o bundle.js
``

RawGit is tracking the bundle.js file in this repo. From the RawGit website:

Use this URL for development
https://rawgit.com/mark-craig/frame-4orum/master/bundle.js
* New changes you push to GitHub will be reflected within minutes.
* Excessive traffic will be throttled and blacklisted.
* If excessive traffic continues, RawGit will display a prominent error message on your website to try to get your attention.

Use this URL in production
https://cdn.rawgit.com/mark-craig/frame-4orum/ea5d1df9/bundle.js
* No traffic limits or throttling. Files are served via StackPath's super fast global CDN.
* Use a specific tag or commit hash in the URL (not a branch). Files are cached permanently based on the URL. Query strings are ignored.
* The catch: this is a free service, so there are no uptime or support guarantees.

# Demo
https://jsfiddle.net/Lwk3adcr/1/show/
