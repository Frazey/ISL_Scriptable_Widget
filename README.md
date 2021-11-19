![isl_widget_banner](https://user-images.githubusercontent.com/43070628/141449225-705fad27-b8b0-4cb0-a0af-376e51093367.jpg)


# Indian Super League WIdget for Scriptable iOS
ISL widget for [Scriptable](https://scriptable.app) using [ISL](https://www.indiansuperleague.com) API data.

Includes 3 types of widget:
* Standings Table
     Widget shows ISL standing with details (matches, win, loss, draw, points).
* Next Match
     Widget shows next ISL match with live score updates.
* Next Matches of team
     Widget Shows next 3 matches of your favourite team with live score updates.

## Widget Setup & Customization

### Installation:
Click below links to directly install scripts on Scriptable app

* [Click Here](https://frazey.github.io/ISL_Scriptable_Widget/installations/ISL_Standings.scriptable) to download ISL Standings widget.

* [Click Here](https://frazey.github.io/ISL_Scriptable_Widget/installations/ISL_Next_Match.scriptable) to download ISL Next Match widget.

* [Click Here](https://frazey.github.io/ISL_Scriptable_Widget/installations/ISL_Team_Matches.scriptable) to download ISL Next Matches of Team widget.

### Scriptable guide:
* Install [Scriptable app](https://apps.apple.com/in/app/scriptable/id1405459188) from appstore.
* Open Scriptable and add script to Scriptable app. (Or install directly using above link in Installation)
* Add new Scriptable widget (small size) to home screen.
* Click on widget that you added and select script.
* Read below for more details (for customization).

### Team Short Names:
| `Team Name`             | `Team Short Name` |
| ------------------------| ------------------|
| `ATK Mohun Bagan`       | `ATKMB`           |
| `Bengaluru FC`          | `BFC`             |
| `Chennaiyin FC`         | `CFC`             |
| `FC Goa`                | `FCG`             |
| `Hyderabad FC`          | `HFC`             |
| `Jamshedpur FC`         | `JFC`             |
| `Kerala Blasters FC`    | `KBFC`            |
| `Mumbai City FC`        | `MCFC`            |
| `NorthEast United FC`   | `NEUFC`           |
| `Odisha FC`             | `OFC`             |
| `SC East Bengal`        | `SCEB`            |

### Standings Table Widget:
<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/43070628/141271376-9f7e6c9f-42a8-4e46-b86d-2ac5e2a3ebb6.jpg" width=360>

Install: [Click Here](https://frazey.github.io/ISL_Scriptable_Widget/installations/ISL_Standings.scriptable)
Widget Size: Small
Detail: Widget shows Top 5 standings table of Indian Super League with details such as matches played, wins, loss, draw, points.
#### Customize:
* Set Team (set your favourite team in widget):
    * Tap and Hold on widget and click edit.
    * Type Team short name in parameter field (refer above table for short names).
* Highlight Team (highlight set team in tabel):
    * On script line 9, `highlight: true`: `true` will highlight your team, `false` will not highlight team.
* Expand Widget (show your team even they are not in top 5):
    * On script line 8, `expand: true`: `true` will show your team name in 5th place if team in not in top 5, `false` will just show top 5 always.

[Table Widget Design Credit](https://github.com/thejosejorge/futcal-for-scriptable)


### Upcoming Team Matches Widget:
<img src="https://user-images.githubusercontent.com/43070628/141447040-e8b7732f-e2bb-420e-9b64-1e0d5baee972.jpg" width=360>

Install: [Click Here](https://frazey.github.io/ISL_Scriptable_Widget/installations/ISL_Team_Matches.scriptable)
Widget Size: Small
Detail: Widget shows next 3 matches of the team you set and live update of score.
#### Customize:
* Set Team (set your favourite team in widget):
    * Tap and Hold on widget and click edit.
    * Type Team short name in parameter field (refer above table for short names).
* Highlight Team (highlight set team in tabel):
    * On script line 11, `dateStyle: countdown`: `countdown` will show how much days and hours until match (eg: 2 days, 8 hrs or 5 hrs, 45 mins), `date` will show date of the match (eg: November 19, 2021).

### Upcoming Match Widget:
<img src="https://user-images.githubusercontent.com/43070628/141447034-238fbf1e-76f5-4d1d-8c7d-568ee3b7c97d.jpg" width=360>

Install: [Click Here](https://frazey.github.io/ISL_Scriptable_Widget/installations/ISL_Next_Match.scriptable)
Widget Size: Small
Detail: Widget shows next ISL match with live score updates.

#### Customize:
* Highlight Team (highlight set team in tabel):
    * On script line 11, `dateStyle: countdown`: `countdown` will show how much days and hours until match (eg: 2 days, 8 hrs or 5 hrs, 45 mins), `date` will show date of the match (eg: November 19, 2021).
