import { Schema } from "mongoose";

const noSymbolPlugin = (schema: Schema) => {
  schema.eachPath((path, schemaType) => {
    if (
      ["name", "description"].includes(path) &&
      schemaType instanceof Schema.Types.String
    ) {
      schemaType.match(/^[a-zA-Z0-9\s]+$/, `{PATH} should not contain symbols`);
    }
  });
};

const schemaDefaultsPlugin = (schema: Schema) => {
  schema.set("toJSON", { virtuals: true });
  schema.set("toObject", { virtuals: true });
  schema.set("timestamps", true);
};

export { noSymbolPlugin, schemaDefaultsPlugin };
