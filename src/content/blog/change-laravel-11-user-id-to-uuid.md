---
title: "Change Laravel 11 User ID to UUID"
description: "How to change the Laravel 11 user table id to a UUID"
pubDate: "Mar 14 2024"
heroImage: "/blog-placeholder-2.jpg"
url: "change-laravel-11-user-id-to-uuid"
tags: ["laravel"]
---

I'm not sure if this was a thing in the previous version (I don't think so) but for future reference when changing the user id on the user table to a UUID there's and extra step now.

The error I encountered.

```
Invalid text representation: 7 ERROR:  invalid input syntax for type bigint: '...' Connection: pgsql, SQL: update "sessions" set "payload"
```

In the file `0001_01_01_000000_create_users_table.php` the user id column and the session foreignid column need to be updated to work with uuid's, otherwise it will error when trying to register due to it not being a bigint anymore.

So change the user id to `$table->uuid('id)`

```php
Schema::create('users', function (Blueprint $table) {
    $table->uuid('id');
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->rememberToken();
    $table->timestamps();
});
```

and then in the same file change the sessions table foreignId to the following `$table->foreignUuid('user_id')->nullable()->index()`

```php
Schema::create('sessions', function (Blueprint $table) {
    $table->string('id')->primary();
    $table->foreignUuid('user_id')->nullable()->index();
    $table->string('ip_address', 45)->nullable();
    $table->text('user_agent')->nullable();
    $table->longText('payload');
    $table->integer('last_activity')->index();
});
```
