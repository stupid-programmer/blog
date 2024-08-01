---
title: "How to connect Laravel and Supabase"
description: "Connecting Laravel and Supabase using the .env file"
pubDate: "Aug 01 2024"
heroImage: "/blog-placeholder-5.jpg"
url: "connecting-supabase-with-laravel"
tags: ["laravel"]
---

To prevent the need for me to work this out again here's how to connect a Supabase postgres database and a Laravel app. The recommendation is to use a different schema, this can be created from your

There is an [official article](https://supabase.com/docs/guides/getting-started/quickstarts/laravel) but for whatever reason could not get the url string working and prefer listing out each .env file value over a connection string. In the article it recommends to change the schema because of functionality Supabase provides.

So first of all edit the `search_path` value within the `pgsql` config from the `config/database.php` file so that it looks like the following.

```
    'search_path' => env('DB_SCHEMA', 'public'),
```

If there is no `DB_SCHEMA` value in the .env file default to public for our local setup with docker etc.

Then the final thing to do is setup the `DB_SCHEMA` value within the `.env` file.

```
DB_CONNECTION=pgsql
DB_HOST=aws-0-eu-west-2.pooler.supabase.com
DB_PORT=5432
DB_SCHEMA=your_schema_name
DB_DATABASE=postgres
DB_USERNAME=postgres.the_username_assigned_when_you_created_the_database
DB_PASSWORD=the_password_you_created_when_you_created_the_database

```

and you should be good to go, run a migration or load the app to check the connection is okay.
