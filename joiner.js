const fs = require('fs');
const { Midi } = require('@tonejs/midi');

// Read MIDI file as ArrayBuffer
const inputFile1 = '';
const inputFile2 = '';
const outputFile = '';
const outputFile1 = '';
const outputFile2 = '';
const midiData1 = fs.readFileSync(inputFile1);
const midiData2 = fs.readFileSync(inputFile2);

const unison = new Midi(midiData1);
const one = new Midi(midiData1);
const two = new Midi(midiData2);

// Remove all notes from unison
unison.tracks.forEach(track => track.notes = []);

for (let i = 0; i < one.tracks[0].notes.length; i++){
    // If the same note happens in one and two, remove them from one and two and add it to unison
    const noteOne = one.tracks[0].notes[i];
    const noteTwo = two.tracks[0].notes.find(n => n.time === noteOne.time && n.midi === noteOne.midi && n.duration === noteOne.duration);
    if (noteTwo) {
        unison.tracks[0].notes.push(noteOne);
        one.tracks[0].notes = one.tracks[0].notes.filter(n => n !== noteOne);
        two.tracks[0].notes = two.tracks[0].notes.filter(n => n !== noteTwo);
        i--;
    }
}

// Write the modified MIDI data to output files
fs.writeFileSync(outputFile1, Buffer.from(one.toArray()));
fs.writeFileSync(outputFile2, Buffer.from(two.toArray()));
console.log('MIDI files created: one_' + outputFile + ' and two_' + outputFile);
fs.writeFileSync(outputFile, Buffer.from(unison.toArray()));
console.log('MIDI file created: unison_' + outputFile);
