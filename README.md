Cross-browser CSS generator
==============

Demo:

Every time assigning a new CSS3 rule I have to recall how many vendor prefixes was ever introduced to the property, was that a non-standard syntax and is there any tricks to support IE 5-8 browsers. So, I made this service, which simply generates desired CSS for me.

How does it work? You provide a CSS declaration (e.g. transition: inset 5px black; or background-image: linear-gradient(to bottom, #444444, #999999); ) and the services tries to make it cross-browser.

If you spot any inaccuracy or missing compatibility pattern, please feel free, to contact me at https://github.com/dsheiko/ccss-generator.

