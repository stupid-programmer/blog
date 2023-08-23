---
title: 'Text manipulation in Linux'
description: 'Manipulating files in Linux, cat, less, search, filter and move.'
pubDate: 'Aug 23 2023'
heroImage: '/blog-placeholder-4.jpg'
---

Display entire file
```
cat /etc/filename.txt
```


Show the start/head of a file
```
head /etc/filename.txt
```

Show the end/tail of a file
```
tail /etc/filename.txt
```

These commands can take an argument for an amount of lines
```
head -20 /etc/filename.txt
```

Get display a file with line numbers
```
nl /etc/filename.txt
```

#### Grep
###### Filter Text With Grep

Get all the lines containing a word, in this case output. It gets the file and then pipes that output to grep to search for the keyword
```
cat /etc/filename | grep output
```

Get 5 lines above a keyword
```
get this line of the file | get the top 6 lines from the line passed to it
tail -n+33 /etc/filename.txt | head -n 6
```

### Find and replace

The s command is the substitution command
Then the word in the file we want to change
Then by the word we want to replace in the file
The /g is for global replacement 
Then the location of the file
Then the filename we want to use for the new file 
```
sed s/wordToFind/wordToReplace/g /etc/filename.txt > newfilename.txt
```

#### Viewing Files

More displays one page at a time
```
more /etc/filename.txt
```

##### Search for keywords in a file

Less allows you to search a file
```
less /etc/filename.txt
```

In the bottom left the filename is display so enter / followed by the word
```
/keyword to search
```

To find the next occurance of the word just press n
```
n
```