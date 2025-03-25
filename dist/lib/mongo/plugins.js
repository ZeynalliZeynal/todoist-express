"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaDefaultsPlugin = exports.noSymbolPlugin = void 0;
const mongoose_1 = require("mongoose");
const noSymbolPlugin = (schema) => {
    schema.eachPath((path, schemaType) => {
        if (["name", "description"].includes(path) &&
            schemaType instanceof mongoose_1.Schema.Types.String) {
            schemaType.match(/^[a-zA-Z0-9\s]+$/, `{PATH} should not contain symbols`);
        }
    });
};
exports.noSymbolPlugin = noSymbolPlugin;
const schemaDefaultsPlugin = (schema) => {
    schema.set("toJSON", { virtuals: true });
    schema.set("toObject", { virtuals: true });
    schema.set("timestamps", true);
};
exports.schemaDefaultsPlugin = schemaDefaultsPlugin;
