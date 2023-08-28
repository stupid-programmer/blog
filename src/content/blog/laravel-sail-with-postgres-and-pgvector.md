---
title: 'Laravel sail with postgres and pgvector extension'
description: 'Setting up Laravel sail with postgres and pgvector'
pubDate: 'Aug 26 2023'
heroImage: '/blog-placeholder-4.jpg'
url: 'laravel-sail-with-postgres-and-pgvector'
tags: ['docker', 'postgres', 'laravel']
---


The exact command needed to add postgres to the Laravel sail docker image isn't in the docs and it always takes me ten to find it so here we go for future use.

This will install postgres (for database), mailpit (for catching emails) and selenium (for dusk I think).
```curl -s "https://laravel.build/example-app?with=pgsql,mailpit,selenium" | bash```

See this having somewhere to put things like this is paying off already.

### Setting up pgvector # Easy Method

First we need to publish the docker files as per the documentation run the following, after you have run the `./vendor/bin/sail up` command to set the project up.

`sail artisan sail:publish`

You should now have a `docker` directory in your root

The docs recommend renaming the application container after doing this. So first up lets do that, in the newly created docker folder there is a `docker-compose.yml` there should be an image config setting so change that to whatever you want, for example. 
```
image: sail-8.2/laravelvectorexampleservices:
```

Next up within the `docker-compose.yml` under services around line 30 theres the following.

This imports the default postgres:15 image
```
    pgsql:
        image: 'postgres:15'
```

There is a docker image that already contains the [pgvector extension](https://hub.docker.com/r/ankane/pgvector) so we could just use this.

Change to the following.
```
    pgsql:
        image: 'ankane/pgvector'
```

remember to delete the volume and container with this command, otherwise it skips the database step on rerun.

`docker container rm example-app-pgsql-1 && docker volume rm example-app_sail-pgsql`

and the rebuild command as per the docs
`sail build --no-cache`

then up the container again with
`./vendor/bin/sail up`

and when you go to your database you can follow the install [instructions](https://github.com/pgvector/pgvector) but a quick way to validate it works is being able to run the `CREATE EXTENSION vector;` without errors.


#### No manual database sql queries to get set up

To skip having to manually run the `CREATE EXTENSION vector;` command each time then add the following file to the `docker/pgsql` folder

`vector-extension.sql`
```
CREATE EXTENSION IF NOT EXISTS vector;
```

there is also a change required to the `docker-compose.yml`, volumes will look like this
```
    volumes:
        - 'sail-pgsql:/var/lib/postgresql/data'
        - './docker/pgsql/create-testing-database.sql:/docker-entrypoint-initdb.d/10-create-testing-database.sql'

```

we need to edit it to run our `vector-extension.sql` script like so
```
    volumes:
        - 'sail-pgsql:/var/lib/postgresql/data'
        - './docker/pgsql/create-testing-database.sql:/docker-entrypoint-initdb.d/10-create-testing-database.sql'
        - './docker/pgsql/vector-extension.sql:/docker-entrypoint-initdb.d/11-vector-extension.sql'

```

so the final pgsql service should look like the following

```
    pgsql:
        image: 'ankane/pgvector'
        ports:
            - '${FORWARD_DB_PORT:-5432}:5432'
        environment:
            PGPASSWORD: '${DB_PASSWORD:-secret}'
            POSTGRES_DB: '${DB_DATABASE}'
            POSTGRES_USER: '${DB_USERNAME}'
            POSTGRES_PASSWORD: '${DB_PASSWORD:-secret}'
        volumes:
            - 'sail-pgsql:/var/lib/postgresql/data'
            - './docker/pgsql/create-testing-database.sql:/docker-entrypoint-initdb.d/10-create-testing-database.sql'
            - './docker/pgsql/vector-extension.sql:/docker-entrypoint-initdb.d/11-vector-extension.sql'
        networks:
            - sail
        healthcheck:
            test:
                - CMD
                - pg_isready
                - '-q'
                - '-d'
                - '${DB_DATABASE}'
                - '-U'
                - '${DB_USERNAME}'
            retries: 3
            timeout: 5s

```

and again run the following to reset the docker container

remove container and volume
`docker container rm example-app-pgsql-1 && docker volume rm example-app_sail-pgsql`

and the rebuild command as per the docs
`sail build --no-cache`

then up the container again with
`./vendor/bin/sail up`

This should now be setup and as per the docs the following should add a table with a vector type.
```
CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3));
INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
```

If that runs its setup okay.

### Final working copy of installing Laravel Sail with a postgres extension (pgvector) 

This is using the base image with a script to install the extension, as opposed to just using someone elses image, either is fine it's just to see how it this all clicks together a bit better, or if we needed more than one extension. 

Create a file in the `docker/pgsql` folder called `postgres.Dockerfile`

```
FROM postgres:latest

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    postgresql-server-dev-all \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /tmp
RUN git clone https://github.com/pgvector/pgvector.git

WORKDIR /tmp/pgvector
RUN make
RUN make install
```

Next in our `docker-compose.yml` file we need to add a build config to point to our newly created `postgres.Dockerfile`

The bit we need to add is this
```
    pgsql:
        build:
            context: ./docker/pgsql
            dockerfile: postgres.Dockerfile
        ports:
```

Which should give us a final `pgsql` service that looks like this
```
    pgsql:
        build:
            context: ./docker/pgsql
            dockerfile: postgres.Dockerfile
        ports:
            - '${FORWARD_DB_PORT:-5432}:5432'
        environment:
            PGPASSWORD: '${DB_PASSWORD:-secret}'
            POSTGRES_DB: '${DB_DATABASE}'
            POSTGRES_USER: '${DB_USERNAME}'
            POSTGRES_PASSWORD: '${DB_PASSWORD:-secret}'
        volumes:
            - 'sail-pgsql:/var/lib/postgresql/data'
            - './docker/pgsql/create-testing-database.sql:/docker-entrypoint-initdb.d/10-create-testing-database.sql'
            - './docker/pgsql/vector-extension.sql:/docker-entrypoint-initdb.d/11-vector-extension.sql'
        networks:
            - sail
        healthcheck:
            test:
                - CMD
                - pg_isready
                - '-q'
                - '-d'
                - '${DB_DATABASE}'
                - '-U'
                - '${DB_USERNAME}'
            retries: 3
            timeout: 5s
```

Finally if you have just skipped to here (would'nt blame you) don't forget your `/docker/pgsql/vector-extension.sql` file that should look like this to active the extension.

```
CREATE EXTENSION IF NOT EXISTS vector;
```

I noticed the testing database wasn't getting the extension installed, which would make sense because my understanding is the scripts are running on the 'active' database from the `docker-entrypoint-initdb.d` on first start up, by active I mean the one set in the `docker-compose.yml` file. To fix this I added a bash script to `/docker/pgsql/testing-database-vector-extension.sh` that looks like this.

```
#!/bin/bash
set -e

echo "Creating vector extension on testing database"

export PGPASSWORD=password

psql -v ON_ERROR_STOP=1 --username "sail" --dbname="testing" <<EOFSQL
CREATE EXTENSION IF NOT EXISTS vector;
EOFSQL

```
Sail builds us a database with these credentials in the `create-testing-database.sql` in the same directory.

We then as before need to add a one line change to the `docker-compose.yml` the order here is important, when moved a larger number has to be appended to the file name so it runs after the create testing database script
```
'./docker/pgsql/testing-database-vector-extension.sh:/docker-entrypoint-initdb.d/12-testing-database-vector-extension.sh'
```

Remove the volumes as before, rebuild with the sail command and it should be good to go

`docker container rm example-app-pgsql-1 && docker volume rm example-app_sail-pgsql`

and the rebuild command as per the docs
`sail build --no-cache`

then up the container again with
`./vendor/bin/sail up`