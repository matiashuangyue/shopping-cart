import { Schema, model } from "mongoose";

const SchemaDtalle = new Schema({
    NameProduc: {type: String, required: true, unique: true},
    Cant: {type: Number, required: true},
    Price: {type: Number}
});
const DetalleModel=model("Detalle", SchemaDtalle);

export default DetalleModel
