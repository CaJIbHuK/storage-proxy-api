import {connect} from "lib/mongoose";

export const mongoose = {
  name : "mongoose",
  init : () => connect()
};