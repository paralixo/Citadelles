import mongoose from "mongoose";

export interface IRouteModelMap {
  route: string;
  model: mongoose.model;
}
