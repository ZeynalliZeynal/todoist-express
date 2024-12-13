"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        let queryObj = {};
        // const excludedFields = ["page", "sort", "limit", "fields"];
        // excludedFields.forEach((el) => delete queryObj[el]);
        if (this.queryString.content)
            queryObj = Object.assign(Object.assign({}, queryObj), { name: {
                    $regex: this.queryString.content,
                    $options: "i",
                } });
        if (this.queryString.categoryName)
            queryObj = Object.assign(Object.assign({}, queryObj), { category: {
                    name: {
                        $regex: this.queryString.categoryName,
                        $options: "i",
                    },
                } });
        if (this.queryString.tags)
            queryObj = Object.assign(Object.assign({}, queryObj), { tags: {
                    $in: this.queryString.tags.split(","),
                } });
        if (this.queryString.priorities)
            queryObj = Object.assign(Object.assign({}, queryObj), { priority: {
                    $in: this.queryString.priorities.split(","),
                } });
        if (this.queryString.completed)
            queryObj = Object.assign(Object.assign({}, queryObj), { completed: this.queryString.completed });
        this.query.find(queryObj);
        return this;
    }
    sort() {
        if (this.queryString.sort)
            this.query = this.query.sort(this.queryString.sort.split(",").join(" "));
        else
            this.query = this.query.sort("-createdAt");
        return this;
    }
    limitFields() {
        if (this.queryString.fields)
            this.query = this.query.select(this.queryString.fields.split(",").join(" "));
        else
            this.query = this.query.select("-__v");
        return this;
    }
    paginate() {
        if (this.queryString.page && this.queryString.limit) {
            const page = +this.queryString.page || 1;
            const limit = +this.queryString.limit || 100;
            const skip = (page - 1) * limit;
            // page=2 1-10 page 1, 11-20 page 2
            this.query = this.query.skip(skip).limit(limit);
        }
        return this;
    }
}
exports.default = ApiFeatures;
