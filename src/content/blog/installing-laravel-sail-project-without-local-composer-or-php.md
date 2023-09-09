---
title: 'Installing a Laravel Sail project without local Composer or PHP' 
description: 'Setting up Laravel sail with postgres and pgvector'
pubDate: 'Sep 09 2023'
heroImage: '/blog-placeholder-4.jpg'
url: 'installing-laravel-sail-project-without-local-composer-or-php'
tags: ['docker', 'laravel']
---

Being stupid, I deleted the vendor folder in my Laravel install using sail without a local install of composer or php, meaning the sail install command was gone, vanished did not exist. This problem would still exist if cloned to a machine without the composer as well.

A short while later and I found [in the Laravel docs](https://laravel.com/docs/8.x/sail#installing-composer-dependencies-for-existing-projects) a way to install a local copy of these tools to then build the project.

`php81`
```
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/var/www/html \
    -w /var/www/html \
    laravelsail/php81-composer:latest \
    composer install --ignore-platform-reqs
```

This is php81 though and no mention of php82 in the docs, at the moment anyway, i'm sure in the future these will get updated but looking under the [same user on docker](https://hub.docker.com/r/laravelsail/php82-composer) theres a php82 version so I grabbed that installed like so


`php82`
```
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/var/www/html \
    -w /var/www/html \
    laravelsail/php82-composer:latest \
    composer install --ignore-platform-reqs
```

Finally we can run the commands to get sail running again

```
sail build --no-cache
```

```
./vendor/bin/sail composer install
```

```
./vendor/bin/sail up -d 
```

And you should be good to go. 
