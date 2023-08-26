---
title: 'Compressing files in Linux'
description: 'Tar, Gzip, Gunzip'
pubDate: 'Aug 23 2023'
heroImage: '/blog-placeholder-2.jpg'
url: 'compressing-files-in-linux'
tags: ['linux']
---

### Compressing files

First step is to tar the files together, c option is create, v is verbose, f means write the following file
```
tar -cvf TarName.tar filename.txt filename2.txt filename3.txt 
```

tar a directory of files
```
tar -cvf my_files.tar /path/to/my/directory
```

View whats in a tar file
```
tar -tvf TarName.tar
```

gzip files, the wildcars if for all extensions matching that name
```
gzip TarName.*
```

It will create a smaller file with the extension
```
TarName.tar.gz
```

To decompress a file
```
gunzip TarName.*
```

To move out from the tar extension 
```
tar -xvf my_files.tar
```

To zip a directory 
```
zip -r folder_name.zip folder_name 
```


To unzip a .zip file to same directory
```
unzip file_name.zip
```
