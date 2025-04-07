"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidBucketPrefix = exports.BUCKET_PREFIXES = void 0;
var BUCKET_PREFIXES;
(function (BUCKET_PREFIXES) {
    BUCKET_PREFIXES["AVATARS"] = "avatars";
    BUCKET_PREFIXES["FEEDBACKS"] = "feedbacks";
})(BUCKET_PREFIXES || (exports.BUCKET_PREFIXES = BUCKET_PREFIXES = {}));
const isValidBucketPrefix = (value) => Object.values(BUCKET_PREFIXES).includes(value);
exports.isValidBucketPrefix = isValidBucketPrefix;
