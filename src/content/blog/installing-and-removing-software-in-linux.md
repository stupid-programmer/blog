---
title: 'Installing and removing software in Linux'
description: 'As per the title, a cheatsheet for installing and removing packages from Linux'
pubDate: 'Aug 23 2023'
heroImage: '/blog-placeholder-5.jpg'
---

Search for package to see if its available
```
apt-cache search keyword
```
It will return a list of available software matching that keyword

Install a package
```
apt-get install packagename
```

Remove a package, this does'nt remove config files
```
apt-get remove packagename
```

Remove a package and its config files
```
apt-get purge packagname
```

To remove any packages that were brought in by a previously installed package run
```
apt autoremove
```

**Updating**, this isn't the same as upgrading
```
apt-get update
```

**Upgrading**, This upgrades the software to the latest version
```
apt-get upgrade
```

### Adding Repositories to sources.list file

The sources.list file is where all the repositories that the system will search through when looking for a package

sources.list file is located at
```
/etc/apt/sources.list
```

To add repositories just edit this file and then when you run apt-get it should find them and install, just make sure they are compatible with the type of Linux your running

### Installing with git

You can get software for Linux from git, scripts etc presumably 

Standard stuff, this will grab the thing 
```
git clone github.com/urlforthingwant
```