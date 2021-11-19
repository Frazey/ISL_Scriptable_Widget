// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: futbol;
const widgetParameter = args.widgetParameter ? args.widgetParameter.toUpperCase() : "KBFC"
widgetSettings = {
    teamList: ["ATKMB", "BFC", "CFC", "FCG", "HFC", "JFC", "KBFC", "MCFC", "NEUFC", "OFC", "SCEB"],
    teamName: widgetParameter,
    
    //Customize Below:
    dateStyle: "date", // Date Style: "countdown" or "date" (date = Novemeber 19, 2021 and countdown = 7 days, 4 hrs)
    updateAfter: 15, // Update widget after 15 minutes at end of match (to get more time to see score before showing next match details)
    //-----------------//

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
    let matchDate = new Date(matches[0].start_date)
    let matchEndDate = new Date(matches[0].end_date)
    let homeTeam = matches[0].participants[0].short_name
    let homeTeamId = matches[0].participants[0].id
    let homeTeamScore = matches[0].participants[0].value
    let awayTeam = matches[0].participants[1].short_name
    let awayTeamId = matches[0].participants[1].id
    let awayTeamScore = matches[0].participants[1].value

    let paddingLeft = 0;
    let paddingRight = 0;
    let paddingTop = 12;
    let paddingBottom = 12;

    let widget = new ListWidget();
    widget.backgroundColor = Color.dynamic(new Color(widgetSettings.backgroundColor.light), new Color(widgetSettings.backgroundColor.dark));
    widget.setPadding(paddingTop, paddingLeft, paddingBottom, paddingRight);

    const stack = widget.addStack();
    const leagueStack = stack.addStack();
    leagueStack.layoutVertically()
    leagueStack.addSpacer();

    const leagueTitleStack = leagueStack.addStack();
    leagueTitleStack.addSpacer();
    addFormattedText(leagueTitleStack, "INDIAN SUPER LEAGUE", Font.semiboldSystemFont(11), Color.dynamic(new Color(widgetSettings.leagueTitleColor.light), new Color(widgetSettings.leagueTitleColor.dark)), 1, false);
    leagueTitleStack.addSpacer()
    leagueStack.addSpacer(14);


    let topStack = leagueStack.addStack()
    topStack.centerAlignContent()
    topStack.layoutHorizontally()
    topStack.addSpacer()

    let logoLeftStack = topStack.addStack()
    let teamBadgeUrlLeft = encodeURI(`https://www.indiansuperleague.com/static-resources/images/clubs/small/${homeTeamId}.png`);
    let teamBadgeOfflineLeft = homeTeam;
    let teamBadgeValueLeft = await getImage(teamBadgeUrlLeft, teamBadgeOfflineLeft);
    let teamBadgeImageLeft = logoLeftStack.addImage(teamBadgeValueLeft);
    teamBadgeImageLeft.imageSize = new Size(48, 48);
    topStack.addSpacer()

    let vsStack = topStack.addStack()
    let vsText = vsStack.addText('vs')
    vsText.font = Font.regularSystemFont(18)
    topStack.addSpacer()
    
    let logoRightStack = topStack.addStack()
    let teamBadgeUrlRight = encodeURI(`https://www.indiansuperleague.com/static-resources/images/clubs/small/${awayTeamId}.png`);
    let teamBadgeOfflineRight = awayTeam;
    let teamBadgeValueRight = await getImage(teamBadgeUrlRight, teamBadgeOfflineRight);
    let teamBadgeImageRight = logoRightStack.addImage(teamBadgeValueRight);
    teamBadgeImageRight.imageSize = new Size(48, 48);
    topStack.addSpacer()
    leagueStack.addSpacer(2)
    

    let midStack = leagueStack.addStack()
    midStack.centerAlignContent()
    midStack.layoutHorizontally()
    midStack.addSpacer()

    let scoreStackLeft = midStack.addStack()
    let scoreTextLeft = scoreStackLeft.addText(`${homeTeamScore}`)
    scoreTextLeft.font = Font.semiboldSystemFont(28)
    midStack.addSpacer()

    let midBlankStack = midStack.addStack()
    midBlankStack.addSpacer(4)
    let midText = midBlankStack.addText("  ")
    midText.font = Font.regularSystemFont(18)
    midBlankStack.addSpacer(4)
    midStack.addSpacer()

    let scoreStackRight = midStack.addStack()
    let scoreTextRight = scoreStackRight.addText(`${awayTeamScore}`)
    scoreTextRight.font = Font.semiboldSystemFont(28)
    midStack.addSpacer()
    leagueStack.addSpacer(2)


    const dateStack = leagueStack.addStack();
    dateStack.centerAlignContent();
    dateStack.addSpacer();

    if(matches[0].event_status == "Yet to begin"){
        let dateText = dateStack.addDate(matchDate)
        dateText.font = Font.semiboldSystemFont(9)
        dateText.centerAlignText()
        if (widgetSettings.dateStyle == "date"){
            dateText.applyDateStyle()
        }else{
            dateText.applyRelativeStyle()
        }
    }else if(matches[0].event_status == "Match Completed"){
        addFormattedText(dateStack, "Match Completed", Font.regularSystemFont(9), null, 1, false);
    }else{
        let dateText = dateStack.addDate(matchDate)
        dateText.font = Font.semiboldSystemFont(9)
        dateText.centerAlignText()
        dateText.applyRelativeStyle()
    }
    dateStack.addSpacer()
    leagueStack.addSpacer();


    return widget
}


async function getMatches(){
    let matches, matchesJson
    let currentTime = new Date()
    currentTime.setMinutes(currentTime.getMinutes() - widgetSettings.updateAfter)
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
        matches = matches.filter(a => new Date(a.end_date) >= currentTime);
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