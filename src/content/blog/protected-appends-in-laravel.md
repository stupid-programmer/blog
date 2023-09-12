---
title: 'Protected Appends In Laravel'
description: 'Protected appends in a Laravel model.'
pubDate: 'Sep 12 2023'
heroImage: '/blog-placeholder-3.jpg'
url: 'protected-appends-in-laravel'
tags: ['laravel']
---

### What is protected Appends 

I've never come across this one in Laravel before, the protected fillable is one thats difficult not to notice with a mass exception validation error at some point but this got me curious.

So as it turns out the 
```
protected $appends = ['latitude', 'longitude'];
```

Allows us to access an accessor on a model through the json response, when in blade anything like `$model->customAttribute` will work but this is not the case for api requests.

So for example

```
    public function getLatitudeAttribute()
    {
        // Retrieve longitude using the ST_Y function on the 'positions' geometry column.
        return DB::table('locations')
            ->where('id', $this->id)
            ->selectRaw('ST_Y(area::geometry) as latitude')
            ->first()
            ->latitude;
    }
```

would mean we can now access $model->latitude in our json responses as well as our view responses. Which is helpful in the example above when the field is a geometry value in postgres as it saves a db column for access to the latitude or digging through the positions data in a view.
