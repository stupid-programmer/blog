---
title: 'Laravel sail with postgres and postgis extension'
description: 'Setting up Laravel sail with postgres and postgis'
pubDate: 'Aug 29 2023'
heroImage: '/blog-placeholder-2.jpg'
url: 'laravel-sail-with-postgres-and-postgis'
tags: ['docker', 'postgres', 'laravel']
---

Recommended reading for this post is the one where we setup [Laravel with the pgvector extension](/blog/laravel-sail-with-postgres-and-pgvector) as it builds upon that, the repo to see this is [repo here](https://github.com/stupid-programmer/laravel_sail_pgvector_example).

First up presuming we have set up similar to before is to edit the `/docker/pgsql/postgres.Dockerfile` file and add the install command to get postgis for the current postgres version

The line to add is
```
RUN apt-get update && apt-get  install -y postgresql-15-postgis-3
```

So the whole file looks like this
```
FROM postgres:latest

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    postgresql-server-dev-all \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get  install -y postgresql-15-postgis-3

WORKDIR /tmp
RUN git clone https://github.com/pgvector/pgvector.git

WORKDIR /tmp/pgvector
RUN make
RUN make install
```

Then run the `sail build --no-cache` command to rebuild


### Add install script

We need to add the install script so we don't have to run the `CREATE EXTENSION postgis;` after connecting to the database

First create a file at the path `docker/pgsql/postgis-extension.sql`
In said file put this.
```
CREATE EXTENSION IF NOT EXISTS postgis;
```

While we're at it may as well add this to the testing database while we remember, the path is the same just with a different name `docker/pgsql/testing-database-postgis-extension.sh`

but the script is different.
```
#!/bin/bash
set -e

echo "Creating vector extension on testing database"

export PGPASSWORD=password

psql -v ON_ERROR_STOP=1 --username "sail" --dbname="testing" <<EOFSQL
CREATE EXTENSION IF NOT EXISTS postgis;
EOFSQL

```
This is just adding the extension to the default testing one Laravel sail provides.

The next step is to get the sql and script to run when the box first starts up to do this we need to add them to the `docker-entrypoint-initdb.d` directory I think thats how that works anyway, using the `docker-compose.yml` under volumes add the two scripts to the end, note the numbers this is important for order e.g 14-xxx-xxx-xxx runs last, again see the github repo link above to look at the whole thing it makes the article difficult to read pasting to much in.
```
    volumes:
        - 'sail-pgsql:/var/lib/postgresql/data'
        - './docker/pgsql/create-testing-database.sql:/docker-entrypoint-initdb.d/10-create-testing-database.sql'
        - './docker/pgsql/vector-extension.sql:/docker-entrypoint-initdb.d/11-vector-extension.sql'
        - './docker/pgsql/testing-database-vector-extension.sh:/docker-entrypoint-initdb.d/12-testing-database-vector-extension.sh'
        - './docker/pgsql/postgis-extension.sql:/docker-entrypoint-initdb.d/13-postgis-extension.sql'
        - './docker/pgsql/testing-database-postgis-extension.sh:/docker-entrypoint-initdb.d/14-testing-database-postgis-extension.sh'
```

And now run the `` command to rebuild

and then `./vendor/bin/sail up -d` to start up the database

next to test if it's been installed successfuly log into the database and run
`SELECT postgis_full_version();`

The output should be something like


```
| postgis_full_version                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POSTGIS="3.4.0 0874ea3" [EXTENSION] PGSQL="150" GEOS="3.11.1-CAPI-1.17.1" PROJ="9.1.1 NETWORK_ENABLED=OFF URL_ENDPOINT=https://cdn.proj.org USER_WRITABLE_DIRECTORY=/var/lib/postgresql/.local/share/proj DATABASE_PATH=/usr/share/proj/proj.db" LIBXML="2.9.14" LIBJSON="0.16" LIBPROTOBUF="1.4.1" WAGYU="0.5.0 (Internal)" |
```