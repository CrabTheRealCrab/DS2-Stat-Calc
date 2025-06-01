<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dark Souls II Stat Calculator</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #2c1810, #1a0f08);
            color: #e8d5b7;
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            border: 2px solid #8b4513;
        }
        h1 {
            text-align: center;
            color: #ffd700;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .input-section {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(139, 69, 19, 0.2);
            border-radius: 10px;
            border: 1px solid #8b4513;
        }
        .input-group {
            display: flex;
            flex-direction: column;
        }
        label {
            font-weight: bold;
            margin-bottom: 8px;
            color: #ffd700;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }
        input, select {
            padding: 10px;
            border: 2px solid #8b4513;
            border-radius: 5px;
            background: rgba(40, 20, 10, 0.9);
            color: #e8d5b7;
            font-size: 16px;
        }
        button {
            padding: 12px 25px;
            background: linear-gradient(45deg, #8b4513, #a0522d);
            color: #ffd700;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }
        button:hover {
            background: linear-gradient(45deg, #a0522d, #cd853f);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .results-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 30px;
        }
        .stat-distribution, .recommendations {
            background: rgba(139, 69, 19, 0.1);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #8b4513;
        }
        .starting-stats {
            background: rgba(255, 215, 0, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #ffd700;
        }
        .stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(139, 69, 19, 0.3);
        }
        .stat-name {
            font-weight: bold;
            color: #ffd700;
        }
        .stat-value {
            font-size: 18px;
            font-weight: bold;
            color: #e8d5b7;
        }
        .agility-info {
            background: rgba(255, 215, 0, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #ffd700;
        }
        .recommendations h3 {
            color: #ffd700;
            border-bottom: 2px solid #8b4513;
            padding-bottom: 10px;
        }
        .weapon-list, .spell-list {
            margin: 15px 0;
        }
        .weapon-item, .spell-item {
            background: rgba(40, 20, 10, 0.5);
            padding: 10px;
            margin: 8px 0;
            border-radius: 5px;
            border-left: 3px solid #8b4513;
        }
        .scaling {
            font-weight: bold;
            color: #90ee90;
        }
        .requirements {
            color: #ffa500;
            font-size: 0.9em;
        }
        .error {
            color: #ff6b6b;
            background: rgba(255, 107, 107, 0.1);
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        @media (max-width: 1200px) {
            .input-section {
                grid-template-columns: 1fr 1fr;
            }
        }
        @media (max-width: 768px) {
            .input-section {
                grid-template-columns: 1fr;
            }
            .results-section {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚔️ Dark Souls II Stat Calculator ⚔️</h1>
        <div class="input-section">
            <div class="input-group">
                <label for="startingClass">Starting Class:</label>
                <select id="startingClass"></select>
            </div>
            <div class="input-group">
                <label for="levelCap">Target Level:</label>
                <input type="number" id="levelCap" value="150" min="1" max="838">
                <div id="levelError" class="error" style="display: none; margin-top: 6px;"></div>
            </div>
            <div class="input-group">
                <label for="playstyle">Primary Playstyle:</label>
                <select id="playstyle">
                    <option value="barbarian">Barbarian (STR Focus)</option>
                    <option value="swordsman">Swordsman (DEX Focus)</option>
                    <option value="knight">Knight (STR/DEX Quality)</option>
                    <option value="defender">Defender (Tank Build)</option>
                    <option value="priest">Priest (Faith Caster)</option>
                    <option value="mage">Mage (Intelligence Caster)</option>
                    <option value="hexer">Hexer (INT/Faith Caster)</option>
                    <option value="magic_swordsman">Magic Swordsman (INT/DEX)</option>
                    <option value="mage_barbarian">Mage Barbarian (INT/STR)</option>
                    <option value="paladin">Paladin (Faith/STR)</option>
                    <option value="faith_dex">Faith Dexterity Hybrid</option>
                    <option value="hexer_physical">Hexer Physical Hybrid</option>
                    <option value="pyromancer">Pyromancer (INT/Faith Equal)</option>
                    <option value="pyro_physical">Pyromancer Physical Hybrid</option>
                </select>
            </div>
            <div class="input-group">
                <label for="priority">Secondary Priority:</label>
                <select id="priority">
                    <option value="survivability">Survivability</option>
                    <option value="evasion">Evasion</option>
                    <option value="damage">Damage</option>
                    <option value="versatility">Versatility</option>
                </select>
            </div>
        </div>
        <div id="results" class="results-section" style="display: none;">
            <div class="stat-distribution">
                <h3>📊 Stat Distribution</h3>
                <div id="startingStatsDisplay" class="starting-stats"></div>
                <div id="statResults"></div>
                <div id="agilityInfo" class="agility-info"></div>
            </div>
            <div class="recommendations">
                <h3>⚡ Recommendations</h3>
                <div id="weaponRecommendations"></div>
                <div id="spellRecommendations"></div>
            </div>
        </div>
    </div>
    <script type="module">
        import { DataStore } from './Datastore.js';
        import { Calculator } from './Calculation.js';
        import { UIManager } from './UIManager.js';

        const dataStore = new DataStore();
        const calculator = new Calculator(dataStore);
        const uiManager = new UIManager(calculator, dataStore);

        window.addEventListener('DOMContentLoaded', () => uiManager.init());
    </script>
</body>
</html>
