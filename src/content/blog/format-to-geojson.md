---
title: 'Simple format to Geojson with GDAL.'
description: 'This is how I went about formatting some geojson to enable use in a map.'
pubDate: 'Sep 30 2023'
heroImage: '/blog-placeholder-5.jpg'
url: 'simle-format-geojson-with-gdal'
tags: ['laravel']
---

### What is this. 

Well its some rambling just incase I need to do this again in the future.

I found open source map data on the office for national statistics uk site that drew boundaries for different things on a map and though it was interesting. 
There are various formats available for download [heres the link.](https://ons.maps.arcgis.com/apps/webappviewer/index.html?id=5cec9cc7208d418fbc1e7f538cb8745f)

So as it turns out the actual location data that make up the polygons (the things it draws on the map) is in something called a projection system, in this case a projection system used by the british national grid called  Transverse Mercator projection, this is where I left it to the enjoyers of geography and am out of my dept, the point being I want latitude and longitude and this is not that.

So my next question is how would I convert this to latitude and longitude, enter [GDAL](https://gdal.org/), it's at the point I'm glad of this sites name because again this tool makes me feel stupid but theres a utility it contains called ogr2ogr.

and ogr2ogr contains the following command
```
ogr2ogr -f "GeoJSON" -t_srs EPSG:4326 -s_srs EPSG:27700 output.geojson input.geojson
```

Here is an explanation courtesy of chat-gpt of the above command.

* ogr2ogr: This is the name of the command-line utility used for converting simple features data between file formats.

* -f "GeoJSON": The -f flag specifies the format of the output file. In this case, "GeoJSON" tells ogr2ogr that you want the output file to be in GeoJSON format.

* -t_srs EPSG:4326: The -t_srs flag is used to set the target spatial reference system (SRS). EPSG:4326 is the code for the WGS 84 coordinate system, which uses latitude and longitude degrees. This flag tells ogr2ogr to transform the coordinates in your input file into this coordinate system.

* -s_srs EPSG:27700: The -s_srs flag is used to set the source spatial reference system. EPSG:27700 is the code for the British National Grid coordinate system. This flag informs ogr2ogr of the coordinate system used in your input file. Knowing the source SRS, ogr2ogr can accurately transform the coordinates to the target SRS.

* output.geojson: This is the name of the file that ogr2ogr will create to store the transformed data. You can replace output.geojson with whatever filename you wish to give to the output file.

* input.geojson: This is the name of the input file containing the geographic data you want to transform. ogr2ogr will read this file, transform the coordinates from the source SRS to the target SRS, and write the result to output.geojson.

You can then add that output to your google map with something like the following, in this case a react library is being used.
```
map.data.addGeoJson(data);
```

