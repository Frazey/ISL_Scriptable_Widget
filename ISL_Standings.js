// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: futbol;
const widgetParameter = args.widgetParameter ? args.widgetParameter.toUpperCase() : "KBFC"
widgetSettings = {
    teamList: ["ATKMB", "BFC", "CFC", "FCG", "HFC", "JFC", "KBFC", "MCFC", "NEUFC", "OFC", "SCEB"],
    teamName: widgetParameter.toUpperCase(),// Set Team in widget parameter

    //Customize below:
    expand: true, // true, to show set team even if they are below place 6. else false
    highlight: true, // true, to hightlight set team. else false
    //---------------//
    
    placeholderImage: "default.png",

    backgroundColor: {
        light: "#ffffff",
        dark: "#141414"
    },
    leagueTitleColor: {
        light: "#d6001c",
        dark: "#d6001c"
    },
    highlightedRowColor: {
        light: "#e5e6ea",
        dark: "#1f1f1f"
    }
}

let fm = FileManager.local();
const iCloudUsed = fm.isFileStoredIniCloud(module.filename);
fm = iCloudUsed ? FileManager.iCloud() : fm;
const widgetFolder = "IndianSuperLeague";
const offlinePath = fm.joinPath(fm.documentsDirectory(), widgetFolder);
if (!fm.fileExists(offlinePath)) fm.createDirectory(offlinePath);


if (config.runsInWidget) {
    let widget = await createWidget();
    Script.setWidget(widget);
    Script.complete();
} else {
    let widget = await createWidget();
    Script.complete();
    await widget.presentSmall();
}

async function createWidget() {
    const islStandings = await getIslStandings();
    let teamNameIndex = islStandings.findIndex(obj => obj.team_short_name == widgetSettings.teamName);
    if (widgetSettings.highlight){
        islStandings[teamNameIndex]["highlight"] = true
    }
    
    if (widgetSettings.expand && teamNameIndex >= 6){
        Array.prototype.swapItems = function(a, b){
        this[a] = this.splice(b, 1, this[a])[0];
        return this;
        }
        islStandings.swapItems(5, teamNameIndex)[5];
    }
    
    let paddingLeft = 0;
    let paddingRight = 0;
    let paddingTop = 2;
    let paddingBottom = 2;

    let widget = new ListWidget();
    widget.backgroundColor = Color.dynamic(new Color(widgetSettings.backgroundColor.light), new Color(widgetSettings.backgroundColor.dark));
    widget.setPadding(paddingTop, paddingLeft, paddingBottom, paddingRight);

    const stack = widget.addStack();
    const leagueStack = stack.addStack();
    leagueStack.layoutVertically();
    leagueStack.addSpacer(2.5);

    const leagueTitleStack = leagueStack.addStack();
    leagueTitleStack.addSpacer(4);
    addFormattedText(leagueTitleStack, "INDIAN SUPER LEAGUE", Font.semiboldSystemFont(10.5), Color.dynamic(new Color(widgetSettings.leagueTitleColor.light), new Color(widgetSettings.leagueTitleColor.dark)), 1, false);
    leagueStack.addSpacer(1);
    
    const hSpacing = 17;
    const vSpacing = 18.4;
    const leagueTableStack = leagueStack.addStack();
    leagueTableStack.layoutVertically();


    for (let i = 0; i < 6; i += 1) {
        let leagueTableRowStack = leagueTableStack.addStack();
        leagueTableRowStack.spacing = 2;
        if (widgetSettings.highlight && islStandings[i].highlight){
            leagueTableRowStack.backgroundColor = Color.dynamic(new Color(widgetSettings.highlightedRowColor.light), new Color(widgetSettings.highlightedRowColor.dark));
            leagueTableRowStack.cornerRadius = 4
        }
        for (let j = 0; j < 7; j += 1) {

            let cellDataStack = leagueTableRowStack.addStack();
            cellDataStack.size = new Size(hSpacing, vSpacing);
            cellDataStack.centerAlignContent();
            
            if(j == 0) {
                let cellDataValue = islStandings[i].position;
                addFormattedText(cellDataStack, cellDataValue, Font.semiboldSystemFont(10), null, null, true);
            }else if(j == 1) {
                if (i == 0){
                    let cellDataValue = 'T'
                    addFormattedText(cellDataStack, cellDataValue, Font.semiboldSystemFont(10), null, null, true);
                }else {
                    let teamBadgeUrl = encodeURI(`https://www.indiansuperleague.com/static-resources/images/clubs/small/${islStandings[i].team_id}.png`);
                    let teamBadgeOffline = islStandings[i].team_short_name;
                    let teamBadgeValue = await getImage(teamBadgeUrl, teamBadgeOffline);
                    let teamBadgeImage = cellDataStack.addImage(teamBadgeValue);
                    teamBadgeImage.imageSize = new Size(14, 14);
                }
            }else if(j == 2){
                let cellDataValue = islStandings[i].played;
                addFormattedText(cellDataStack, cellDataValue, Font.semiboldSystemFont(10), null, null, true);
            }else if(j == 3){
                let cellDataValue = islStandings[i].wins;
                addFormattedText(cellDataStack, cellDataValue, Font.semiboldSystemFont(10), null, null, true);
            }else if(j == 4){
                let cellDataValue = islStandings[i].draws;
                addFormattedText(cellDataStack, cellDataValue, Font.semiboldSystemFont(10), null, null, true);
            }else if(j == 5){
                let cellDataValue = islStandings[i].lost;
                addFormattedText(cellDataStack, cellDataValue, Font.semiboldSystemFont(10), null, null, true);
            }else if(j === 6){
                let cellDataValue = islStandings[i].points;
                addFormattedText(cellDataStack, cellDataValue, Font.semiboldSystemFont(10), null, null, true);
            }
      }
    }

    return widget
}


async function getIslStandings(){
    let standings, standingsJson
    let fileName = "isl_standings.json"
    let url = `https://www.indiansuperleague.com/sifeeds/repo/football/live/india_sl/json/259_standings.json`
    try{
        let req = new Request(url);
        standingsJson = await req.loadJSON();
        standings = standingsJson.standings.groups[0].teams.team;

        headersJson = {
            position: "#",
            team_id: "T",
            played: "M",
            wins: "W",
            lost: "L",
            draws: "D",
            points: "P"
        }
        standings.splice(0, 0, headersJson);
        fm.writeString(fm.joinPath(offlinePath, fileName), JSON.stringify(standings));
    }catch (err){
        standings = JSON.parse(fm.readString(fm.joinPath(offlinePath, fileName)));
    }finally{
        return standings;
    }
}


function addFormattedText(stack, string, font, textColor, lineLimit, center) {
    const text = stack.addText(string);
    text.font = font;
    if (lineLimit) text.lineLimit = lineLimit;
    if (textColor) text.textColor = textColor;
    if (center) text.centerAlignText();
}


async function getImage(url, teamName) {
    let image;
    let teamLogoPath = fm.joinPath(offlinePath, teamName);
    if (fm.fileExists(teamLogoPath)){
        if (iCloudUsed) await fm.downloadFileFromiCloud(teamLogoPath);
        image = fm.readImage(teamLogoPath);
    }else{
        try{
            image = await new Request(url).loadImage();
            fm.writeImage(fm.joinPath(offlinePath, teamName), image);

        } catch (err){
            let symbol = SFSymbol.named("shield.fill")
            image = symbol.image
        }
    }
    return image
}