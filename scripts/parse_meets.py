import csv
import os

def parse_early_bird_csv():
    # Path to the CSV fil
    csv_path = 'meets/37th_Early_Bird_Open_Mens_5000_Meters_HS_Open_5K_24.csv'
    
    meet_info = {}
    team_scores = []
    skyline_runners = []
    
    with open(csv_path, 'r', encoding='utf-8') as file:
        # Read file line by line to get meet info first
        lines = file.readlines()
        meet_info = {
            'name': lines[0].strip(),
            'date': lines[1].strip(),
            'url': lines[2].strip()
        }
        
        # Find where team scores start
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
                if len(parts) >= 3:
                    team_scores.append({
                        'place': parts[0],
                        'team': parts[1],
                        'score': parts[2]
                    })
                current_line += 1
        
        # Parse individual results for Skyline runners
        if results_start:
            current_line = results_start
            while current_line < len(lines):
                line = lines[current_line].strip()
                if not line:
                    break
                parts = line.split(',')
                if len(parts) >= 8 and 'Ann Arbor Skyline' in line:
                    skyline_runners.append({
                        'place': parts[0].replace('.', ''),
                        'grade': parts[1],
                        'name': parts[2],
                        'time': parts[4],
                        'team': parts[5]
                    })
                current_line += 1

    # Generate HTML
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
            <p class="meet-url">Source: <a href="{meet_info['url']}" target="_blank">Athletic.net</a></p>
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
                        <tr>
                            <td>{team['place']}</td>
                            <td>{team['team']}</td>
                            <td>{team['score']}</td>
                        </tr>""" for team in team_scores)}
                    </tbody>
                </table>
            </div>
        </section>

        <section class="skyline-results">
            <h2>Skyline Results</h2>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>Name</th>
                            <th>Grade</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {''.join(f"""
                        <tr>
                            <td>{runner['place']}</td>
                            <td>{runner['name']}</td>
                            <td>{runner['grade']}</td>
                            <td>{runner['time']}</td>
                        </tr>""" for runner in skyline_runners)}
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Cross Country Results</p>
    </footer>
</body>
</html>
"""

    # Create meets directory if it doesn't exist
    os.makedirs('meets', exist_ok=True)
    
    # Write the HTML file
    with open('meets/early-bird.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == "__main__":
    parse_early_bird_csv()
