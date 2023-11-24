---
title: 'Could not verify the hashed values configuration'
description: 'Laravel error message, Could not verify the hashed values configuration'
pubDate: 'Nov 24 2023'
heroImage: '/blog-placeholder-4.jpg'
url: 'could-not-verify-the-hashed-values-configuration'
tags: ['laravel']
---
 

This error happened after a composer update and the codebase itself was fine but the tests were not, when creating a user in a factory the word password as a hash was being passed as a password rather than running the string through the bycrypt method but in [this post](https://github.com/laravel/framework/discussions/48910)
 I found an answer.

There are two files that set the rounds for the bycrypt method and they were different.
`config/hashing.php` 
```
'bcrypt' => [
'rounds' => env('BCRYPT_ROUNDS', 10),
],
```

and 
`phpunit.xml`
```
<php>
<env name="APP_ENV" value="testing"/>
<env name="BCRYPT_ROUNDS" value="4"/>
<env name="CACHE_DRIVER" value="array"/>
<env name="DB_DATABASE" value="testing"/>
<env name="MAIL_MAILER" value="array"/>
<env name="QUEUE_CONNECTION" value="sync"/>
<env name="SESSION_DRIVER" value="array"/>
<env name="TELESCOPE_ENABLED" value="false"/>
</php>
```

So by changing the `phpunit.xml` files `BYCRYPT_ROUNDS` value to the same as in the `config/hashing.php` file the tests then passed, until I change something else anyway.
```
<env name="BCRYPT_ROUNDS" value="10"/>
```