---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
date: '{{ .Date }}'
type: comic
params:
  image: /comics/your-comic-image.png
  alt: Describe the comic image for screen readers
  transcript: ''
---
