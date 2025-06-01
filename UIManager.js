export class UIManager {
    constructor(calculator, dataStore) {
        this.calculator = calculator;
        this.dataStore = dataStore;
        this.startingClass = null;
    }

    init() {
        const classSelect = document.getElementById('startingClass');
        const levelCapInput = document.getElementById('levelCap');
        const playstyleSelect = document.getElementById('playstyle');
        const prioritySelect = document.getElementById('priority');

        classSelect.addEventListener('change', () => this.handleInputChange());
        levelCapInput.addEventListener('input', () => this.handleInputChange());
        playstyleSelect.addEventListener('change', () => this.handleInputChange());
        prioritySelect.addEventListener('change', () => this.handleInputChange());

        // Populate dropdowns
        Object.keys(this.dataStore.startingClasses).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = this.dataStore.startingClasses[key].name;
            classSelect.appendChild(option);
        });

        // Initial state
        classSelect.value = 'deprived';
        this.startingClass = this.dataStore.getClass('deprived');
        this.handleInputChange();
    }

    handleInputChange() {
        const classKey = document.getElementById('startingClass').value;
        const levelCap = parseInt(document.getElementById('levelCap').value);
        const playstyle = document.getElementById('playstyle').value;
        const priority = document.getElementById('priority').value;

        this.startingClass = this.dataStore.getClass(classKey);

        const levelError = document.getElementById('levelError');
        if (levelCap < this.startingClass.startingLevel || levelCap > 838) {
            levelError.style.display = 'block';
            levelError.textContent = `Please enter a level between ${this.startingClass.startingLevel} and 838.`;
            return;
        } else {
            levelError.style.display = 'none';
        }

        const startingStats = this.startingClass.stats;
        const finalStats = this.calculator.distributeStats(startingStats, levelCap, playstyle, priority);
        const agility = this.calculator.calculateAgility(finalStats.adaptability, finalStats.attunement);
        const iframes = this.calculator.getIFrames(agility);

        this.displayStartingStats();
        this.displayFinalStats(finalStats);
        this.displayAgilityInfo(agility, iframes);
        this.displayWeapons(finalStats);
        this.displaySpells(finalStats, playstyle);

        document.getElementById('results').style.display = 'grid';
    }

    displayStartingStats() {
        const container = document.getElementById('startingStatsDisplay');
        const stats = this.startingClass.stats;
        let html = `<h4>📋 Starting Class: ${this.startingClass.name} (Level ${this.startingClass.startingLevel})</h4>`;
        for (let stat in stats) {
            html += `<div style="display:flex; justify-content:space-between;"><span>${stat.toUpperCase()}:</span><span>${stats[stat]}</span></div>`;
        }
        container.innerHTML = html;
    }

    displayFinalStats(stats) {
        const container = document.getElementById('statResults');
        container.innerHTML = '';
        for (let stat in stats) {
            const div = document.createElement('div');
            div.className = 'stat-row';
            div.innerHTML = `<span class="stat-name">${stat.toUpperCase()}:</span><span class="stat-value">${stats[stat]}</span>`;
            container.appendChild(div);
        }
    }

    displayAgilityInfo(agility, iframes) {
        const container = document.getElementById('agilityInfo');
        container.innerHTML = `
            <strong>Agility: ${agility}</strong><br>
            <strong>I-Frames: ${iframes}</strong><br>
            ${iframes >= 10 ? '✅ Good roll invincibility' : '⚠️ Consider more Adaptability for better rolls'}
        `;
    }

    displayWeapons(stats) {
        const container = document.getElementById('weaponRecommendations');
        const weapons = this.calculator.recommendWeapons(stats);
        let html = '<h4>🗡️ Recommended Weapons:</h4><div class="weapon-list">';
        for (const weapon of weapons) {
            html += `<div class="weapon-item ${weapon.meetsRequirements ? '' : 'error'}">
                <strong>${weapon.name}</strong> (${weapon.type})<br>
                <span class="scaling">Scaling: ${weapon.scaling}</span><br>
                <span class="requirements">Requirements: STR ${weapon.requirements.strength}, DEX ${weapon.requirements.dexterity}, INT ${weapon.requirements.intelligence}, FTH ${weapon.requirements.faith}</span>
                ${weapon.meetsRequirements ? '' : '<br><span class="error">⚠️ Requirements not met</span>'}
            </div>`;
        }
        html += '</div>';
        container.innerHTML = html;
    }

    displaySpells(stats, playstyle) {
        const container = document.getElementById('spellRecommendations');
        const spells = this.calculator.recommendSpells(stats, playstyle);
        if (!spells.length) {
            container.innerHTML = '<p>This build does not use magic.</p>';
            return;
        }
        let html = '<h4>✨ Recommended Spells:</h4><div class="spell-list">';
        for (const spell of spells) {
            html += `<div class="spell-item ${spell.meetsRequirements ? '' : 'error'}">
                <strong>${spell.name}</strong> (${spell.type})<br>
                <span class="requirements">Requirements: INT ${spell.requirements.intelligence}, FTH ${spell.requirements.faith}</span>
                ${spell.meetsRequirements ? '' : '<br><span class="error">⚠️ Requirements not met</span>'}
            </div>`;
        }
        html += '</div>';
        container.innerHTML = html;
    }
}
