const { episodeStr, formatStr, genreStr, sceneStr, similarityStr, statusStr } = require('./tidbits');

function createResponseText(source, info) {
    const tidbits = [
        episodeStr(source.isMovie, source.episode, info.anilistInfo.episodes),
        sceneStr(source.timestampInSeconds, info.anilistInfo.duration),
        similarityStr(source.similarity),
        formatStr(info.anilistInfo.format),
        statusStr(info.anilistInfo.status),
        genreStr(info.anilistInfo.genres),
    ];
    const tidbitStr = tidbits.join('\n');
    let response = `${info.anilistInfo.title.romaji || source.titleEnglish}\n` + tidbitStr;
    return response;
}

module.exports = { createResponseText };