export class Calculator {
    constructor(dataStore) {
        this.dataStore = dataStore;
        this.STAT_CAPS = this.dataStore.getStatCaps();
        this.BASE_STAT_TOTAL = 53; // DS2: Level 1 is sum(stats) == 54, so Level = sum(stats) - 53
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

    /**
     * Allocate stats to reach a TARGET LEVEL (levelCap).
     * This method ensures that final stats sum to (BASE_STAT_TOTAL + levelCap)
     * regardless of starting class.
     */
    distributeStats(startingStats, levelCap, playstyle, priority) {
        // Always start from a fresh copy of starting stats
        let distribution = { ...startingStats };
        const requirements = this.getPlaystyleRequirements(playstyle, priority);

        // 1. Set minimum requirements (never decrease below starting stats)
        for (let stat in requirements.minimums) {
            const needed = Math.max(0, requirements.minimums[stat] - distribution[stat]);
            if (needed > 0) {
                distribution[stat] += needed;
            }
        }

        // 2. Now, repeatedly allocate points by priority/weights until we reach the correct stat sum for levelCap
        //   total stats at levelCap = BASE_STAT_TOTAL + (levelCap)
        const targetStatSum = this.BASE_STAT_TOTAL + levelCap;

        // 3. Count current stat sum (after minimums)
        let currentStatSum = Object.values(distribution).reduce((a, b) => a + b, 0);

        // 4. Priority: get Vigor, Adaptability, Endurance to reasonable levels first, but not past targetStatSum
        let pointsToAllocate = targetStatSum - currentStatSum;
        if (pointsToAllocate > 0) {
            pointsToAllocate = this.prioritizeVitalStats(distribution, pointsToAllocate, targetStatSum);
        }

        // 5. Distribute by weights, soft caps, and efficiency, never exceeding targetStatSum
        const weights = this.groupStatsByWeight(requirements.weights);

        while (true) {
            let pointsSpent = 0;
            let statSum = Object.values(distribution).reduce((a, b) => a + b, 0);
            let pointsLeft = targetStatSum - statSum;
            if (pointsLeft <= 0) break;

            for (const group of weights) {
                if (pointsLeft <= 0) break;

                // Try to bring highest weight stats to their soft caps
                if (group.weight >= 1.0) {
                    const spent = this.distributeToSoftCaps(distribution, group.stats, pointsLeft);
                    pointsSpent += spent;
                    statSum = Object.values(distribution).reduce((a, b) => a + b, 0);
                    pointsLeft = targetStatSum - statSum;
                    if (spent > 0) continue; // If points spent, start loop over
                }

                // Then distribute evenly among stats of the same weight
                const groupPointsSpent = this.distributeEvenly(distribution, group.stats, Math.min(pointsLeft, group.stats.length * 5), targetStatSum);
                pointsSpent += groupPointsSpent;
                statSum = Object.values(distribution).reduce((a, b) => a + b, 0);
                pointsLeft = targetStatSum - statSum;
            }

            if (pointsSpent === 0) break; // No more efficient stats to raise or statSum reached
        }

        // 6. Final clamp: never let any stat fall below starting value
        for (let stat in distribution) {
            if (distribution[stat] < startingStats[stat]) {
                distribution[stat] = startingStats[stat];
            }
        }

        return distribution;
    }

    /**
     * Prioritize leveling Vigor, Adaptability, Endurance to reasonable levels first,
     * but never raise total stats above targetStatSum.
     */
    prioritizeVitalStats(distribution, points, targetStatSum) {
        let remaining = points;
        const vigorTarget = Math.min(20, Math.floor(points * 0.13) + distribution.vigor);
        const adaptabilityTarget = Math.min(20, Math.floor(points * 0.14) + distribution.adaptability);
        const enduranceTarget = Math.min(20, Math.floor(points * 0.05) + distribution.endurance);

        while (distribution.vigor < vigorTarget && remaining > 0 && this.getStatEfficiency('vigor', distribution.vigor) >= 0.5) {
            if (this._statSum(distribution) >= targetStatSum) break;
            distribution.vigor++;
            remaining--;
        }
        while (distribution.adaptability < adaptabilityTarget && remaining > 0 && this.getStatEfficiency('adaptability', distribution.adaptability) >= 0.5) {
            if (this._statSum(distribution) >= targetStatSum) break;
            distribution.adaptability++;
            remaining--;
        }
        while (distribution.endurance < enduranceTarget && remaining > 0 && this.getStatEfficiency('endurance', distribution.endurance) >= 0.5) {
            if (this._statSum(distribution) >= targetStatSum) break;
            distribution.endurance++;
            remaining--;
        }
        while (remaining > 0 && (distribution.vigor < 30 || distribution.adaptability < 20)) {
            let pointsThisRound = 0;
            if (distribution.vigor < 30 && this.getStatEfficiency('vigor', distribution.vigor) >= 0.5) {
                if (this._statSum(distribution) >= targetStatSum) break;
                distribution.vigor++;
                remaining--;
                pointsThisRound++;
            }
            if (remaining > 0 && distribution.adaptability < 20 && this.getStatEfficiency('adaptability', distribution.adaptability) >= 0.5) {
                if (this._statSum(distribution) >= targetStatSum) break;
                distribution.adaptability++;
                remaining--;
                pointsThisRound++;
            }
            if (pointsThisRound === 0) break;
        }
        return remaining;
    }

    groupStatsByWeight(weights) {
        const weightGroups = new Map();
        for (let stat in weights) {
            const weight = weights[stat];
            if (weight > 0) {
                if (!weightGroups.has(weight)) weightGroups.set(weight, []);
                weightGroups.get(weight).push(stat);
            }
        }
        return Array.from(weightGroups.entries())
            .map(([weight, stats]) => ({ weight, stats }))
            .sort((a, b) => b.weight - a.weight);
    }

    // Distribute to soft caps for high-weight stats, but don't exceed targetStatSum
    distributeToSoftCaps(distribution, stats, maxPoints) {
        let pointsSpent = 0;
        for (let stat of stats) {
            if (pointsSpent >= maxPoints) break;
            const currentValue = distribution[stat];
            const caps = this.STAT_CAPS[stat] || [30, 50];
            const softCap = caps[0];
            if (currentValue < softCap) {
                const pointsNeeded = softCap - currentValue;
                const pointsToSpend = Math.min(pointsNeeded, maxPoints - pointsSpent);
                distribution[stat] += pointsToSpend;
                pointsSpent += pointsToSpend;
            }
        }
        return pointsSpent;
    }

    // Distribute remaining points evenly among group, respecting diminishing returns and not exceeding targetStatSum
    distributeEvenly(distribution, stats, maxPoints, targetStatSum) {
        let pointsSpent = 0;
        let availableStats = [...stats];
        while (pointsSpent < maxPoints && availableStats.length > 0) {
            let roundPointsSpent = 0;
            for (let i = availableStats.length - 1; i >= 0; i--) {
                if (pointsSpent >= maxPoints) break;
                const stat = availableStats[i];
                const currentValue = distribution[stat];
                const efficiency = this.getStatEfficiency(stat, currentValue);
                if (efficiency >= 0.1) {
                    if (this._statSum(distribution) >= targetStatSum) break;
                    distribution[stat]++;
                    pointsSpent++;
                    roundPointsSpent++;
                } else {
                    availableStats.splice(i, 1);
                }
            }
            if (roundPointsSpent === 0) break;
        }
        return pointsSpent;
    }

    getStatEfficiency(stat, value) {
        const [soft, hard] = this.STAT_CAPS[stat] || [30, 50];
        if (value < soft) return 1.0;
        if (value < hard) return 0.5;
        return 0.1;
    }

    // Utility: sum of all stats
    _statSum(statsObj) {
        return Object.values(statsObj).reduce((a, b) => a + b, 0);
    }

    // Playstyle/priority logic: copy from your working HTML or Datastore as needed
    getPlaystyleRequirements(playstyle, priority) {
        // (unchanged from your code)
        // ...
    }
}
