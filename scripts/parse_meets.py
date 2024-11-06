import csv
import os
from pathlib import Path

def parse_meet_csv(csv_path):
    """Parse a single meet CSV file"""
    meet_info = {}
    team_scores = []
    all_runners = []
    summary = ""
    
    with open(csv_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
        meet_info = {
            'name': lines[0].strip(),
            'date': lines[1].strip(),
            'url': lines[2].strip(),
            'summary': lines[3].strip()
        }
        
        # Find data sections
        for i, line in enumerate(lines):
            if 'Place,Team,Score' in line:
                team_scores_start = i + 1
            if 'Place,Grade,Name,Athlete Link' in line:
                results_start = i + 1
                break
        
        # Parse team scores
        current_line = team_scores_start
        while current_line < len(lines):
            line = lines[current_line].strip()
            if not line or 'Place,Grade,Name' in line:
                break
            parts = line.split(',')
            if len(parts) >= 3 and parts[0].strip() and parts[0][0].isdigit():
                team_scores.append({
                    'place': parts[0],
                    'team': parts[1],
                    'score': parts[2]
                })
            current_line += 1
        
        # Parse top 10 runners
        for i, line in enumerate(lines[results_start:results_start+10]):
            if not line.strip():
                break
            parts = line.split(',')
            if len(parts) >= 8:
                all_runners.append({
                    'place': parts[0].replace('.', ''),
                    'grade': parts[1],
                    'name': parts[2],
                    'time': parts[4],
                    'team': parts[5]
                })
    
    return meet_info, team_scores, all_runners

def generate_html(meet_info, team_scores, runners, output_path):
    """Generate HTML file for a meet"""
    winner = runners[0] if runners else {'name': 'N/A', 'time': 'N/A', 'team': 'N/A'}
    
    html = f"""<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{meet_info['name']}</title>
        <link rel="stylesheet" href="../css/styles.css">  
        <meta name="description" content="Results for {meet_info['name']}">
    </head>
    <!-- ... header section ... -->
    <header class="header fade-in">
        <h1>{meet_info['name']}</h1>
        <nav class="nav" role="navigation" aria-label="Main navigation">
            <a href="../index.html">Home</a>
            <a href="early-bird.html">Early Bird</a>
            <a href="bath.html">Bath Invitational</a>
            <a href="holly.html">Holly Festival</a>
            <a href="jackson.html">Jackson Invitational</a>
        </nav>
    </header>

    <main class="meet-content">
        <!-- Meet Overview Section -->
        <section class="meet-overview collapsible active slide-in">
            <div class="collapsible-header">
                <h2>Meet Overview</h2>
            </div>
            <div class="collapsible-content">
                <div class="meet-card">
                    <p class="meet-date">{meet_info['date']}</p>
                    <div class="winner-card fade-in">
                        <h3>🏆 Winner</h3>
                        <p class="winner-name">{winner['name']}</p>
                        <p class="winner-time">{winner['time']}</p>
                        <p class="winner-team">{winner['team']}</p>
                    </div>
                    <div class="meet-summary">
                        <p>{meet_info['summary']}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Team Scores Section -->
        <section class="collapsible" id="team-scores-section">
            <div class="collapsible-header" tabindex="0" role="button" aria-expanded="true" aria-controls="team-scores-content">
                <h2>Team Scores</h2>
            </div>
            <div id="team-scores-content" class="collapsible-content">
                <div class="table-scroll-container">
                    <table role="table" aria-label="Team Scores">
                        <thead>
                            <tr>
                                <th scope="col" class="sticky-header">Place</th>
                                <th scope="col" class="sticky-header">Team</th>
                                <th scope="col" class="sticky-header">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {''.join(f"""
                            <tr class="{'highlight-row' if team['place'] == '1' else ''}">
                                <td>{team['place']}</td>
                                <td>{team['team']}</td>
                                <td>{team['score']}</td>
                            </tr>""" for team in team_scores)}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        
        <!-- Top Performers Section -->
        <section class="collapsible" id="top-performers-section">
            <div class="collapsible-header" tabindex="0" role="button" aria-expanded="true" aria-controls="top-performers-content">
                <h2>Top 10 Finishers</h2>
            </div>
            <div id="top-performers-content" class="collapsible-content">
                <div class="table-scroll-container">
                    <table role="table" aria-label="Top 10 Finishers">
                        <thead>
                            <tr>
                                <th scope="col" class="sticky-header">Place</th>
                                <th scope="col" class="sticky-header">Name</th>
                                <th scope="col" class="sticky-header">Grade</th>
                                <th scope="col" class="sticky-header">Time</th>
                                <th scope="col" class="sticky-header">Team</th>
                            </tr>
                        </thead>
                        <tbody>
                            {''.join(f"""
                            <tr class="{'highlight-row' if runner['place'] == '1' else ''}">
                                <td>{runner['place']}</td>
                                <td>{runner['name']}</td>
                                <td>{runner['grade']}</td>
                                <td>{runner['time']}</td>
                                <td>{runner['team']}</td>
                            </tr>""" for runner in runners)}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </main>

    <!-- Theme Toggle Button -->
    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
        🌙
    </button>

    <footer>
        <p>Data source: <a href="{meet_info['url']}" target="_blank">Athletic.net</a></p>
    </footer>

    <script src="../js/meet-scripts.js"></script>
</body>
</html>
"""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

def main():
    # Create necessary directories
    Path('meets').mkdir(exist_ok=True)
    
    # Process each meet
    meets = [
        {'csv': 'meets/37th_Early_Bird_Open_Mens_5000_Meters_HS_Open_5K_24.csv',
         'output': 'meets/early-bird.html'},
        {'csv': 'meets/Bret_Clements_Bath_Invitational_Mens_5000_Meters_Class_1_24.csv',
         'output': 'meets/bath.html'},
        {'csv': 'meets/56th_Holly-Duane_Raffin_Festival_of_Races_Mens_5000_Meters_D1_Boys_24.csv',
         'output': 'meets/holly.html'},
        {'csv': 'meets/Jackson_Invitational_Mens_5000_Meters_Orange_Division_(1000_+_enrolment)_24.csv',
         'output': 'meets/jackson.html'}
    ]
    
    for meet in meets:
        try:
            print(f"Processing {meet['csv']}...")
            meet_info, team_scores, runners = parse_meet_csv(meet['csv'])
            generate_html(meet_info, team_scores, runners, meet['output'])
            print(f"Generated {meet['output']}")
        except Exception as e:
            print(f"Error processing {meet['csv']}: {str(e)}")

if __name__ == "__main__":
    main()
