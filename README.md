# Midi file splitter and joiner

## Purpose
I write music for my acappella singing group using MuseScore, and then I need to create practice tracks for each individual part using Ableton. To make those practice tracks, I export midi files out of MuseScore. However, sometimes I need to do a bit of extra processing on those parts.

### splitter.js
This script will take one midi file and split it into three. Splits are done when two midi notes are being played at the same time. The higher note is split into the first file and the lower note is split into the second file (and are removed from the original). At the end of the splitting, the original becomes the third file.

### joiner.js
This script will take two midi files and create three files in total. The third file is created by finding identical notes in the first two files. When an identical note is found, it is removed from both of the original files and added to the third file.
