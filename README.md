# Obsidian Quick Link Replace Plugin

This is a plugin for Obsidian (https://obsidian.md).

Insert quick links like `&[number]` or `&[number]-[number]` and click the button later to replace them. For example, it can replace `&5` for `[[file5.jpg]]`.

This is useful if you want to add quick links to pictures or notes you don't have yet, and replace them once you add them to your vault.

## Example: 

Click the replace button and set prepend to `![[image` and append to `.jpg]]`.
Then a note like this:

```md

&1
- Explanation of first image

&2
- Explanation of second image

&3-5
- Next images
```

Would be replaced to:

```md
![[image0.jpg]]
- Explanation of first image

![[image1.jpg]]
- Explanation of second image

![[image2.jpg]]
![[image3.jpg]]
![[image4.jpg]]
- Next images
```
