---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
date: '{{ .Date }}'
type: comic
params:
  image:
    - src: /comics/your-comic-image-panel-1.png
      alt: Describe panel 1 for screen readers
    - src: /comics/your-comic-image-panel-2.png
      alt: Describe panel 2 for screen readers
  transcript: ''
---
