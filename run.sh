#!/bin/sh


docker run --init -p 5000:5000 -v $(pwd)/app/:/n-blog/app/ app