#!/usr/bin/env bash
git add "$1"
git status
git commit -m "$2"
# upstream set to origin master
git push origin master