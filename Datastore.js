export class DataStore {
    constructor() {
        this.startingClasses = {
            deprived: {
                name: "Deprived",
                startingLevel: 1,
                stats: {
                    vigor: 6,
                    endurance: 6,
                    vitality: 6,
                    adaptability: 6,
                    strength: 6,
                    dexterity: 6,
                    intelligence: 6,
                    faith: 6,
                    attunement: 6
                }
            },
            // Add other classes as needed
        };

        this.statCaps = {
            vigor: [30, 50],
            endurance: [20, 40],
            vitality: [20, 40],
            adaptability: [20, 39],
            strength: [30, 50],
            dexterity: [30, 50],
            intelligence: [40, 50],
            faith: [40, 50],
            attunement: [25, 45]
        };

        this.weapons = {
            dagger: [
                {
                    name: "Basic Dagger",
                    scaling: "D DEX",
                    requirements: {
                        strength: 5,
                        dexterity: 8,
                        intelligence: 0,
                        faith: 0
                    },
                    type: "Dagger"
                }
            ],
            sword: [
                {
                    name: "Basic Sword",
                    scaling: "C STR, C DEX",
                    requirements: {
                        strength: 10,
                        dexterity: 10,
                        intelligence: 0,
                        faith: 0
                    },
                    type: "Straight Sword"
                }
            ],
            axe: [
                {
                    name: "Basic Axe",
                    scaling: "B STR",
                    requirements: {
                        strength: 12,
                        dexterity: 6,
                        intelligence: 0,
                        faith: 0
                    },
                    type: "Axe"
                }
            ]
            // More weapon types can be added here
        };

        this.spells = {
            sorcery: [
                {
                    name: "Test Spell",
                    requirements: { intelligence: 10, faith: 0 },
                    type: "Attack"
                }
            ],
            miracle: [
                {
                    name: "Heal",
                    requirements: { intelligence: 0, faith: 12 },
                    type: "Healing"
                }
            ],
            hex: [
                {
                    name: "Dark Orb",
                    requirements: { intelligence: 12, faith: 10 },
                    type: "Attack"
                }
            ]
        };
    }

    getClass(key) {
        return this.startingClasses[key];
    }

    getAllWeapons() {
        return Object.values(this.weapons).flat();
    }

    getStatCaps() {
        return this.statCaps;
    }

    getSpellsForPlaystyle(playstyle) {
        switch (playstyle) {
            case 'mage':
            case 'magic_swordsman':
            case 'mage_barbarian':
                return this.spells.sorcery;
            case 'priest':
            case 'paladin':
            case 'faith_dex':
                return this.spells.miracle;
            case 'hexer':
            case 'hexer_physical':
                return this.spells.hex;
            default:
                return [];
        }
    }
}
