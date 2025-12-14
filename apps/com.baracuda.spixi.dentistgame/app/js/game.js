// =======================================
// Klara's Birthday Mystery - Pure Detective Adventure
// A 20-minute mystery for a brilliant investigator
// =======================================

// --- Music System (Synth Noir) ---
class MusicManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.isPlaying = false;
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.playBassline();
        this.playMelody();
    }

    playBassline() {
        if (!this.isPlaying) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, this.ctx.currentTime);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2);
        osc.start();
        osc.stop(this.ctx.currentTime + 2);
        setTimeout(() => this.playBassline(), 4000);
    }

    playMelody() {
        if (!this.isPlaying) return;
        const notes = [440, 493, 523, 587, 659];
        const note = notes[Math.floor(Math.random() * notes.length)];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.5);
        setTimeout(() => this.playMelody(), Math.random() * 3000 + 2000);
    }
}

// --- Game State ---
const gameState = {
    inventory: [],
    currentNode: 'start',
    flags: {
        foundFirstClue: false,
        talkedToWitness: false,
        analyzedFingerprints: false,
        checkedSecurity: false,
        solvedCodePuzzle: false
    }
};

// --- Story Database ---
const storyNodes = {
    start: {
        text: "Happy Birthday, Detective Klara!\n\nYou're the best investigator in the city, and tonight you've been called to Dr. Decay's Dental Office for a baffling case.\n\nThe legendary Golden Molar—a priceless artifact once owned by a Hollywood star—has vanished. The police are stumped. The insurance company is panicking.\n\nBut you? You live for cases like this.\n\nAs you arrive at the dimly lit office, you notice the door is slightly ajar. Inside, the reception area is eerily quiet. The clock ticks. A coffee cup steams on the desk—still warm.\n\nSomeone was here minutes ago.",
        choices: [
            { label: 'A) Examine the reception desk carefully', next: 'desk_examine' },
            { label: 'B) Check the appointment book', next: 'appointment_book' },
            { label: 'C) Look for the security office', next: 'security_office' },
            { label: 'D) Call out to announce your presence', next: 'call_out' }
        ]
    },

    desk_examine: {
        text: "You approach the reception desk with a detective's eye.\n\nThe coffee is still hot—whoever was here left in the last 5 minutes. Next to it, a half-eaten sandwich. No signs of struggle.\n\nA sticky note reads: 'Meeting with Dr. D at 8 PM - confirm Golden Molar display.'\n\nYou notice something odd: the computer monitor is on, but the screen is locked. Password protected. However, there's a small notepad with what looks like password hints scribbled in the margins.",
        choices: [
            { label: 'A) Try to guess the password', next: 'password_attempt' },
            { label: 'B) Take the sticky note as evidence', next: 'take_sticky', inventory: 'Sticky Note' },
            { label: 'C) Check under the desk', next: 'under_desk' },
            { label: 'D) Move to the hallway', next: 'hallway' }
        ]
    },

    appointment_book: {
        text: "You flip through the appointment book. Most entries are routine:\n\nCleanings, fillings, extractions. Standard dental work.\n\nBut three entries stand out:\n\n6:00 PM - 'Mr. Vittorio' - NO CONTACT INFO\n7:30 PM - 'Insurance Inspection' - CANCELLED in red\n8:00 PM - 'Detective Klara' - YOUR NAME\n\nWait. How did they know you'd be coming at exactly 8 PM? You weren't assigned this case until 7:45 PM.\n\nSomeone knew you'd be here.",
        choices: [
            { label: 'A) This is suspicious - check security footage', next: 'security_office' },
            { label: 'B) Investigate who Mr. Vittorio is', next: 'vittorio_clue' },
            { label: 'C) Search the reception area more', next: 'desk_examine' },
            { label: 'D) Head directly to the crime scene', next: 'crime_scene_operatory' }
        ]
    },

    security_office: {
        text: "You find a small security office behind the reception desk.\n\nThree monitors show different angles of the office. One camera is pointed at Operatory 1—the crime scene.\n\nYou rewind the footage. At 7:42 PM, you see something shocking:\n\nA figure in a maintenance uniform enters Operatory 1. Their face is obscured by a cap. They move with purpose—no hesitation. They approach the Golden Molar display, but here's the strange part...\n\nThey don't steal it. They just... look at it. For exactly 30 seconds. Then they adjust something on the pedestal and leave.\n\n3 minutes later, the alarms go off. But the Molar is already gone.",
        choices: [
            { label: 'A) Review footage of the maintenance person leaving', next: 'footage_review', flag: 'checkedSecurity' },
            { label: 'B) Check what they adjusted on the pedestal', next: 'crime_scene_operatory' },
            { label: 'C) Look for employee records', next: 'employee_records' },
            { label: 'D) Print screenshots of the suspect', next: 'print_screenshots', inventory: 'Security Photos' }
        ]
    },

    hallway: {
        text: "The hallway stretches before you, lined with doors to various examination rooms.\n\nFluorescent lights flicker overhead. You notice:\n\n- Door to Operatory 1 (CRIME SCENE TAPE)\n- Door to Operatory 2 (slightly ajar)\n- X-Ray Room (light is on)\n- Sterilization Room (locked)\n- Dr. Decay's Private Office (door closed)\n- Laboratory (at the end of hall)\n\nYou also notice muddy footprints leading from the emergency exit to Operatory 2. The mud is still wet.",
        choices: [
            { label: 'A) Follow the footprints to Operatory 2', next: 'operatory2_footprints' },
            { label: 'B) Enter the crime scene (Operatory 1)', next: 'crime_scene_operatory' },
            { label: 'C) Investigate the X-Ray Room', next: 'xray_room' },
            { label: 'D) Try Dr. Decay\'s office', next: 'office_initial' }
        ]
    },

    crime_scene_operatory: {
        text: "You duck under the crime scene tape and enter Operatory 1.\n\nThe room looks untouched—almost too perfect. The dental chair sits in the center. On the far wall, a glass pedestal stands empty where the Golden Molar should be.\n\nBut here's what catches your detective eye:\n\n1. The glass case isn't broken. It was opened with thekey.\n2. On the pedestal, a small mechanical device blinks with a red LED.\n3. Fingerprint powder shows THREE distinct sets of prints on the case.\n4. On the floor, a single gold flake—not from the Molar, but from something else.\n\nThis wasn't a smash-and-grab. This was calculated.",
        choices: [
            { label: 'A) Examine the blinking device', next: 'examine_device' },
            { label: 'B) Collect the gold flake', next: 'collect_gold_flake', inventory: 'Gold Flake' },
            { label: 'C) Analyze the fingerprints', next: 'fingerprint_analysis' },
            { label: 'D) Look for more hidden clues', next: 'hidden_clues_op1' }
        ]
    },

    examine_device: {
        text: "You carefully examine the blinking device on the pedestal.\n\nIt's a timer. No—wait. It's a WEIGHT SENSOR.\n\nThe setup becomes clear: The Golden Molar sat on this sensor. When it was removed, it should have triggered an immediate alarm.\n\nBut according to security footage, there was a 3-minute delay. Someone modified this sensor.\n\nYou notice fresh solder marks on the circuit board. Someone with technical skills was here recently.\n\nUnder the sensor, etched into the metal: 'Patent #4782-V'",
        choices: [
            { label: 'A) Look up Patent #4782-V', next: 'patent_search', flag: 'foundFirstClue' },
            { label: 'B) Check employee records for tech skills', next: 'employee_records' },
            { label: 'C) Continue searching the crime scene', next: 'hidden_clues_op1' },
            { label: 'D) Move to investigate other rooms', next: 'hallway' }
        ]
    },

    fingerprint_analysis: {
        text: "You photograph the three sets of fingerprints and run them through your portable scanner.\n\nRESULTS:\n\nPrint Set #1: Dr. Desmond Decay (owner) - Expected\nPrint Set #2: Rita Rinse (receptionist) - Expected  \nPrint Set #3: UNKNOWN - No match in database\n\nThe third set is interesting. The ridge patterns suggest someone who works with their hands frequently. Manual labor. The prints are slightly smudged—as if wearing thin latex gloves that tore.\n\nProfessional, but made a mistake.",
        choices: [
            { label: 'A) Look for torn glove fragments', next: 'search_glove_fragments', flag: 'analyzedFingerprints' },
            { label: 'B) Check maintenance staff records', next: 'maintenance_records' },
            { label: 'C) Continue investigating the device', next: 'examine_device' },
            { label: 'D) Move to another location', next: 'hallway' }
        ]
    },

    operatory2_footprints: {
        text: "You follow the wet, muddy footprints into Operatory 2.\n\nThis room is under renovation. Dental equipment sits half-assembled. Drop cloths cover the floor. Paint cans line the walls.\n\nThe footprints lead to... a window. It's partially open. Fresh mud on the sill.\n\nSomeone climbed OUT this window recently. But why? The office front door was unlocked.\n\nOn a nearby tool cart, you find a work order: 'Complete Room 2 renovation by Friday - V. Planski, Contractor'\n\nThere's also a blueprint tube, slightly wet, as if someone grabbed it with muddy hands.",
        choices: [
            { label: 'A) Examine the blueprints', next: 'blueprints' },
            { label: 'B) Look outside the window', next: 'window_outside' },
            { label: 'C) Search the tool cart', next: 'tool_cart' },
            { label: 'D) Check the work order details', next: 'work_order_check' }
        ]
    },

    xray_room: {
        text: "The X-Ray Room hums with the quiet buzz of equipment.\n\nOn the light board, several X-ray films are mounted. Most are patient scans, but one is... different.\n\nIt's an X-ray of the Golden Molar itself. Taken yesterday according to the date stamp.\n\nBut here's what's bizarre: The X-ray shows a HOLLOW CAVITY inside the Molar. Something was hidden inside it.\n\nOn the counter, a handwritten note: 'Confirmed: microfilm inside. Estimated value exceeds the Molar itself. -D.D.'\n\nThis isn't about stealing a gold tooth. This is about whatever was HIDDEN inside it.",
        choices: [
            { label: 'A) Take the X-ray and note', next: 'take_xray_note', inventory: 'X-Ray Film' },
            { label: 'B) Research what microfilm could be inside', next: 'microfilm_research' },
            { label: 'C) Confront Dr. Decay about this', next: 'confront_decay' },
            { label: 'D) Keep investigating quietly', next: 'hallway' }
        ]
    },

    office_initial: {
        text: "You try the handle to Dr. Decay's private office.\n\nLocked. But you notice scuff marks on the doorframe—recent. Someone forced this door open, then locked it again from the inside.\n\nThrough the frosted glass, you see a light is on. Someone is in there.\n\nYou hear papers shuffling. A drawer closing. Footsteps.",
        choices: [
            { label: 'A) Knock loudly and identify yourself', next: 'knock_office' },
            { label: 'B) Pick the lock quietly', next: 'pick_lock' },
            { label: 'C) Wait and watch who comes out', next: 'stake_out' },
            { label: 'D) Find another way in', next: 'find_other_entry' }
        ]
    },

    lab_investigation: {
        text: "You enter the laboratory at the end of the hall.\n\nScientific equipment fills the room: microscopes, centrifuges, chemical analysis stations. This is where Dr. Decay analyzed the Golden Molar.\n\nOn the main workstation, files are spread out:\n\n- Analysis Report: 'Golden Molar - 18K Gold, circa 1940s'\n- Chemical Tests: 'Trace amounts of silver nitrate inside cavity'\n- Photograph: Close-up of the hollow interior\n\nBut the most interesting item is a partially burned document in the trash. You can make out:\n\n'...film contains list of... Swiss accounts... must be recovered before... Monday deadline...'\n\nThis is big. Much bigger than a stolen tooth.",
        choices: [
            { label: 'A) Reconstruct the burned document', next: 'reconstruct_document' },
            { label: 'B) Research silver nitrate uses', next: 'silver_nitrate_research' },
            { label: 'C) Check the analysis equipment', next: 'check_equipment' },
            { label: 'D) This is dangerous - call for backup', next: 'call_backup' }
        ]
    },

    final_confrontation: {
        text: "All the pieces finally click into place.\n\nYou've gathered enough evidence:\n\n- The Golden Molar contained microfilm with Swiss bank account numbers\n- It's worth millions, explaining the elaborate theft\n- The contractor 'V. Planski' is actually Victor Plaque, a known art thief\n- Dr. Decay discovered the microfilm and was about to report it when it was stolen\n- The theft was precisely timed to your arrival—someone wanted YOU to investigate\n\nYou hear a sound behind you in the lab. You spin around.\n\nDr. Decay stands in the doorway, but he's not alone. Next to him is a woman in a police uniform—but you don't recognize her badge number.\n\n'Detective Klara,' Dr. Decay says nervously, 'I need to explain—'\n\nThe woman cuts him off. 'You've been very thorough, Detective. Too thorough. The microfilm is ours now. You should have stayed out of it.'",
        choices: [
            { label: 'A) "You\'re not real police. Who are you?"', next: 'question_fake_cop' },
            { label: 'B) Activate your emergency beacon', next: 'emergency_beacon' },
            { label: 'C) Pretend you know less than you do', next: 'play_dumb' },
            { label: 'D) Make a break for the exit', next: 'run_for_it' }
        ]
    },

    victory_ending: {
        text: "Your emergency beacon worked perfectly.\n\nWithin minutes, real police flood the building. The fake officer is revealed to be Maria Vittorio—sister of the crime boss whose accounts were listed on the microfilm.\n\nVictor Plaque is caught trying to fence the Golden Molar at a downtown pawn shop. He breaks down and confesses everything.\n\nDr. Decay is shaken but unharmed. He thanks you profusely: 'I found that microfilm two days ago during a routine cleaning of the Molar. I was going to turn it over to authorities, but then the threats started...'\n\nThe Swiss accounts are frozen. Millions in crime proceeds are recovered. The Golden Molar is returned to its display.\n\nAnd you?\n\nThe mayor himself hands you a commendation. 'Detective Klara, you've done it again. Happy Birthday—and thank you for keeping our city safe.'\n\nBest. Birthday. Ever.\n\n🎂🔍 CASE CLOSED 🔍🎂\n\n(Happy Birthday, Klara! You're brilliant!)",
        choices: []
    },

    game_over_caught: {
        text: "You weren't fast enough.\n\nThe fake officer had backup. Before you can escape, you're surrounded.\n\nBut they make a critical mistake—they don't take your phone. While pretending to cooperate, you've already sent all your evidence to headquarters.\n\nPolice arrive within 10 minutes. The criminals are caught. The case is solved.\n\nYour captain shakes his head: 'Klara, you solved the case, but you took an unnecessary risk. Next time, call for backup sooner.'\n\nStill, the Golden Molar is recovered. The criminals are arrested. Justice prevails.\n\nNot your smoothest case, but a win is a win.\n\n🎂⚠️ CASE CLOSED (WITH BACKUP) ⚠️🎂\n\n(Happy Birthday, Klara! Be more careful!)",
        choices: []
    }
};

// Helper shortcuts for shorter nodes
storyNodes.password_attempt = {
    text: "The password hints read: 'First pet + graduation year'\n\nThis is impossible without knowing personal details. You'll need another approach.",
    choices: [
        { label: 'A) Search for personal info elsewhere', next: 'hallway' },
        { label: 'B) Skip the computer for now', next: 'appointment_book' }
    ]
};

storyNodes.call_out = {
    text: "'Hello? Police! Detective Klara here!'\n\nSilence. Then... footsteps. Running. Away from you.\n\nSomeone is still in the building.",
    choices: [
        { label: 'A) Chase the sound', next: 'chase_suspect' },
        { label: 'B) Secure the scene first', next: 'hallway' }
    ]
};

storyNodes.under_desk = {
    text: "Under the desk, you find a dropped key card. Employee badge: 'V. PLANSKI - MAINTENANCE.'\n\nInteresting. The maintenance contractor has access to the building.",
    choices: [
        { label: 'A) Take the key card', next: 'take_keycard', inventory: 'Key Card' },
        { label: 'B) Leave it but note the name', next: 'hallway' }
    ]
};

storyNodes.take_keycard = {
    text: "You pocket the key card. This could unlock important doors.",
    choices: [{ label: 'A) Continue investigating', next: 'hallway' }]
};

storyNodes.take_sticky = {
    text: "You carefully bag the sticky note as evidence.",
    choices: [{ label: 'A) Continue', next: 'desk_examine' }]
};

storyNodes.vittorio_clue = {
    text: "'Mr. Vittorio' has no contact info, no payment method listed. This is a fake appointment—a placeholder.\n\nSomeone used this to gain access to the building.",
    choices: [{ label: 'A) This is suspicious', next: 'hallway' }]
};

storyNodes.emergency_beacon = {
    text: "You subtly activate your emergency beacon. Help is 8 minutes away. You just need to stall...",
    choices: [
        { label: 'A) Stall by questioning them', next: 'stall_questions' },
        { label: 'B) Pretend to cooperate', next: 'pretend_cooperate' }
    ]
};

storyNodes.stall_questions = {
    text: "You ask questions. Lots of questions. About the microfilm, the accounts, the plan.\n\nThe fake officer gets irritated, but Dr. Decay starts talking nervously, buying you time.\n\nYou hear sirens in the distance. Almost there...",
    choices: [{ label: 'A) Keep stalling...', next: 'victory_ending' }]
};

storyNodes.pretend_cooperate = {
    text: "You raise your hands. 'Okay, okay. I'll forget everything I saw. Just let me leave.'\n\nThey're suspicious, but you sound convincing.\n\nSirens wail outside. The fake officer's eyes widen. Too late to escape.",
    choices: [{ label: 'A) Real police burst in', next: 'victory_ ending' }]
};

storyNodes.run_for_it = {
    text: "You bolt for the door, but the fake officer is faster. She grabs your arm—\n\nBut you're a trained detective. You break her grip, spin, and—",
    choices: [
        { label: 'A) Fight her off', next: 'fight_scene' },
        { label: 'B) Sound the fire alarm', next: 'fire_alarm' }
    ]
};

storyNodes.fight_scene = {
    text: "It's brief but intense. You manage to get the upper hand just as real police crash through the door.\n\nBackup arrived! Your earlier call for assistance came through.",
    choices: [{ label: 'A) Victory!', next: 'victory_ending' }]
};

storyNodes.fire_alarm = {
    text: "You slam your fist into the fire alarm. Bells blare. Sprinklers activate.\n\nChaos erupts. In the confusion, you escape and call for real backup.",
    choices: [{ label: 'A) Case closed!', next: 'victory_ending' }]
};

storyNodes.play_dumb = {
    text: "'Microfilm? Swiss accounts? I have no idea what you're talking about. I was just called about a missing tooth.'\n\nThey buy it—mostly. But you know too much. They can't let you leave.\n\nYou need a plan fast.",
    choices: [
        { label: 'A) Try to escape', next: 'run_for_it' },
        { label: 'B) Call for backup covertly', next: 'emergency_beacon' }
    ]
};

// --- Game Engine ---
class GameEngine {
    constructor() {
        this.storyText = document.getElementById('story-text');
        this.choiceButtons = [
            document.getElementById('choice-a'),
            document.getElementById('choice-b'),
            document.getElementById('choice-c'),
            document.getElementById('choice-d')
        ];
        this.inventoryList = document.getElementById('inventory-list');

        this.choiceButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => this.makeChoice(index));
        });

        this.musicManager = new MusicManager();
        document.addEventListener('click', () => this.musicManager.start(), { once: true });
    }

    start() {
        this.displayNode(gameState.currentNode);
    }

    displayNode(nodeId) {
        const node = storyNodes[nodeId];
        if (!node) {
            console.error('Node not found:', nodeId);
            return;
        }

        gameState.currentNode = nodeId;

        // Display story text with typewriter effect
        this.storyText.innerHTML = '';
        this.typeWriter(node.text, 0);

        // Display choices or hide if ending
        if (node.choices.length === 0) {
            this.choiceButtons.forEach(btn => btn.style.display = 'none');
        } else {
            node.choices.forEach((choice, index) => {
                if (this.choiceButtons[index]) {
                    this.choiceButtons[index].textContent = choice.label;
                    this.choiceButtons[index].style.display = 'block';
                    this.choiceButtons[index].disabled = false;
                }
            });
            for (let i = node.choices.length; i < 4; i++) {
                this.choiceButtons[i].style.display = 'none';
            }
        }

        this.updateInventory();
    }

    typeWriter(text, index) {
        if (index < text.length) {
            const char = text.charAt(index);
            if (char === '\n') {
                this.storyText.innerHTML += '<br>';
            } else {
                this.storyText.innerHTML += char;
            }
            setTimeout(() => this.typeWriter(text, index + 1), 15);
        }
    }

    makeChoice(choiceIndex) {
        const node = storyNodes[gameState.currentNode];
        const choice = node.choices[choiceIndex];

        if (!choice) return;

        if (choice.inventory && !gameState.inventory.includes(choice.inventory)) {
            gameState.inventory.push(choice.inventory);
        }

        if (choice.flag) {
            gameState.flags[choice.flag] = true;
        }

        this.choiceButtons.forEach(btn => btn.disabled = true);

        setTimeout(() => {
            this.displayNode(choice.next);
        }, 300);
    }

    updateInventory() {
        if (gameState.inventory.length === 0) {
            this.inventoryList.textContent = 'None yet';
        } else {
            this.inventoryList.textContent = gameState.inventory.join(', ');
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.start();
});
