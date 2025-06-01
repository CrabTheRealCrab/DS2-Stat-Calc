export class DataStore {
    constructor() {
        this.startingClasses = {
            deprived: {
                name: "Deprived",
                startingLevel: 1,
                stats: { vigor: 6, endurance: 6, vitality: 6, adaptability: 6, strength: 6, dexterity: 6, intelligence: 6, faith: 6, attunement: 6 }
            },
            warrior: {
                name: "Warrior",
                startingLevel: 12,
                stats: { vigor: 7, endurance: 6, vitality: 6, adaptability: 5, strength: 15, dexterity: 11, intelligence: 5, faith: 5, attunement: 5 }
            },
            knight: {
                name: "Knight",
                startingLevel: 13,
                stats: { vigor: 12, endurance: 6, vitality: 7, adaptability: 9, strength: 11, dexterity: 8, intelligence: 3, faith: 6, attunement: 4 }
            },
            swordsman: {
                name: "Swordsman",
                startingLevel: 12,
                stats: { vigor: 4, endurance: 8, vitality: 4, adaptability: 6, strength: 9, dexterity: 16, intelligence: 7, faith: 5, attunement: 6 }
            },
            bandit: {
                name: "Bandit",
                startingLevel: 11,
                stats: { vigor: 9, endurance: 7, vitality: 11, adaptability: 3, strength: 9, dexterity: 14, intelligence: 1, faith: 8, attunement: 2 }
            },
            cleric: {
                name: "Cleric",
                startingLevel: 14,
                stats: { vigor: 10, endurance: 3, vitality: 8, adaptability: 4, strength: 11, dexterity: 5, intelligence: 4, faith: 12, attunement: 10 }
            },
            sorcerer: {
                name: "Sorcerer",
                startingLevel: 11,
                stats: { vigor: 5, endurance: 6, vitality: 5, adaptability: 8, strength: 3, dexterity: 7, intelligence: 14, faith: 4, attunement: 12 }
            },
            explorer: {
                name: "Explorer",
                startingLevel: 10,
                stats: { vigor: 7, endurance: 6, vitality: 9, adaptability: 12, strength: 6, dexterity: 6, intelligence: 5, faith: 5, attunement: 7 }
            }
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
