const fs = require('fs');
const { Midi } = require('@tonejs/midi');

// Read MIDI file as ArrayBuffer
const inputFile = '';
const outputFile = inputFile;
const midiData = fs.readFileSync(inputFile);

const unison = new Midi(midiData);
const one = new Midi(midiData);
const two = new Midi(midiData);

// Remove all notes from one and two
one.tracks.forEach(track => track.notes = []);
two.tracks.forEach(track => track.notes = []);


for (let i = 0; i < unison.tracks[0].notes.length; i++){
    // If two notes are playing at the same time, add the higher one to "one" and lower one to "two"
    const note = unison.tracks[0].notes[i];
    const noteStart = note.time;
    const noteEnd = note.time + note.duration;
    const overlappingNotes = unison.tracks[0].notes.filter(n => {
        const nStart = n.time;
        const nEnd = n.time + n.duration;
        // Check if intervals [noteStart, noteEnd) and [nStart, nEnd) overlap
        return (noteStart < nEnd && nStart < noteEnd);
    });
    if (overlappingNotes.length > 1) {
        // Sort by start time for deterministic behavior
        overlappingNotes.sort((a, b) => a.time - b.time || a.midi - b.midi);
        const first = overlappingNotes[0];
        const second = overlappingNotes[1];
        let higherNote, lowerNote;
        if (first.midi > second.midi) {
            higherNote = first;
            lowerNote = second;
        } else {
            higherNote = second;
            lowerNote = first;
        }
        // Always add higher note to one, lower note to two
        one.tracks[0].notes.push(higherNote);
        two.tracks[0].notes.push(lowerNote);
        // Add any remaining notes to the track where the shorter note was added
        if (overlappingNotes.length > 2) {
            // Determine which note is shorter
            let shorterTrack = (higherNote.duration < lowerNote.duration) ? 'one' : 'two';
            for (let j = 2; j < overlappingNotes.length; j++) {
                if (shorterTrack === 'one') {
                    one.tracks[0].notes.push(overlappingNotes[j]);
                } else {
                    two.tracks[0].notes.push(overlappingNotes[j]);
                }
            }
        }
        // Remove the processed notes from unison
        unison.tracks[0].notes = unison.tracks[0].notes.filter(n => !overlappingNotes.includes(n));
        i -= overlappingNotes.length;
    }
}

// Write the modified MIDI data to output files
fs.writeFileSync(outputFile + "_One.mid", Buffer.from(one.toArray()));
fs.writeFileSync(outputFile + "_Two.mid", Buffer.from(two.toArray()));
console.log('MIDI files created: one_' + outputFile + ' and two_' + outputFile);
fs.writeFileSync(outputFile + "_Unison.mid", Buffer.from(unison.toArray()));
console.log('MIDI file created: unison_' + outputFile);
