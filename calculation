export class Calculator {
    constructor(dataStore) {
        this.dataStore = dataStore;
        this.STAT_CAPS = this.dataStore.getStatCaps();
    }

    calculateAgility(adaptability, attunement) {
        return Math.floor(adaptability * 0.75 + attunement * 0.25) + 85;
    }

    getIFrames(agility) {
        if (agility >= 116) return 16;
        if (agility >= 113) return 15;
        if (agility >= 111) return 14;
        if (agility >= 109) return 13;
        if (agility >= 108) return 12;
        if (agility >= 106) return 11;
        if (agility >= 105) return 10;
        if (agility >= 103) return 9;
        if (agility >= 102) return 8;
        if (agility >= 101) return 7;
        if (agility >= 100) return 6;
        if (agility >= 99) return 5;
        return 5;
    }

    meetsWeaponRequirements(weapon, stats) {
        const reqs = weapon.requirements;
        return (
            stats.strength >= reqs.strength &&
            stats.dexterity >= reqs.dexterity &&
            stats.intelligence >= reqs.intelligence &&
            stats.faith >= reqs.faith
        );
    }

    meetsSpellRequirements(spell, stats) {
        const reqs = spell.requirements;
        return (
            stats.intelligence >= reqs.intelligence &&
            stats.faith >= reqs.faith
        );
    }

    recommendWeapons(stats) {
        const allWeapons = this.dataStore.getAllWeapons();
        return allWeapons.map(weapon => ({
            ...weapon,
            meetsRequirements: this.meetsWeaponRequirements(weapon, stats)
        }));
    }

    recommendSpells(stats, playstyle) {
        const spells = this.dataStore.getSpellsForPlaystyle(playstyle);
        return spells.map(spell => ({
            ...spell,
            meetsRequirements: this.meetsSpellRequirements(spell, stats)
        }));
    }

    distributeStats(startingStats, availablePoints, playstyle, priority) {
        let distribution = { ...startingStats };
        let remaining = availablePoints;

        const requirements = this.getPlaystyleRequirements(playstyle, priority);

        for (let stat in requirements.minimums) {
            const needed = Math.max(0, requirements.minimums[stat] - distribution[stat]);
            distribution[stat] += needed;
            remaining -= needed;
        }

        const weights = this.groupStatsByWeight(requirements.weights);
        while (remaining > 0) {
            for (const group of weights) {
                for (const stat of group.stats) {
                    if (remaining <= 0) break;
                    if (this.getStatEfficiency(stat, distribution[stat]) >= 0.1) {
                        distribution[stat]++;
                        remaining--;
                    }
                }
            }
            break; // prevent infinite loop in case weights are exhausted
        }

        return distribution;
    }

    getStatEfficiency(stat, value) {
        const [soft, hard] = this.STAT_CAPS[stat] || [30, 50];
        if (value < soft) return 1.0;
        if (value < hard) return 0.5;
        return 0.1;
    }

    groupStatsByWeight(weights) {
        const weightGroups = new Map();
        for (let stat in weights) {
            const weight = weights[stat];
            if (!weightGroups.has(weight)) weightGroups.set(weight, []);
            weightGroups.get(weight).push(stat);
        }
        return Array.from(weightGroups.entries())
            .map(([weight, stats]) => ({ weight, stats }))
            .sort((a, b) => b.weight - a.weight);
    }

    getPlaystyleRequirements(playstyle, priority) {
        const base = {
            minimums: {},
            weights: {
                vigor: 0.8,
                endurance: 0.6,
                vitality: 0.3,
                adaptability: 0.9,
                strength: 0.1,
                dexterity: 0.1,
                intelligence: 0.1,
                faith: 0.1,
                attunement: 0.1
            }
        };

        switch (priority) {
            case 'survivability':
                base.weights.vigor += 0.5;
                base.weights.vitality += 0.4;
                base.weights.adaptability -= 0.4;
                base.weights.endurance += 0.2;
                base.weights.attunement -= 0.1;
                break;
            case 'evasion':
                base.weights.vigor -= 0.6;
                base.weights.vitality -= 0.3;
                base.weights.adaptability += 0.8;
                base.weights.attunement += 0.2;
                base.weights.endurance += 0.2;
                break;
            case 'damage':
                base.weights.vigor -= 0.4;
                base.weights.vitality -= 0.2;
                base.weights.adaptability -= 0.1;
                break;
            case 'versatility':
                base.weights.vigor += 0.1;
                base.weights.vitality += 0.1;
                base.weights.adaptability += 0.1;
                base.weights.endurance += 0.1;
                break;
        }

        switch (playstyle) {
            case 'barbarian':
                base.minimums = { vigor: 10, strength: 10 };
                base.weights.strength = 1.3;
                base.weights.dexterity = 0.6;
                break;
            case 'swordsman':
                base.minimums = { vigor: 10, dexterity: 10 };
                base.weights.dexterity = 1.3;
                break;
            case 'knight':
                base.minimums = { strength: 10, dexterity: 10 };
                base.weights.strength = 1.0;
                base.weights.dexterity = 1.0;
                break;
            case 'mage':
                base.minimums = { intelligence: 10, attunement: 10 };
                base.weights.intelligence = 1.5;
                base.weights.attunement = 1.0;
                break;
            case 'priest':
                base.minimums = { faith: 10, attunement: 10 };
                base.weights.faith = 1.5;
                base.weights.attunement = 1.0;
                break;
            case 'hexer':
                base.minimums = { intelligence: 10, faith: 10 };
                base.weights.intelligence = 1.3;
                base.weights.faith = 1.3;
                break;
        }

        return base;
    }
}
