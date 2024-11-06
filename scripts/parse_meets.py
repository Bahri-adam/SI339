import csv
import os
from pathlib import Path

def ensure_dir_exists(dir_path):
    """Create directory if it doesn't exist"""
    Path(dir_path).mkdir(parents=True, exist_ok=True)

def parse_meet_csv(csv_path):
    """Parse a single meet CSV file"""
    meet_info = {}
    team_scores = []
    top_runners = []
    summary = ""
    
    with open(csv_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
        meet_info = {
            'name': lines[0].strip(),
            'date': lines[1].strip(),
            'url': lines[2].strip()
        }
        
        # Get summary
        summary = lines[3].strip()
        
        # Find data sections
        team_scores_start = None
        results_start = None
        
        for i, line in enumerate(lines):
            if 'Place,Team,Score' in line:
                team_scores_start = i + 1
            if 'Place,Grade,Name,Athlete Link' in line:
                results_start = i + 1
                break
        
        # Parse team scores
        if team_scores_start:
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
        if results_start:
            count = 0
            for line in lines[results_start:]:
                if not line.strip() or count >= 10:
                    break
                parts = line.split(',')
                if len(parts) >= 8:
                    top_runners.append({
                        'place': parts[0].replace('.', ''),
                        'grade': parts[1],
                        'name': parts[2],
                        'time': parts[4],
                        'team': parts[5]
                    })
                    count += 1
    
    # Get winning team info
    winning_team = team_scores[0] if team_scores else None
    # Get top performer
    top_performer = top_runners[0] if top_runners else None
    
    return meet_info, team_scores, top_runners, summary, winning_team, top_performer

def generate_html(meet_info, team_scores, top_runners, summary, winning_team, top_performer, output_path, html_filename):
    """Generate HTML file for a meet"""
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{meet_info['name']}</title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
    <header class="header">
        <h1>{meet_info['name']}</h1>
        <nav class="nav">
            <a href="../index.html">Home</a>
        </nav>
    </header>

    <main class="meet-content">
        <section class="meet-info">
            <h2>Meet Information</h2>
            <p class="meet-date">{meet_info['date']}</p>
            
            <div class="meet-highlights">
                <h3>Meet Highlights</h3>
                <div class="highlight-card winning-team">
                    <h4>🏆 Winning Team</h4>
                    <p class="team-name">{winning_team['team']}</p>
                    <p class="team-score">Score: {winning_team['score']}</p>
                </div>
                <div class="highlight-card top-performer">
                    <h4>🥇 Top Performer</h4>
                    <p class="athlete-name">{top_performer['name']}</p>
                    <p class="athlete-details">
                        Grade: {top_performer['grade']} | Time: {top_performer['time']}
                    </p>
                    <p class="athlete-team">{top_performer['team']}</p>
                </div>
            </div>

            <div class="meet-summary">
                <h3>Meet Summary</h3>
                <p>{summary}</p>
            </div>
        </section>

        <section class="team-scores">
            <h2>Team Scores</h2>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>Team</th>
                            <th>Score</th>
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
        </section>

        <section class="top-performers">
            <h2>Top 10 Finishers</h2>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>Name</th>
                            <th>Grade</th>
                            <th>Time</th>
                            <th>Team</th>
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
                        </tr>""" for runner in top_runners)}
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <footer>
        <p>Data source: <a href="{meet_info['url']}" target="_blank">Athletic.net</a></p>
    </footer>
</body>
</html>
"""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

def main():
    # Ensure directories exist
    ensure_dir_exists('meets')
    
    # Define meet files and their output HTML names
    meets = [
        {
            'csv': 'meets/37th_Early_Bird_Open_Mens_5000_Meters_HS_Open_5K_24.csv',
            'html': 'early-bird.html'
        },
        {
            'csv': 'meets/Bret_Clements_Bath_Invitational_Mens_5000_Meters_Class_1_24.csv',
            'html': 'bath.html'
        },
        {
            'csv': 'meets/56th_Holly-Duane_Raffin_Festival_of_Races_Mens_5000_Meters_D1_Boys_24.csv',
            'html': 'holly.html'
        }
    ]
    
    # Process each meet
    for meet in meets:
        if os.path.exists(meet['csv']):
            try:
                print(f"Processing {meet['csv']}...")
                meet_info, team_scores, top_runners, summary, winning_team, top_performer = parse_meet_csv(meet['csv'])
                output_path = os.path.join('meets', meet['html'])
                generate_html(
                    meet_info, team_scores, top_runners, summary,
                    winning_team, top_performer, output_path, meet['html']
                )
                print(f"Generated {meet['html']}")
            except Exception as e:
                print(f"Error processing {meet['csv']}: {str(e)}")
        else:
            print(f"Warning: {meet['csv']} not found")

if __name__ == "__main__":
    main()
