---
title: 'Installing latest Hugo with PopOS and a .deb file'
description: 'Installing latest Hugo with PopOS and a .deb file'
pubDate: 'Nov 30 2023'
heroImage: '/blog-placeholder-4.jpg'
url: 'installing-latest-hugo-popos'
tags: ['msc']
---

I was looking into Hugo because it always comes up when looking at static site generators and when installing I followed the starter guide and pulled it in like so `sudo apt install hugo` which pulls from the official packages which is out of date so when you get to the step.

`hugo new content posts/my-first-post.md` resulted in the error `Error: failed to resolve "content" to a archetype template`

This is due to a version issue if id read the docs correctly and bothered to check the version of Hugo it pulled in then it'd not have been a problem but to install the latest Hugo without the snap package go to the [repo](https://github.com/gohugoio/hugo/releases) and grab the .deb file

Then from the downloads folder run the following
`sudo dpkg --install hugo_0.120.4_linux-amd64.deb`

Giving me the current version which at todays date is `v0.120.4` and no error when running the `hugo new content posts/my-first-post.md` command. 