// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: futbol;
const teamJson = {"ATKMB": "ATK MOHUN BAGAN", "BFC": "BENGALURU FC", "CFC": "CHENNAIYIN FC", "FCG": "FC GOA", "HFC": "HYDERABAD FC", "JFC": "JAMSHEDPUR FC", "KBFC": "KERALA BLASTERS FC", "MCFC": "MUMBAI CITY FC", "NEUFC": "NORTHEAST UNITED FC", "OFC": "ODISHA FC", "SCEB": "SC EAST BENGAL"}
const widgetParameter = args.widgetParameter ? args.widgetParameter.toUpperCase() : "KBFC"
widgetSettings = {
    teamList: ["ATKMB", "BFC", "CFC", "FCG", "HFC", "JFC", "KBFC", "MCFC", "NEUFC", "OFC", "SCEB"],
    teamFullName: teamJson[widgetParameter],

    //Customise Below:
    teamName: widgetParameter, // Customise in widget Parameter
    dateStyle: "date", // Date Style: "countdown" or "date"
    updateAfter: 24, // Update widget after 24 hours after end of match (to get more time to see score before showing next match details)
    //------------------//

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
        dark: "#2d2d2e"
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
    const matches = await getMatches()
    let date = new Date()

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
    leagueTitleStack.addSpacer()
    leagueTitleStack.centerAlignContent()
    leagueTitleStack.addSpacer(2);
    addFormattedText(leagueTitleStack, widgetSettings.teamFullName, Font.semiboldSystemFont(11), Color.dynamic(new Color(widgetSettings.leagueTitleColor.light), new Color(widgetSettings.leagueTitleColor.dark)), 1, false);
    leagueTitleStack.addSpacer()
    leagueStack.addSpacer(3);
    
    const hSpacing = 28;
    const vSpacing = 28;
    const leagueTableStack = leagueStack.addStack();
    leagueTableStack.layoutVertically();


    for (let i = 0; i < 3; i += 1) {
        let leagueTableRowStack = leagueTableStack.addStack();
        leagueTableRowStack.addSpacer()
        let leagueDateStack = leagueTableStack.addStack();
        leagueDateStack.addSpacer()
        let matchDate = new Date(matches[i].start_date)

        for (let j = 0; j < 3; j += 1) {
            let cellDataStack = leagueTableRowStack.addStack();
            
            if(j == 0) {
                cellDataStack.size = new Size(26, vSpacing);
                cellDataStack.centerAlignContent();
                let teamBadgeUrl = encodeURI(`https://www.indiansuperleague.com/static-resources/images/clubs/small/${matches[i].participants[0].id}.png`);
                let teamBadgeOffline = matches[i].participants[0].short_name;
                let teamBadgeValue = await getImage(teamBadgeUrl, teamBadgeOffline);
                let teamBadgeImage = cellDataStack.addImage(teamBadgeValue);
                teamBadgeImage.imageSize = new Size(24, 24);
            }else if(j == 1){
                cellDataStack.size = new Size(42, vSpacing);
                cellDataStack.centerAlignContent();
                let cellDataValue = `${matches[i].participants[0].value} - ${matches[i].participants[1].value}`;
                addFormattedText(cellDataStack, cellDataValue, Font.semiboldSystemFont(18), null, 1, true);
            }else if(j == 2){
                cellDataStack.size = new Size(hSpacing, vSpacing);
                cellDataStack.centerAlignContent();
                let teamBadgeUrl = encodeURI(`https://www.indiansuperleague.com/static-resources/images/clubs/small/${matches[i].participants[1].id}.png`);
                let teamBadgeOffline = matches[i].participants[1].short_name;
                let teamBadgeValue = await getImage(teamBadgeUrl, teamBadgeOffline);
                let teamBadgeImage = cellDataStack.addImage(teamBadgeValue);
                teamBadgeImage.imageSize = new Size(24, 24);
            }
            leagueTableRowStack.addSpacer()
      }
      leagueDateStack.centerAlignContent();
      if(matches[i].event_status.toLowerCase() == "yet to begin"){ 
          if (widgetSettings.dateStyle == "date"){
            let dateFormatter = new DateFormatter()
            dateFormatter.dateFormat = "E, d MMM, h:m a"
            let matchDateStr = dateFormatter.string(matchDate)
            addFormattedText(leagueDateStack, matchDateStr, Font.semiboldSystemFont(8), null, 2, true);
          }else{
            let dateText = leagueDateStack.addDate(matchDate)
            dateText.font = Font.semiboldSystemFont(9)
            dateText.centerAlignText()
            dateText.applyRelativeStyle()
          }
      }else if(matches[i].event_status.toLowerCase() == "match completed"){
          addFormattedText(leagueDateStack, "Match Completed", Font.semiboldSystemFont(9), null, 1, false);
      }else{
          addFormattedText(leagueDateStack, `${matches[i].event_status} | ${matches[i].event_sub_status}`, Font.semiboldSystemFont(9), null, 1, false);
      }
      
      leagueDateStack.addSpacer()
      leagueTableStack.addSpacer(3)
    }
    return widget
}

async function getMatches(){
    let matches, matchesJson
    let currentTime = new Date()
    currentTime.setHours(currentTime.getHours() - widgetSettings.updateAfter)
    let fileName = "isl_full_matches.json"
    let url = "https://www.indiansuperleague.com/feeds-schedule/?methodtype=3&client=8&sport=2&league=0&timezone=0530&language=en&tournament=india_sl_2021"
    try{
        let req = new Request(url);
        matchesJson = await req.loadJSON();
        matches = matchesJson.matches
        fm.writeString(fm.joinPath(offlinePath, fileName), JSON.stringify(matches));
    }catch (err){
        matches = JSON.parse(fm.readString(fm.joinPath(offlinePath, fileName)));
    }finally{
        matches = matches.filter(a => (a.participants[0].short_name == widgetSettings.teamName || a.participants[1].short_name == widgetSettings.teamName) && new Date(a.end_date) >= currentTime);
        return matches;
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