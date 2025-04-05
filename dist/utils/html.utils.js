"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromHtml = extractTextFromHtml;
function extractTextFromHtml(html) {
    return html.replace(/<[^>]*>/g, "").trim();
}
